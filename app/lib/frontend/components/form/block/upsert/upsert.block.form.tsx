"use client";
import { FormProvider } from "react-hook-form";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  type BlocksFormInput,
  useUpsertBlockForm,
} from "./use-upsert.block.form";
import { nanoid } from "nanoid";
import { SortableRow } from "../component/sortable-row";
import { TextBlockRow } from "../component/text";
import { BlockType } from "@/app/lib/backend/domain/entity/block";

export function UpsertBlockForm() {
  const {
    form,
    blocks,
    onDragEnd,
    api: { remove, splitAt, duplicateBlock, focusEditableById, focusAtEnd },
  } = useUpsertBlockForm({
    blocks: [
      {
        id: nanoid(),
        type: BlockType.heading_1,
        content: {
          rich: [],
          plain: "Nova página",
        },
      },
    ],
  });

  const { handleSubmit, getValues, setValue, watch } = form;

  const onSubmit = (data: BlocksFormInput) => {
    console.log("Submit blocks:", data);
    alert("JSON salvo no console");
  };

  return (
    <div className="w-full max-w-4xl mx-auto pl-36 pr-8">
      {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}

      <div className="min-h-screen bg-background">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="py-20">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={blocks.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {blocks.map((field, i) => (
                    <div
                      key={field.id}
                      data-block-id={field.id}
                      className="relative"
                    >
                      <SortableRow
                        id={field.id}
                        add={() => splitAt(i)}
                        blockType={watch(`blocks.${i}.type`) || "text"}
                        onTypeChange={(newType) => {
                          setValue(
                            `blocks.${i}.type`,
                            newType as BlocksFormInput["blocks"][number]["type"],
                            {
                              shouldDirty: true,
                            }
                          );
                          queueMicrotask(() => {
                            const row = document.querySelector(
                              `[data-block-id="${field.id}"] div[contenteditable]`
                            ) as HTMLDivElement | null;
                            if (row) {
                              row.focus();
                              focusAtEnd(row);
                            }
                          });
                        }}
                        onDelete={() => {
                          if (blocks.length === 1) return;
                          const prevId =
                            i > 0 ? blocks[i - 1].id : blocks[i + 1]?.id;
                          remove(i);
                          if (prevId) {
                            queueMicrotask(() => focusEditableById(prevId));
                          }
                        }}
                        onDuplicate={() => duplicateBlock(i)}
                      >
                        <TextBlockRow
                          index={i}
                          onSplitBefore={() => splitAt(i)}
                          onBackspaceEmpty={() => {
                            if (i === 0) return;
                            const prevId = blocks[i - 1].id;
                            remove(i);
                            queueMicrotask(() => focusEditableById(prevId));
                          }}
                        />
                      </SortableRow>
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default UpsertBlockForm;
