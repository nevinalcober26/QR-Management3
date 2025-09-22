"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import Sidebar from "./sidebar";
import Canvas from "./canvas";
import Inspector from "./inspector";
import { useState } from "react";
import type { ElementType, FloorElement } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface FloorPlanEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FloorPlanEditor({
  open,
  onOpenChange,
}: FloorPlanEditorProps) {
  const [elements, setElements] = useState<FloorElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const { toast } = useToast();

  const handleAddElement = (type: ElementType) => {
    const newElement: FloorElement = {
      id: crypto.randomUUID(),
      type,
      x: 150,
      y: 150,
      rotation: 0,
      // Default properties
      ...(type === "round-table" && { seats: 4, radius: 24, width: 48, height: 48 }),
      ...(type === "square-table" && { seats: 4, width: 48, height: 48 }),
      ...(type === "rectangle-table" && { seats: 6, width: 72, height: 36 }),
      ...(type === "wall" && { width: 120, height: 8 }),
      ...(type === "door" && { width: 36, height: 8 }),
      ...(type === "plant" && { radius: 12, width: 24, height: 24 }),
    } as FloorElement;

    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
    toast({
      title: `Added ${type.replace("-", " ")}`,
      description: "You can drag it on the canvas or edit its properties.",
    });
  };

  const handleUpdateElement = (id: string, updates: Partial<FloorElement>) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          const newEl = { ...el, ...updates };
          // Sync radius with width/height for round elements
          if (newEl.type === 'round-table' || newEl.type === 'plant') {
            if (updates.radius) {
                newEl.width = updates.radius * 2;
                newEl.height = updates.radius * 2;
            }
          }
          return newEl;
        }
        return el;
      })
    );
  };

  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const selectedElement =
    elements.find((el) => el.id === selectedElementId) ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-2xl w-[95%] h-[90vh] p-0 gap-0 border-0">
        <div className="grid grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr_320px] h-full rounded-lg overflow-hidden shadow-2xl">
          <Sidebar onElementAdd={handleAddElement} />
          <Canvas
            elements={elements}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElement={handleUpdateElement}
          />
          <div className="hidden lg:block bg-card">
            <Inspector
              selectedElement={selectedElement}
              onUpdateElement={handleUpdateElement}
              onDeleteElement={handleDeleteElement}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
