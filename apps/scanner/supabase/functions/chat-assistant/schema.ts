import { z } from "npm:zod";

// Record row schema (matching the frontend RecordRow type from @pt-dashboard/shared)
export const recordRowSchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  type: z.enum(["kirim", "terima"]),
  companyName: z.string(),
  alatName: z.string(),
  amount: z.number().nullable(),
});

export type RecordRow = z.infer<typeof recordRowSchema>;

// Filter operators for bulk operations
export const filterOperatorSchema = z.enum([
  "equals",
  "notEquals",
  "contains",
  "startsWith",
  "endsWith",
  "greaterThan",
  "lessThan",
]);

// Filter schema for selecting rows
export const filterSchema = z.object({
  field: z.enum(["date", "type", "companyName", "alatName", "amount"]),
  operator: filterOperatorSchema,
  value: z.union([z.string(), z.number()]),
});

// Modification command schemas
export const updateFieldSchema = z.object({
  type: z.literal("update_field"),
  rowIndex: z.number(),
  field: z.enum(["date", "type", "companyName", "alatName", "amount"]),
  value: z.union([z.string(), z.number()]),
});

export const deleteRowsSchema = z.object({
  type: z.literal("delete_rows"),
  filter: filterSchema,
});

export const updateBulkSchema = z.object({
  type: z.literal("update_bulk"),
  filter: filterSchema,
  updates: z.record(z.union([z.string(), z.number()])),
});

export const addRowSchema = z.object({
  type: z.literal("add_row"),
  data: z.object({
    date: z.string().optional(),
    type: z.enum(["kirim", "terima"]).optional(),
    companyName: z.string().optional(),
    alatName: z.string().optional(),
    amount: z.number().nullable().optional(),
  }),
});

// Combined modification schema
export const modificationSchema = z.discriminatedUnion("type", [
  updateFieldSchema,
  deleteRowsSchema,
  updateBulkSchema,
  addRowSchema,
]);

export type TableModification = z.infer<typeof modificationSchema>;

// Chat message schema
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

// Response schema for structured output
export const chatResponseSchema = z.object({
  response: z.string().describe("Friendly response explaining what changes will be made"),
  modifications: z.array(modificationSchema).describe("List of modifications to apply to the table"),
});

export type ChatResponse = z.infer<typeof chatResponseSchema>;
