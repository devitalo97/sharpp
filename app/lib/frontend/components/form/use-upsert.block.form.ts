"use client";
import { useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DragEndEvent } from "@dnd-kit/core";
import { v4 as uuid } from "uuid";

/** ================== Types aligned to the user's Block shape ================== */
export const BlockType = z.enum([
  "text",
  "heading_1",
  "heading_2",
  "heading_3",
]);

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
  id: z.string().uuid(),
  type: BlockType,
  content: TextContent,
});

export const BlocksSchema = z.object({
  blocks: z.array(TextBlockSchema).min(1, "Pelo menos um bloco."),
});

export type TextBlock = z.infer<typeof TextBlockSchema>;

// Use tipos separados p/ RHF (input) e dados finais (output)
export type BlocksFormInput = z.input<typeof BlocksSchema>; // antes do parse (aceita undefined por causa do default)
export type BlocksFormOutput = z.output<typeof BlocksSchema>; // depois do parse (tudo preenchido)

/** ============================ Hook ============================ */
export function useUpsertBlockForm(initial?: Partial<BlocksFormInput>) {
  const methods = useForm<BlocksFormInput>({
    resolver: zodResolver(BlocksSchema),
    defaultValues: initial ?? {
      blocks: [
        {
          id: uuid(),
          type: "text",
          content: { rich: [], plain: "Digite aqui…" },
        },
      ],
    },
    mode: "onChange",
  });

  const { control, getValues, setValue } = methods;
  const { fields, insert, append, remove, move } = useFieldArray({
    control,
    name: "blocks",
    keyName: "_key",
  });

  // DnD handler to reorder blocks
  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === String(over.id));
      if (oldIndex !== -1 && newIndex !== -1) move(oldIndex, newIndex);
    },
    [fields, move]
  );

  // API for consumers (save, serialize, etc.)
  const api = useMemo(
    () => ({
      getData: () => BlocksSchema.parse(getValues()),
      setBlocks: (blocks: TextBlock[]) =>
        setValue("blocks", blocks, { shouldDirty: true }),
      insert,
      append,
      remove,
      move,
    }),
    [getValues, setValue, insert, append, remove, move]
  );

  return { methods, fields, onDragEnd, api };
}
