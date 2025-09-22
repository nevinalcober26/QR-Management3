import type { TableElement, FloorElement, PlantElement, DoorElement, WindowElement } from "@/lib/types";
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

const TableContent = ({ element, isSelected }: { element: TableElement, isSelected: boolean }) => (
  <div className={cn(
    "w-full h-full flex flex-col items-center justify-center text-xs font-medium select-none p-1",
    isSelected ? 'text-primary' : 'text-green-800'
    )}>
    <div className="font-bold text-sm">{element.tableName}</div>
    <div>({element.seats} seats)</div>
  </div>
);

const ResizeHandle = ({ onMouseDown }: { onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void }) => (
    <div
      onMouseDown={onMouseDown}
      className="absolute -bottom-2 -right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center cursor-nwse-resize z-20 shadow"
    >
      <Expand className="w-3 h-3 text-accent-foreground" />
    </div>
);

const RotateHandle = ({ onMouseDown }: { onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void }) => (
  <div
    onMouseDown={onMouseDown}
    className="absolute -top-2 -right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center cursor-alias z-20 shadow"
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
          className={cn(
            "w-full h-full shadow-md",
            isSelected ? "bg-primary/20 border-primary" : "bg-green-100 border-green-600",
            "border"
          )}
          style={getElementStyleWithBorderRadius(element)}
        >
          <TableContent element={tableEl} isSelected={isSelected} />
        </div>
      );
    }
    case "round-table": {
      const tableEl = element as TableElement;
      return renderElement(
        <div className={cn(
            "w-full h-full rounded-full shadow-md",
            isSelected ? "bg-primary/20 border-primary" : "bg-green-100 border-green-600",
            "border"
          )}>
          <TableContent element={tableEl} isSelected={isSelected} />
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
        const iconHeight = 24;
        const labelHeight = element.height - iconHeight;

        return renderElement(
          <div className="w-full h-full flex flex-col items-center justify-start">
             {doorEl.label && (
                <div 
                  className="text-lg text-foreground select-none whitespace-nowrap font-semibold"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: `${labelHeight}px`, lineHeight: 1 }}
                >
                  {doorEl.label}
                </div>
            )}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500" style={{ height: `${iconHeight}px`}}>
              <path d="M4 21.4375V2.5625C4 2.25201 4.25201 2 4.5625 2H19.4375C19.748 2 20 2.25201 20 2.5625V10.3125H18.125V3.875H5.875V21.4375H18.125V13.0625H20V21.4375C20 21.748 19.748 22 19.4375 22H4.5625C4.25201 22 4 21.748 4 21.4375Z" fill="currentColor"/>
              <path d="M14.625 11.125C14.2443 11.125 13.9375 11.4318 13.9375 11.8125C13.9375 12.1932 14.2443 12.5 14.625 12.5C15.0057 12.5 15.3125 12.1932 15.3125 11.8125C15.3125 11.4318 15.0057 11.125 14.625 11.125Z" fill="currentColor"/>
              <path d="M20 10.3125V13.0625H22.75V10.3125H20Z" fill="currentColor"/>
            </svg>
          </div>
        );
      }
    case "window":
        return renderElement(
            <div className="w-full h-full bg-background border-2 border-accent flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-accent/20" />
                <div className="absolute w-[calc(100%-4px)] h-0.5 bg-accent" />
            </div>
        );
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
