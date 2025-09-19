"use client";
import type React from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import type { BlocksFormInput } from "../../upsert/use-upsert.block.form";

export function TextBlockRow({
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
  const composingRef = useRef(false);
  const lastAppliedRef = useRef<string>("");
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const isEmpty = (e.currentTarget.textContent ?? "").length === 0;

      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSplitBefore();
        return;
      }

      if (e.key === "Backspace" && isEmpty && onBackspaceEmpty) {
        e.preventDefault();
        onBackspaceEmpty();
      }
    },
    [onSplitBefore, onBackspaceEmpty]
  );

  useLayoutEffect(() => {
    const val = watch(`blocks.${index}.content.plain`) ?? "";
    if (!inputRef.current) return;
    if (inputRef.current.innerText !== val) {
      inputRef.current.innerText = val;
      lastAppliedRef.current = val;
    }
  }, [watch, index]);

  const blockType = watch(`blocks.${index}.type`) || "text";
  const content = watch(`blocks.${index}.content.plain`) || "";
  const isEmpty = content.trim() === "";

  const getBlockStyles = (type: string) => {
    switch (type) {
      case "heading_1":
        return {
          className: "text-3xl font-bold leading-tight text-foreground",
          placeholder: "Título 1",
        };
      case "heading_2":
        return {
          className: "text-2xl font-semibold leading-tight text-foreground",
          placeholder: "Título 2",
        };
      case "heading_3":
        return {
          className: "text-xl font-medium leading-tight text-foreground",
          placeholder: "Título 3",
        };
      case "quote":
        return {
          className: [
            "italic text-lg leading-relaxed",
            "text-muted-foreground",
            "border-l-4 border-muted pl-4",
          ].join(" "),
          placeholder: "Escreva uma citação…",
        };
      case "logo":
        return {
          className:
            "text-base leading-relaxed text-foreground flex items-center gap-2",
          placeholder: "Logo ou imagem…",
        };
      default:
        return {
          className: "text-base leading-relaxed text-foreground",
          placeholder: "Digite algo ou pressione '/' para comandos",
        };
    }
  };

  const blockStyles = getBlockStyles(blockType);

  return (
    <div className="group relative">
      <Controller
        control={control}
        name={`blocks.${index}.content.plain`}
        render={({ field }) => (
          <div className="relative">
            <div
              ref={inputRef}
              suppressContentEditableWarning
              dir="ltr"
              role="textbox"
              aria-multiline="true"
              className={`
                ${blockStyles.className}
                min-h-[1.5rem] 
                outline-none 
                whitespace-pre-wrap 
                py-1
                px-0
                transition-all
                duration-200
                ${isFocused ? "ring-0" : ""}
              `}
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => {
                setIsFocused(false);
                const next = (e.currentTarget as HTMLDivElement).innerText;
                if (next !== field.value) field.onChange(next);
              }}
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text/plain");
                document.execCommand("insertText", false, text);
              }}
              onCompositionStart={() => {
                composingRef.current = true;
              }}
              onCompositionEnd={(e) => {
                composingRef.current = false;
                const next = (e.currentTarget as HTMLDivElement).innerText;
                if (next !== field.value) field.onChange(next);
              }}
              onInput={(e) => {
                if (composingRef.current) return;
                const next = (e.currentTarget as HTMLDivElement).innerText;
                if (next !== field.value) field.onChange(next);
              }}
              onKeyDown={handleKeyDown}
              contentEditable="plaintext-only"
              autoFocus={index === 0}
            />
            {isEmpty && !isFocused && (
              <div
                className="absolute inset-0 pointer-events-none text-muted-foreground py-1 select-none"
                style={{
                  fontSize: "inherit",
                  lineHeight: "inherit",
                  fontWeight: "inherit",
                }}
              >
                {blockStyles.placeholder}
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}
