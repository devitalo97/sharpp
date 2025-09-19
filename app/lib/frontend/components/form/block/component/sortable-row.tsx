"use client";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { GripVertical, Plus } from "lucide-react";
import { DragMenu } from "./drag-menu";

export function SortableRow({
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
