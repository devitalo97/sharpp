"use client";
import type React from "react";
import { useLayoutEffect, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { BlocksFormInput } from "../upsert/use-upsert.block.form";
import { TextBlock } from "./text";

export function BlockRender({
  index,
  onSplitBefore,
  onBackspaceEmpty,
}: {
  index: number;
  onSplitBefore: () => void;
  onBackspaceEmpty?: () => void;
}) {
  const { control, watch } = useFormContext<BlocksFormInput>();
  const inputRef = useRef<HTMLDivElement | null>(null);
  const lastAppliedRef = useRef<string>("");

  useLayoutEffect(() => {
    const val = watch(`blocks.${index}.content.plain`) ?? "";
    if (!inputRef.current) return;
    if (inputRef.current.innerText !== val) {
      inputRef.current.innerText = val;
      lastAppliedRef.current = val;
    }
  }, [watch, index]);

  return (
    <div className="group relative">
      <Controller
        control={control}
        name={`blocks.${index}.content.plain`}
        render={({ field }) => (
          <TextBlock
            field={field}
            index={index}
            onSplitBefore={onSplitBefore}
            onBackspaceEmpty={onBackspaceEmpty}
          />
        )}
      />
    </div>
  );
}
