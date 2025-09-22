import type { TableElement, FloorElement, PlantElement } from "@/lib/types";
import { cn } from "@/lib/utils";
import React from "react";
import { Sprout } from "lucide-react";

interface ElementProps {
  element: FloorElement;
  isSelected: boolean;
}

const elementBaseClasses = "absolute transition-all duration-75 cursor-grab active:cursor-grabbing";
const selectedClasses = "outline outline-2 outline-offset-2 outline-accent";

const TableContent = ({ element }: { element: TableElement }) => (
  <div className="w-full h-full flex items-center justify-center text-sm font-medium text-primary-foreground select-none">
    {element.seats}
  </div>
);

export const ElementRenderer: React.FC<ElementProps> = ({
  element,
  isSelected,
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

  switch (element.type) {
    case "square-table":
    case "rectangle-table": {
      const tableEl = element as TableElement;
      return (
        <div {...commonProps}>
          <div className="w-full h-full bg-primary border border-primary-foreground/20 rounded-sm shadow-md">
            <TableContent element={tableEl} />
          </div>
        </div>
      );
    }
    case "round-table": {
      const tableEl = element as TableElement;
      return (
        <div {...commonProps}>
          <div className="w-full h-full bg-primary border border-primary-foreground/20 rounded-full shadow-md">
            <TableContent element={tableEl} />
          </div>
        </div>
      );
    }
    case "wall":
      return (
        <div
          {...commonProps}
          className={cn(commonProps.className, "bg-muted-foreground/60 rounded-sm shadow-sm")}
        />
      );
    case "door":
      return (
        <div
          {...commonProps}
          style={{ ...style, transformOrigin: 'left center' }}
          className={cn(commonProps.className, "border-2 border-accent/50 p-0.5")}
        >
          <div className="w-full h-full bg-accent/20" />
        </div>
      );
    case "plant":
      return (
        <div
          {...commonProps}
          className={cn(
            commonProps.className,
            "bg-secondary rounded-full flex items-center justify-center shadow-md"
          )}
        >
          <Sprout className="w-3/4 h-3/4 text-chart-2" />
        </div>
      );
    default:
      return null;
  }
};
