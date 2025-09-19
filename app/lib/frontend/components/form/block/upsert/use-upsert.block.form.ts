"use client";
import { useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DragEndEvent } from "@dnd-kit/core";
import { v4 as uuid } from "uuid";
import { TextBlockSchema } from "../component/text/schema";
import { BlockType } from "@/app/lib/backend/domain/entity/block";
import { nanoid } from "nanoid";

export const BlocksSchema = z.object({
  blocks: z.array(TextBlockSchema).min(1, "Pelo menos um bloco."),
});
export type TextBlock = z.infer<typeof TextBlockSchema>;
export type BlocksFormInput = z.input<typeof BlocksSchema>; // antes do parse (aceita undefined por causa do default)
export type BlocksFormOutput = z.output<typeof BlocksSchema>; // depois do parse (tudo preenchido)

/** ============================ Hook ============================ */
export function useUpsertBlockForm(initial?: Partial<BlocksFormInput>) {
  const form = useForm<BlocksFormInput>({
    resolver: zodResolver(BlocksSchema),
    defaultValues: initial ?? {
      blocks: [
        {
          id: uuid(),
          type: BlockType.heading_1,
          content: { plain: "Digite aqui…" },
        },
      ],
    },
    mode: "onChange",
  });

  const { control, getValues, setValue } = form;
  const {
    fields: blocks,
    insert,
    append,
    remove,
    move,
  } = useFieldArray({
    control,
    name: "blocks",
    keyName: "_key",
  });

  const focusAtEnd = useCallback((el: HTMLElement) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, []);

  const focusEditableById = useCallback(
    (id: string) => {
      const row = document.querySelector(
        `[data-block-id="${id}"] div[contenteditable]`
      ) as HTMLDivElement | null;
      if (row) {
        row.focus();
        focusAtEnd(row);
      }
    },
    [focusAtEnd]
  );
  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = blocks.findIndex((f) => f.id === active.id);
      const newIndex = blocks.findIndex((f) => f.id === String(over.id));
      if (oldIndex !== -1 && newIndex !== -1) move(oldIndex, newIndex);
    },
    [blocks, move]
  );
  const splitAt = useCallback(
    (i: number) => {
      const currentType = getValues(`blocks.${i}.type`) || BlockType.paragraph; // 👈 herda tipo atual
      const id = nanoid();
      insert(i + 1, {
        id,
        type: currentType,
        content: { rich: [], plain: "" },
      }); // 👈 usa currentType
      queueMicrotask(() => {
        const row = document.querySelector(
          `[data-block-id="${id}"] div[contenteditable]`
        ) as HTMLDivElement | null;
        row?.focus();
      });
    },
    [getValues, insert]
  );
  const duplicateBlock = useCallback(
    (i: number) => {
      const currentBlock = getValues(`blocks.${i}`);
      const id = nanoid();
      insert(i + 1, {
        id,
        type: currentBlock.type,
        content: {
          rich: [],
          plain: currentBlock.content.plain,
        },
      });
      queueMicrotask(() => {
        const row = document.querySelector(
          `[data-block-id="${id}"] div[contenteditable]`
        ) as HTMLDivElement | null;
        if (row) {
          row.focus();
          focusAtEnd(row);
        }
      });
    },
    [focusAtEnd, getValues, insert]
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
      splitAt,
      duplicateBlock,
      focusEditableById,
      focusAtEnd,
    }),
    [
      insert,
      append,
      remove,
      move,
      splitAt,
      duplicateBlock,
      focusEditableById,
      focusAtEnd,
      getValues,
      setValue,
    ]
  );

  return { form, blocks, onDragEnd, api };
}
