"use client";

import type { FloorElement, ElementType } from "@/lib/types";
import { ElementRenderer } from "./elements";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { ZoomIn, ZoomOut, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface CanvasProps {
  elements: FloorElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<FloorElement>) => void;
  onAddElement: (type: ElementType, x: number, y: number) => void;
}

export default function Canvas({
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onAddElement,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

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

   const rotateInfo = useRef<{
    isRotating: boolean;
    elementId: string | null;
    startAngle: number;
    elementStartRotation: number;
  }>({
    isRotating: false,
    elementId: null,
    startAngle: 0,
    elementStartRotation: 0,
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
      rotateInfo.current.isRotating = false;
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
        rotateInfo.current.isRotating = false;
    }
  };

  const handleRotateMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    element: FloorElement
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectElement(element.id);

    if (canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const elementCenterX = (element.x + element.width / 2) * zoom + pan.x + canvasRect.left;
      const elementCenterY = (element.y + element.height / 2) * zoom + pan.y + canvasRect.top;
      
      const startAngle = Math.atan2(
        e.clientY - elementCenterY,
        e.clientX - elementCenterX
      ) * (180 / Math.PI);

      rotateInfo.current = {
        isRotating: true,
        elementId: element.id,
        startAngle: startAngle,
        elementStartRotation: element.rotation,
      };
      dragInfo.current.isDragging = false;
      resizeInfo.current.isResizing = false;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const gridSnap = 20;
    const snapThreshold = 15;

    if (isPanning.current) {
        const dx = e.clientX - panStart.current.x;
        const dy = e.clientY - panStart.current.y;
        setPan({
            x: pan.x + dx,
            y: pan.y + dy,
        });
        panStart.current = { x: e.clientX, y: e.clientY };
    } else if (dragInfo.current.isDragging && dragInfo.current.elementId) {
        const dx = (e.clientX - dragInfo.current.startX) / zoom;
        const dy = (e.clientY - dragInfo.current.startY) / zoom;

        let newX = dragInfo.current.elementStartX + dx;
        let newY = dragInfo.current.elementStartY + dy;

        const draggedElement = elements.find(el => el.id === dragInfo.current.elementId);
        
        if (draggedElement?.type === 'wall' && draggedElement.rotation === 0) {
            let snapped = false;
            for (const otherElement of elements) {
                if (otherElement.id === draggedElement.id || otherElement.type !== 'wall' || otherElement.rotation !== 0) continue;

                const draggedPoints = [
                    { x: newX, y: newY },
                    { x: newX + draggedElement.width, y: newY },
                    { x: newX, y: newY + draggedElement.height },
                    { x: newX + draggedElement.width, y: newY + draggedElement.height },
                ];
                const otherPoints = [
                    { x: otherElement.x, y: otherElement.y },
                    { x: otherElement.x + otherElement.width, y: otherElement.y },
                    { x: otherElement.x, y: otherElement.y + otherElement.height },
                    { x: otherElement.x + otherElement.width, y: otherElement.y + otherElement.height },
                ];

                for (const dp of draggedPoints) {
                    for (const op of otherPoints) {
                        if (Math.abs(dp.x - op.x) < snapThreshold && Math.abs(dp.y - op.y) < snapThreshold) {
                            newX -= (dp.x - op.x);
                            newY -= (dp.y - op.y);
                            snapped = true;
                            break;
                        }
                    }
                    if (snapped) break;
                }
                if (snapped) break;
            }
        }
        
        newX = Math.round(newX / gridSnap) * gridSnap;
        newY = Math.round(newY / gridSnap) * gridSnap;
        
        onUpdateElement(dragInfo.current.elementId, { x: newX, y: newY });
    } else if (resizeInfo.current.isResizing && resizeInfo.current.elementId) {
        const dx = (e.clientX - resizeInfo.current.startX) / zoom;
        const dy = (e.clientY - resizeInfo.current.startY) / zoom;

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
    } else if (rotateInfo.current.isRotating && rotateInfo.current.elementId && canvasRef.current) {
        const element = elements.find(el => el.id === rotateInfo.current.elementId);
        if (!element) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const elementCenterX = (element.x + element.width / 2) * zoom + pan.x + canvasRect.left;
        const elementCenterY = (element.y + element.height / 2) * zoom + pan.y + canvasRect.top;

        const currentAngle = Math.atan2(
            e.clientY - elementCenterY,
            e.clientX - elementCenterX
        ) * (180 / Math.PI);

        const angleDifference = currentAngle - rotateInfo.current.startAngle;
        let newRotation = rotateInfo.current.elementStartRotation + angleDifference;

        newRotation = Math.round(newRotation / 15) * 15;
        newRotation = (newRotation % 360 + 360) % 360;

        onUpdateElement(rotateInfo.current.elementId, { rotation: newRotation });
    }
  };

  const handleMouseUp = () => {
    dragInfo.current.isDragging = false;
    dragInfo.current.elementId = null;
    resizeInfo.current.isResizing = false;
    resizeInfo.current.elementId = null;
    rotateInfo.current.isRotating = false;
    rotateInfo.current.elementId = null;
    isPanning.current = false;
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onSelectElement(null);
        if (e.button === 0) { // Left mouse button
            isPanning.current = true;
            panStart.current = { x: e.clientX, y: e.clientY };
        }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const zoomFactor = 0.1;
    if (e.deltaY < 0) {
      setZoom(z => Math.min(2, z + zoomFactor));
    } else {
      setZoom(z => Math.max(0.2, z - zoomFactor));
    }
  };
  
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("application/element-type") as ElementType;
    const gridSnap = 20;

    if (type && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      let x = (e.clientX - rect.left - pan.x) / zoom;
      let y = (e.clientY - rect.top - pan.y) / zoom;
      
      x = Math.round(x / gridSnap) * gridSnap;
      y = Math.round(y / gridSnap) * gridSnap;

      onAddElement(type, x, y);
    }
  };

  return (
    <div
      ref={canvasRef}
      className={cn("relative w-full h-full bg-background overflow-hidden", isPanning.current && "cursor-grabbing")}
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        backgroundPosition: `${pan.x}px ${pan.y}px`,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseDown={handleCanvasMouseDown}
      onWheel={handleWheel}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        className="absolute top-0 left-0"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'top left' }}
      >
        {elements.map((element) => (
          <div key={element.id} onMouseDown={(e) => handleElementMouseDown(e, element)}>
            <ElementRenderer
              element={element}
              isSelected={element.id === selectedElementId}
              onResizeMouseDown={(e) => handleResizeMouseDown(e, element)}
              onRotateMouseDown={(e) => handleRotateMouseDown(e, element)}
            />
          </div>
        ))}
      </div>
       <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.max(0.2, z - 0.1))}>
                <ZoomOut className="w-5 h-5" />
                <span className="sr-only">Zoom Out</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.min(2, z + 0.1))}>
                <ZoomIn className="w-5 h-5" />
                <span className="sr-only">Zoom In</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleResetZoom}>
                <RefreshCcw className="w-5 h-5" />
                <span className="sr-only">Reset Zoom</span>
            </Button>
        </div>
    </div>
  );
}
