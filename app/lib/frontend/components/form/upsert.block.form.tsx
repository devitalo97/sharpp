"use client";
import type React from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { FormProvider, useFormContext, Controller } from "react-hook-form";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GripVertical,
  Plus,
  Type,
  Trash2,
  Copy,
  ArrowRight,
  ChevronRight,
  Search,
  Palette,
  Link,
  FolderOpen,
  Edit3,
  Bot,
  List,
  ListOrdered,
  CheckSquare,
  ChevronDown,
  Code,
  Quote,
  AlertTriangle,
  Calculator,
  RefreshCw,
  Ham as H1,
  Ham as H2,
  Ham as H3,
  File,
} from "lucide-react";
import {
  type BlocksFormInput,
  useUpsertBlockForm,
} from "./use-upsert.block.form";
import { nanoid } from "nanoid";

function DragMenu({
  blockType,
  onTypeChange,
  onDelete,
  onDuplicate,
  onClose,
}: {
  blockType: string;
  onTypeChange: (type: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onClose: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showTurnInto, setShowTurnInto] = useState(false);
  const [showColor, setShowColor] = useState(false);

  const blockTypes = [
    { type: "text", label: "Text", icon: Type, category: "basic" },
    { type: "heading_1", label: "Heading 1", icon: H1, category: "basic" },
    { type: "heading_2", label: "Heading 2", icon: H2, category: "basic" },
    { type: "heading_3", label: "Heading 3", icon: H3, category: "basic" },
    { type: "page", label: "Page", icon: File, category: "page" },
    {
      type: "bulleted_list",
      label: "Bulleted list",
      icon: List,
      category: "list",
    },
    {
      type: "numbered_list",
      label: "Numbered list",
      icon: ListOrdered,
      category: "list",
    },
    {
      type: "todo_list",
      label: "To-do list",
      icon: CheckSquare,
      category: "list",
    },
    {
      type: "toggle_list",
      label: "Toggle list",
      icon: ChevronDown,
      category: "list",
    },
    { type: "code", label: "Code", icon: Code, category: "media" },
    { type: "quote", label: "Quote", icon: Quote, category: "media" },
    {
      type: "callout",
      label: "Callout",
      icon: AlertTriangle,
      category: "media",
    },
    {
      type: "equation",
      label: "Block equation",
      icon: Calculator,
      category: "media",
    },
  ];

  const getCurrentBlockLabel = () => {
    const current = blockTypes.find((b) => b.type === blockType);
    return current?.label || "Text";
  };

  const filteredBlockTypes = blockTypes.filter((type) =>
    type.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showTurnInto) {
    return (
      <div className="absolute top-0 left-8 bg-popover border border-border rounded-md shadow-lg z-50 w-80 py-1">
        {/* Header with back button */}
        <div className="flex items-center px-3 py-2 border-b border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowTurnInto(false)}
            className="h-6 w-6 p-0 mr-2 hover:bg-accent text-muted-foreground"
          >
            <ArrowRight size={14} className="rotate-180" />
          </Button>
          <span className="text-sm font-medium text-foreground">Turn into</span>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search for a block type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-8 bg-background border-input focus:border-ring"
              autoFocus
            />
          </div>
        </div>

        {/* Block types */}
        <div className="max-h-80 overflow-y-auto">
          {/* Basic blocks */}
          <div className="px-3 py-1">
            <div className="text-xs font-medium text-muted-foreground mb-1">
              Basic blocks
            </div>
            {filteredBlockTypes
              .filter((type) => type.category === "basic")
              .map((type) => (
                <Button
                  key={type.type}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onTypeChange(type.type);
                    onClose();
                  }}
                  className={`w-full justify-start h-8 px-3 text-sm hover:bg-accent ${
                    blockType === type.type ? "bg-accent" : ""
                  }`}
                >
                  <type.icon size={16} className="mr-3 text-muted-foreground" />
                  <span className="text-foreground">{type.label}</span>
                  {blockType === type.type && (
                    <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                  )}
                </Button>
              ))}
          </div>

          {/* Lists */}
          {filteredBlockTypes.some((type) => type.category === "list") && (
            <div className="px-3 py-1">
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Lists
              </div>
              {filteredBlockTypes
                .filter((type) => type.category === "list")
                .map((type) => (
                  <Button
                    key={type.type}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onTypeChange(type.type);
                      onClose();
                    }}
                    className="w-full justify-start h-8 px-3 text-sm hover:bg-accent"
                  >
                    <type.icon
                      size={16}
                      className="mr-3 text-muted-foreground"
                    />
                    <span className="text-foreground">{type.label}</span>
                  </Button>
                ))}
            </div>
          )}

          {/* Media */}
          {filteredBlockTypes.some((type) => type.category === "media") && (
            <div className="px-3 py-1">
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Media
              </div>
              {filteredBlockTypes
                .filter((type) => type.category === "media")
                .map((type) => (
                  <Button
                    key={type.type}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onTypeChange(type.type);
                      onClose();
                    }}
                    className="w-full justify-start h-8 px-3 text-sm hover:bg-accent"
                  >
                    <type.icon
                      size={16}
                      className="mr-3 text-muted-foreground"
                    />
                    <span className="text-foreground">{type.label}</span>
                  </Button>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showColor) {
    return (
      <div className="absolute top-0 left-8 bg-popover border border-border rounded-md shadow-lg z-50 w-80 py-1">
        {/* Header with back button */}
        <div className="flex items-center px-3 py-2 border-b border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowColor(false)}
            className="h-6 w-6 p-0 mr-2 hover:bg-accent text-muted-foreground"
          >
            <ArrowRight size={14} className="rotate-180" />
          </Button>
          <span className="text-sm font-medium text-foreground">Color</span>
        </div>

        {/* Text colors */}
        <div className="px-3 py-2">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Text color
          </div>
          <div className="space-y-1">
            {[
              {
                color: "default",
                label: "Default text",
                class: "text-foreground",
              },
              {
                color: "gray",
                label: "Gray text",
                class: "text-muted-foreground",
              },
              { color: "brown", label: "Brown text", class: "text-amber-600" },
              {
                color: "orange",
                label: "Orange text",
                class: "text-orange-500",
              },
              {
                color: "yellow",
                label: "Yellow text",
                class: "text-yellow-500",
              },
              { color: "green", label: "Green text", class: "text-green-500" },
              { color: "blue", label: "Blue text", class: "text-blue-500" },
              {
                color: "purple",
                label: "Purple text",
                class: "text-purple-500",
              },
              { color: "pink", label: "Pink text", class: "text-pink-500" },
              { color: "red", label: "Red text", class: "text-red-500" },
            ].map((color) => (
              <Button
                key={color.color}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Handle color change
                  onClose();
                }}
                className="w-full justify-start h-8 px-3 text-sm hover:bg-accent"
              >
                <span className={`mr-3 font-bold ${color.class}`}>A</span>
                <span className="text-foreground">{color.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Background colors */}
        <div className="px-3 py-2 border-t border-border">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Background color
          </div>
          <div className="space-y-1">
            {[
              { color: "default", label: "Default background" },
              { color: "gray", label: "Gray background" },
              { color: "brown", label: "Brown background" },
            ].map((bg) => (
              <Button
                key={bg.color}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Handle background change
                  onClose();
                }}
                className="w-full justify-start h-8 px-3 text-sm hover:bg-accent"
              >
                <div className="mr-3 w-4 h-4 rounded border border-border bg-muted" />
                <span className="text-foreground">{bg.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-8 bg-popover border border-border rounded-md shadow-lg z-50 w-80 py-1">
      {/* Search bar */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search actions..."
            className="pl-9 h-8 bg-background border-input focus:border-ring"
          />
        </div>
      </div>

      {/* Current block type */}
      <div className="px-3 py-1">
        <div className="text-xs font-medium text-muted-foreground mb-1">
          {getCurrentBlockLabel()}
        </div>
      </div>

      {/* Main actions */}
      <div className="px-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowTurnInto(true)}
          className="w-full justify-between h-8 px-3 text-sm hover:bg-accent"
        >
          <div className="flex items-center">
            <RefreshCw size={16} className="mr-3 text-muted-foreground" />
            <span className="text-foreground">Turn into</span>
          </div>
          <ChevronRight size={14} className="text-muted-foreground" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowColor(true)}
          className="w-full justify-between h-8 px-3 text-sm hover:bg-accent"
        >
          <div className="flex items-center">
            <Palette size={16} className="mr-3 text-muted-foreground" />
            <span className="text-foreground">Color</span>
          </div>
          <ChevronRight size={14} className="text-muted-foreground" />
        </Button>
      </div>

      {/* Separator */}
      <div className="border-t border-border my-1" />

      {/* Secondary actions */}
      <div className="px-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            // Copy link functionality
            onClose();
          }}
          className="w-full justify-between h-8 px-3 text-sm hover:bg-accent"
        >
          <div className="flex items-center">
            <Link size={16} className="mr-3 text-muted-foreground" />
            <span className="text-foreground">Copy link to block</span>
          </div>
          <span className="text-xs text-muted-foreground">Alt+⌘+L</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            onDuplicate();
            onClose();
          }}
          className="w-full justify-between h-8 px-3 text-sm hover:bg-accent"
        >
          <div className="flex items-center">
            <Copy size={16} className="mr-3 text-muted-foreground" />
            <span className="text-foreground">Duplicate</span>
          </div>
          <span className="text-xs text-muted-foreground">Ctrl+D</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            // Move to functionality
            onClose();
          }}
          className="w-full justify-between h-8 px-3 text-sm hover:bg-accent"
        >
          <div className="flex items-center">
            <FolderOpen size={16} className="mr-3 text-muted-foreground" />
            <span className="text-foreground">Move to</span>
          </div>
          <span className="text-xs text-muted-foreground">Ctrl+⌘+P</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="w-full justify-between h-8 px-3 text-sm hover:bg-accent"
        >
          <div className="flex items-center">
            <Trash2 size={16} className="mr-3 text-muted-foreground" />
            <span className="text-foreground">Delete</span>
          </div>
          <span className="text-xs text-muted-foreground">Del</span>
        </Button>
      </div>

      {/* Separator */}
      <div className="border-t border-border my-1" />

      {/* AI actions */}
      <div className="px-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            // Suggest edits functionality
            onClose();
          }}
          className="w-full justify-between h-8 px-3 text-sm hover:bg-accent"
        >
          <div className="flex items-center">
            <Edit3 size={16} className="mr-3 text-muted-foreground" />
            <span className="text-foreground">Suggest edits</span>
          </div>
          <span className="text-xs text-muted-foreground">Ctrl+⌘+Alt+X</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            // Ask AI functionality
            onClose();
          }}
          className="w-full justify-between h-8 px-3 text-sm hover:bg-accent"
        >
          <div className="flex items-center">
            <Bot size={16} className="mr-3 text-muted-foreground" />
            <span className="text-foreground">Ask AI</span>
          </div>
          <span className="text-xs text-muted-foreground">Ctrl+J</span>
        </Button>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-border mt-1">
        <div className="text-xs text-muted-foreground">
          Last edited by italo de souza
        </div>
        <div className="text-xs text-muted-foreground">Today at 8:20 PM</div>
      </div>
    </div>
  );
}

