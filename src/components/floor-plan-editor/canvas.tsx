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

  const resizeInfo = useRef<{
    isResizing: boolean;
    elementId: string | null;
    startX: number;
    startY: number;
    elementStartWidth: number;
    elementStartHeight: number;
  }>({
    isResizing: false,
    elementId: null,
    startX: 0,
    startY: 0,
    elementStartWidth: 0,
    elementStartHeight: 0,
  });

  const handleElementMouseDown = (
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
      resizeInfo.current.isResizing = false;
    }
  };

  const handleResizeMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    element: FloorElement
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    onSelectElement(element.id);

    if (canvasRef.current) {
        resizeInfo.current = {
            isResizing: true,
            elementId: element.id,
            startX: e.clientX,
            startY: e.clientY,
            elementStartWidth: element.width,
            elementStartHeight: element.height,
        };
        dragInfo.current.isDragging = false;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const gridSnap = 20;

    if (dragInfo.current.isDragging && dragInfo.current.elementId) {
        const dx = e.clientX - dragInfo.current.startX;
        const dy = e.clientY - dragInfo.current.startY;

        let newX = dragInfo.current.elementStartX + dx;
        let newY = dragInfo.current.elementStartY + dy;

        newX = Math.round(newX / gridSnap) * gridSnap;
        newY = Math.round(newY / gridSnap) * gridSnap;
        
        onUpdateElement(dragInfo.current.elementId, { x: newX, y: newY });
    } else if (resizeInfo.current.isResizing && resizeInfo.current.elementId) {
        const dx = e.clientX - resizeInfo.current.startX;
        const dy = e.clientY - resizeInfo.current.startY;

        const originalElement = elements.find(el => el.id === resizeInfo.current.elementId);
        if (!originalElement) return;

        let newWidth = resizeInfo.current.elementStartWidth + dx;
        let newHeight = resizeInfo.current.elementStartHeight + dy;

        newWidth = Math.max(gridSnap, Math.round(newWidth / gridSnap) * gridSnap);
        newHeight = Math.max(gridSnap, Math.round(newHeight / gridSnap) * gridSnap);

        const updates: Partial<FloorElement> = { width: newWidth, height: newHeight };

        if (originalElement.type === 'round-table' || originalElement.type === 'plant') {
            const newRadius = Math.max(newWidth, newHeight) / 2;
            updates.radius = Math.round(newRadius / (gridSnap/2)) * (gridSnap/2);
            updates.width = updates.radius * 2;
            updates.height = updates.radius * 2;
        }

        onUpdateElement(resizeInfo.current.elementId, updates);
    }
  };

  const handleMouseUp = () => {
    dragInfo.current.isDragging = false;
    dragInfo.current.elementId = null;
    resizeInfo.current.isResizing = false;
    resizeInfo.current.elementId = null;
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
        <div key={element.id} onMouseDown={(e) => handleElementMouseDown(e, element)}>
          <ElementRenderer
            element={element}
            isSelected={element.id === selectedElementId}
            onResizeMouseDown={(e) => handleResizeMouseDown(e, element)}
          />
        </div>
      ))}
    </div>
  );
}
