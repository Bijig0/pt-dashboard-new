import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Anthropic from "npm:@anthropic-ai/sdk";
import { betaZodOutputFormat } from "npm:@anthropic-ai/sdk/helpers/beta/zod";
import { HANDWRITING_OCR_PROMPT } from "../ocr-claude/ocr.ts";
import { ocrSchema } from "../ocr-claude/schema.ts";

interface OCRRequest {
  image: string; // base64 encoded image
  mimeType?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const port = parseInt(Deno.env.get("PORT") || "8000");

// Helper to create SSE message
function sseMessage(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

Deno.serve({ port }, async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    const client = new Anthropic({ apiKey });

    const { image, mimeType = "image/png" }: OCRRequest = await req.json();

    if (!image) {
      throw new Error("No image provided");
    }

    console.log(
      "Processing image (streaming), size:",
      image.length,
      "bytes, type:",
      mimeType
    );

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        const send = (event: string, data: unknown) => {
          controller.enqueue(encoder.encode(sseMessage(event, data)));
        };

        try {
          // Send initial progress
          send("progress", { step: "Sending to Claude...", percent: 10 });

          // Use SDK streaming with beta features
          const messageStream = client.beta.messages.stream({
            model: "claude-sonnet-4-5",
            max_tokens: 16000,
            betas: [
              "interleaved-thinking-2025-05-14",
              "structured-outputs-2025-11-13",
            ],
            thinking: {
              type: "enabled",
              budget_tokens: 10000,
            },
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "image",
                    source: {
                      type: "base64",
                      media_type: mimeType,
                      data: image,
                    },
                  },
                  {
                    type: "text",
                    text: HANDWRITING_OCR_PROMPT,
                  },
                ],
              },
            ],
            output_format: betaZodOutputFormat(ocrSchema),
          });

          send("progress", { step: "Claude is thinking...", percent: 20 });

          let textContent = "";
          let inThinking = false;

          // Process streaming events from SDK
          for await (const event of messageStream) {
            switch (event.type) {
              case "content_block_start":
                if (event.content_block?.type === "thinking") {
                  inThinking = true;
                  send("progress", {
                    step: "Analyzing image...",
                    percent: 30,
                  });
                } else if (event.content_block?.type === "text") {
                  inThinking = false;
                  send("progress", {
                    step: "Extracting data...",
                    percent: 80,
                  });
                }
                break;

              case "content_block_delta":
                if (event.delta?.type === "thinking_delta") {
                  // Stream thinking content to client
                  const thinking = event.delta.thinking || "";
                  send("thinking", { content: thinking });
                } else if (event.delta?.type === "text_delta") {
                  // Accumulate text content (the JSON result)
                  textContent += event.delta.text || "";
                }
                break;

              case "content_block_stop":
                if (inThinking) {
                  send("progress", {
                    step: "Structuring data...",
                    percent: 70,
                  });
                }
                break;

              case "message_stop":
                // Parse and send the final result
                send("progress", { step: "Complete!", percent: 100 });

                if (textContent) {
                  try {
                    console.log("=== RAW TEXT CONTENT FROM CLAUDE ===");
                    console.log(textContent);

                    const rawJson = JSON.parse(textContent);
                    console.log("=== PARSED JSON (before Zod) ===");
                    console.log(JSON.stringify(rawJson, null, 2));

                    // Log first few rows to see field mapping
                    if (rawJson.data && rawJson.data.length > 0) {
                      console.log("=== FIRST 3 ROWS FIELD MAPPING ===");
                      rawJson.data.slice(0, 3).forEach((row: Record<string, unknown>, i: number) => {
                        console.log(`Row ${i}:`, {
                          date: row.date,
                          type: row.type,
                          companyName: row.companyName,
                          alatName: row.alatName,
                          amount: row.amount,
                        });
                      });
                    }

                    // Parse with Zod to apply transforms (e.g., date string -> Date object)
                    const parsedResult = ocrSchema.parse(rawJson);
                    console.log("=== AFTER ZOD PARSE ===");
                    console.log("First row:", parsedResult.data[0]);

                    send("result", { data: parsedResult });
                  } catch (parseError) {
                    console.error("Failed to parse result:", parseError);
                    console.error("Raw textContent:", textContent);
                    send("error", {
                      message: "Failed to parse OCR result",
                    });
                  }
                }
                break;
            }
          }

          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          send("error", {
            message: error instanceof Error ? error.message : "Unknown error",
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("OCR Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
