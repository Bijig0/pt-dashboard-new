import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Anthropic from "npm:@anthropic-ai/sdk";
import { betaZodOutputFormat } from "npm:@anthropic-ai/sdk/helpers/beta/zod";
import { HANDWRITING_OCR_PROMPT } from "./ocr.ts";
import { ocrSchema, type OcrResponse } from "./schema.ts";

interface OCRRequest {
  image: string; // base64 encoded image
  mimeType?: string;
}

interface APIResponse {
  success: boolean;
  data?: OcrResponse;
  error?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const port = parseInt(Deno.env.get("PORT") || "8000");

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
      "Processing image, size:",
      image.length,
      "bytes, type:",
      mimeType
    );

    const response = await client.beta.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 16000,
      betas: ["structured-outputs-2025-11-13"],
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

    // With SDK, response is the message object directly
    // Find the text content block containing our JSON
    const textBlock = response.content.find((block) => block.type === "text");

    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No response from Claude");
    }

    // Parse with Zod to apply transforms (e.g., date string -> Date object)
    const parsedResult = ocrSchema.parse(JSON.parse(textBlock.text));

    const result: APIResponse = {
      success: true,
      data: parsedResult,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("OCR Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      } as APIResponse),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
