"use client";

import type { FloorElement } from "@/lib/types";
import { ElementRenderer } from "./elements";
import React, { useRef } from "react";

interface CanvasProps {
  elements: FloorElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<FloorElement>) => void;
}

export default function Canvas({
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragInfo = useRef<{
    isDragging: boolean;
    elementId: string | null;
    startX: number;
    startY: number;
    elementStartX: number;
    elementStartY: number;
  }>({
    isDragging: false,
    elementId: null,
    startX: 0,
    startY: 0,
    elementStartX: 0,
    elementStartY: 0,
  });

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    element: FloorElement
  ) => {
    e.preventDefault();
    e.stopPropagation();

    onSelectElement(element.id);

    if (canvasRef.current) {
      dragInfo.current = {
        isDragging: true,
        elementId: element.id,
        startX: e.clientX,
        startY: e.clientY,
        elementStartX: element.x,
        elementStartY: element.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragInfo.current.isDragging || !dragInfo.current.elementId) return;

    const dx = e.clientX - dragInfo.current.startX;
    const dy = e.clientY - dragInfo.current.startY;

    const gridSnap = 20;
    let newX = dragInfo.current.elementStartX + dx;
    let newY = dragInfo.current.elementStartY + dy;

    newX = Math.round(newX / gridSnap) * gridSnap;
    newY = Math.round(newY / gridSnap) * gridSnap;
    
    onUpdateElement(dragInfo.current.elementId, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    dragInfo.current.isDragging = false;
    dragInfo.current.elementId = null;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === canvasRef.current) {
      onSelectElement(null);
    }
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-background overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
    >
      {elements.map((element) => (
        <div key={element.id} onMouseDown={(e) => handleMouseDown(e, element)}>
          <ElementRenderer
            element={element}
            isSelected={element.id === selectedElementId}
          />
        </div>
      ))}
    </div>
  );
}
