import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Anthropic from "npm:@anthropic-ai/sdk";
import { betaZodOutputFormat } from "npm:@anthropic-ai/sdk/helpers/beta/zod";
import { CHAT_SYSTEM_PROMPT } from "./prompts.ts";
import {
  chatResponseSchema,
  type ChatMessage,
  type ChatResponse,
  type RecordRow,
} from "./schema.ts";

interface ChatRequest {
  message: string;
  tableData: RecordRow[];
  history?: ChatMessage[];
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const port = parseInt(Deno.env.get("PORT") || "8087");

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

    const { message, tableData, history = [] }: ChatRequest = await req.json();

    if (!message) {
      throw new Error("No message provided");
    }

    console.log("Processing chat request:", {
      message,
      tableRowCount: tableData?.length || 0,
      historyLength: history.length,
    });

    // Build the context with table data
    const tableContext =
      tableData && tableData.length > 0
        ? `\n\n## Current Table Data (${tableData.length} rows)\n${JSON.stringify(tableData, null, 2)}`
        : "\n\n## Current Table Data\nNo data in table.";

    // Build conversation messages
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

    // Add history (last 10 messages)
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    // Add current user message with table context
    messages.push({
      role: "user",
      content: `${message}${tableContext}`,
    });

    // Call Claude API with structured output using SDK
    const response = await client.beta.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      betas: ["structured-outputs-2025-11-13"],
      system: CHAT_SYSTEM_PROMPT,
      messages,
      output_format: betaZodOutputFormat(chatResponseSchema),
    });

    // Extract the text content from response
    const textBlock = response.content.find((block) => block.type === "text");

    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No response from Claude");
    }

    // Parse the structured response
    const parsedResult: ChatResponse = JSON.parse(textBlock.text);

    console.log("Chat response:", {
      responseLength: parsedResult.response.length,
      modificationsCount: parsedResult.modifications.length,
    });

    return new Response(JSON.stringify(parsedResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({
        response: error instanceof Error ? error.message : "Unknown error",
        modifications: [],
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