/** ============================ Sortable Item ============================ */
function SortableRow({
  id,
  children,
  add,
  blockType,
  onTypeChange,
  onDelete,
  onDuplicate,
}: {
  id: string;
  children: React.ReactNode;
  add: () => void;
  blockType: string;
  onTypeChange: (type: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const [showMenu, setShowMenu] = useState(false);
  const mouseDownTimeRef = useRef<number>(0);
  const mouseDownPosRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const dragThreshold = 5; // pixels to move before considering it a drag

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseDownTimeRef.current = Date.now();
    mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
    hasDraggedRef.current = false;
    setShowMenu(false); // Close menu when starting any interaction

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = Math.abs(moveEvent.clientX - mouseDownPosRef.current.x);
      const deltaY = Math.abs(moveEvent.clientY - mouseDownPosRef.current.y);

      if (deltaX > dragThreshold || deltaY > dragThreshold) {
        hasDraggedRef.current = true;
      }
    };

    const handleMouseUp = () => {
      const clickDuration = Date.now() - mouseDownTimeRef.current;

      // If it was a quick click without dragging, toggle menu
      if (!hasDraggedRef.current && clickDuration < 200) {
        setShowMenu((prev) => !prev);
      }

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  const handleClickOutside = useCallback(() => {
    setShowMenu(false);
  }, []);

  const closeMenu = useCallback(() => {
    setShowMenu(false);
  }, []);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex items-start py-1 hover:bg-muted/20 rounded-sm transition-colors"
    >
      <div className="absolute -left-14 top-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => add()}
          aria-label="Inserir abaixo"
          className="h-6 w-6 text-muted-foreground hover:bg-muted hover:text-foreground rounded-sm"
        >
          <Plus size={14} />
        </Button>

        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            {...attributes}
            {...listeners}
            onMouseDown={handleMouseDown}
            className="h-6 w-6 text-muted-foreground hover:bg-muted hover:text-foreground rounded-sm cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none" }}
            aria-label="Arrastar ou abrir menu"
          >
            <GripVertical size={14} />
          </Button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={handleClickOutside}
              />
              <DragMenu
                blockType={blockType}
                onTypeChange={onTypeChange}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onClose={closeMenu}
              />
            </>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0 ml-0">{children}</div>
    </div>
  );
}

