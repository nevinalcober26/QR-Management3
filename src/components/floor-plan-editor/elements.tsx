import type { TableElement, FloorElement, PlantElement, DoorElement } from "@/lib/types";
import { cn } from "@/lib/utils";
import React from "react";
import { Sprout, Expand, RotateCw } from "lucide-react";

interface ElementProps {
  element: FloorElement;
  isSelected: boolean;
  onResizeMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onRotateMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const elementBaseClasses = "absolute transition-all duration-75 cursor-grab active:cursor-grabbing";
const selectedClasses = "outline outline-2 outline-offset-2 outline-accent";

const TableContent = ({ element }: { element: TableElement }) => (
  <div className="w-full h-full flex flex-col items-center justify-center text-xs font-medium text-primary-foreground select-none p-1">
    <div className="font-bold text-sm">{element.tableName}</div>
    <div>({element.seats} seats)</div>
  </div>
);

const ResizeHandle = ({ onMouseDown }: { onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void }) => (
    <div
      onMouseDown={onMouseDown}
      className="absolute -bottom-2 -right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center cursor-nwse-resize z-10 shadow"
    >
      <Expand className="w-3 h-3 text-accent-foreground" />
    </div>
);

const RotateHandle = ({ onMouseDown }: { onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void }) => (
  <div
    onMouseDown={onMouseDown}
    className="absolute -top-2 -right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center cursor-alias z-10 shadow"
  >
    <RotateCw className="w-3 h-3 text-accent-foreground" />
  </div>
);


export const ElementRenderer: React.FC<ElementProps> = ({
  element,
  isSelected,
  onResizeMouseDown,
  onRotateMouseDown,
}) => {
  const style: React.CSSProperties = {
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    transform: `rotate(${element.rotation}deg)`,
    transformOrigin: "center center",
  };

  const commonProps = {
    style,
    className: cn(elementBaseClasses, isSelected && selectedClasses),
  };

  const renderElement = (children: React.ReactNode) => (
    <div {...commonProps}>
      {children}
      {isSelected && <ResizeHandle onMouseDown={onResizeMouseDown} />}
      {isSelected && <RotateHandle onMouseDown={onRotateMouseDown} />}
    </div>
  );

  const getElementStyleWithBorderRadius = (
    el: FloorElement,
    extraStyles: React.CSSProperties = {}
  ): React.CSSProperties => {
    const elStyle = { ...extraStyles };
    if (el.borderRadius !== undefined) {
      elStyle.borderRadius = `${el.borderRadius}px`;
    }
    return elStyle;
  };

  switch (element.type) {
    case "square-table":
    case "rectangle-table": {
      const tableEl = element as TableElement;
      return renderElement(
        <div
          className="w-full h-full bg-primary border border-primary-foreground/20 shadow-md"
          style={getElementStyleWithBorderRadius(element)}
        >
          <TableContent element={tableEl} />
        </div>
      );
    }
    case "round-table": {
      const tableEl = element as TableElement;
      return renderElement(
        <div className="w-full h-full bg-primary border border-primary-foreground/20 rounded-full shadow-md">
          <TableContent element={tableEl} />
        </div>
      );
    }
    case "wall":
      return renderElement(
        <div
          className="w-full h-full bg-muted-foreground/60 shadow-sm"
          style={getElementStyleWithBorderRadius(element)}
        />
      );
    case "door": {
        const doorEl = element as DoorElement;
        return renderElement(
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div
              style={{ transformOrigin: 'left center' }}
              className={cn("border-2 border-accent/50 p-0.5 w-full h-full relative")}
            >
              <div className="w-full h-full bg-accent/20" />
            </div>
             {doorEl.label && (
              <div className="text-xs text-foreground select-none mt-1 whitespace-nowrap">{doorEl.label}</div>
            )}
          </div>
        );
      }
    case "plant":
      return renderElement(
        <div
          className={cn(
            "w-full h-full bg-secondary rounded-full flex items-center justify-center shadow-md"
          )}
        >
          <Sprout className="w-3/4 h-3/4 text-chart-2" />
        </div>
      );
    default:
      return null;
  }
};
