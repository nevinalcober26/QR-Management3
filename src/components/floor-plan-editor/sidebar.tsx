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
} from "lucide-react";

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
    { type: "plant", icon: Sprout, label: "Plant" },
  ] as const;

  const renderElementButtons = (
    elements: typeof tableElements | typeof otherElements
  ) => (
    <div className="grid grid-cols-2 gap-2">
      {elements.map(({ type, icon: Icon, label }) => (
        <Button
          key={type}
          variant="outline"
          className="flex flex-col h-24 items-center justify-center gap-2 p-2 text-center"
          onClick={() => onElementAdd(type)}
        >
          <Icon className="w-8 h-8 text-accent" />
          <span className="text-xs text-muted-foreground">{label}</span>
        </Button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-card border-r p-2">
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
                {renderElementButtons(tableElements)}
            </AccordionContent>
            </AccordionItem>
            <AccordionItem value="other">
            <AccordionTrigger className="px-2 text-base font-medium hover:no-underline">
                Other Elements
            </AccordionTrigger>
            <AccordionContent className="p-2">
                {renderElementButtons(otherElements)}
            </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  );
}