/** ============================ Block Row ============================ */
function TextBlockRow({
  index,
  onSplitBefore,
  onBackspaceEmpty,
}: {
  index: number;
  onSplitBefore: () => void;
  onBackspaceEmpty?: () => void;
}) {
  const { control, getValues, setValue } = useFormContext<BlocksFormInput>();
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
    const val = getValues(`blocks.${index}.content.plain`) ?? "";
    if (!inputRef.current) return;
    if (inputRef.current.innerText !== val) {
      inputRef.current.innerText = val;
      lastAppliedRef.current = val;
    }
  }, [getValues, index]);

  const blockType = getValues(`blocks.${index}.type`) || "text";
  const content = getValues(`blocks.${index}.content.plain`) || "";
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

/** ============================ The Form ============================ */
export function UpsertBlockForm() {
  const { methods, fields, onDragEnd, api } = useUpsertBlockForm({
    blocks: [
      {
        id: nanoid(),
        type: "text",
        content: { rich: [], plain: "" },
      },
    ],
  });

  const { handleSubmit, getValues, setValue } = methods;
  const { insert, remove } = api;

  const splitAt = useCallback(
    (i: number) => {
      const id = nanoid();
      insert(i + 1, { id, type: "text", content: { rich: [], plain: "" } });
      queueMicrotask(() => {
        const row = document.querySelector(
          `[data-block-id="${id}"] div[contenteditable]`
        ) as HTMLDivElement | null;
        row?.focus();
      });
    },
    [insert]
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
    [insert, getValues]
  );

  const onSubmit = (data: BlocksFormInput) => {
    console.log("Submit blocks:", data);
    alert("JSON salvo no console");
  };

  function focusAtEnd(el: HTMLElement) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  const focusEditableById = (id: string) => {
    const row = document.querySelector(
      `[data-block-id="${id}"] div[contenteditable]`
    ) as HTMLDivElement | null;
    if (row) {
      row.focus();
      focusAtEnd(row);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pl-36 pr-8">
      <div className="min-h-screen bg-background">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="py-20">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={fields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {fields.map((field, i) => (
                    <div
                      key={field.id}
                      data-block-id={field.id}
                      className="relative"
                    >
                      <SortableRow
                        id={field.id}
                        add={() => splitAt(i)}
                        blockType={getValues(`blocks.${i}.type`) || "text"}
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
                          if (fields.length === 1) return;
                          const prevId =
                            i > 0 ? fields[i - 1].id : fields[i + 1]?.id;
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
                            const prevId = fields[i - 1].id;
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
