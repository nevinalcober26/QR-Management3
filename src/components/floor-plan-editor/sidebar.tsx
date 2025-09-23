"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { ElementType } from "@/lib/types";
import {
  Circle,
  DoorOpen,
  Minus,
  RectangleHorizontal,
  Sprout,
  Square,
  CornerUpLeft,
  Type,
} from "lucide-react";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";

interface SidebarProps {
  onElementAdd: (type: ElementType) => void;
}

export default function Sidebar({
  onElementAdd,
}: SidebarProps) {
  const tableElements = [
    { type: "round-table", icon: Circle, label: "Round Table" },
    { type: "square-table", icon: Square, label: "Square Table" },
    {
      type: "rectangle-table",
      icon: RectangleHorizontal,
      label: "Rectangle Table",
    },
  ] as const;

  const otherElements = [
    { type: "wall", icon: Minus, label: "Wall" },
    { type: "door", icon: DoorOpen, label: "Door" },
    { type: "window", icon: RectangleHorizontal, label: "Window" },
    { type: "plant", icon: Sprout, label: "Plant" },
    { type: "l-shape", icon: CornerUpLeft, label: "L-Shape" },
    { type: "curved-l-shape", icon: CornerUpLeft, label: "Curved L-Shape" },
    { type: "text", icon: Type, label: "Text" },
    { type: "rectangle", icon: RectangleHorizontal, label: "Rectangle" },
    { type: "circle", icon: Circle, label: "Circle" },
  ] as const;

  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData("application/element-type", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const renderElementList = (
    elements: Readonly<(typeof tableElements | typeof otherElements)>
  ) => (
    <div className="flex flex-col gap-2">
      {elements.map(({ type, icon: Icon, label }) => (
        <Button
          key={type}
          variant="outline"
          className="flex h-auto w-full cursor-grab justify-start gap-4 p-2 text-left"
          onClick={() => onElementAdd(type)}
          draggable
          onDragStart={(e) => handleDragStart(e, type)}
        >
          <Icon className="h-6 w-6 text-accent" />
          <span className="text-sm text-muted-foreground">{label}</span>
        </Button>
      ))}
    </div>
  );


  return (
    <div className="flex flex-col h-full bg-card border-r">
        <ScrollArea className="flex-grow p-2">
            <Accordion
                type="multiple"
                defaultValue={["tables", "other"]}
                className="w-full"
            >
                <AccordionItem value="tables">
                <AccordionTrigger className="px-2 text-base font-medium hover:no-underline">
                    Tables
                </AccordionTrigger>
                <AccordionContent className="p-2">
                    {renderElementList(tableElements)}
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="other">
                <AccordionTrigger className="px-2 text-base font-medium hover:no-underline">
                    Other Elements
                </AccordionTrigger>
                <AccordionContent className="p-2">
                    {renderElementList(otherElements)}
                </AccordionContent>
                </AccordionItem>
            </Accordion>
        </ScrollArea>
    </div>
  );
}
