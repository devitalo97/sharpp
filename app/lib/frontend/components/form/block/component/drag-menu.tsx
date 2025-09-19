import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
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

export function DragMenu({
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
    { type: "paragraph", label: "Paragrafo", icon: Type, category: "basic" },
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
