import { BlockType } from "@/app/lib/backend/domain/entity/block";
import z from "zod";

const RichTextSpan = z.object({
  text: z.string().min(0),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
});

const TextContent = z.object({
  rich: z.array(RichTextSpan).default([]), // room for future inline styling (bold/italic/etc.)
  plain: z.string().default(""), // denormalized for quick rendering / searching
});

export const TextBlockSchema = z.object({
  id: z.uuid(),
  type: z.enum(BlockType),
  content: TextContent,
});
