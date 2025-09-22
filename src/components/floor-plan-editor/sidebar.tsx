"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ElementType } from "@/lib/types";
import {
  Circle,
  DoorOpen,
  Minus,
  RectangleHorizontal,
  Sprout,
  Square,
  Home,
  Building,
  Sun,
  Crown
} from "lucide-react";

interface SidebarProps {
  onElementAdd: (type: ElementType) => void;
}

export default function Sidebar({ onElementAdd }: SidebarProps) {
  const tableElements = [
    { type: "round-table", icon: Circle, label: "Round Table" },
    { type: "square-table", icon: Square, label: "Square Table" },
    { type: "rectangle-table", icon: RectangleHorizontal, label: "Rectangle Table" },
  ] as const;

  const otherElements = [
    { type: "wall", icon: Minus, label: "Wall" },
    { type: "door", icon: DoorOpen, label: "Door" },
    { type: "plant", icon: Sprout, label: "Plant" },
  ] as const;

  const rooms = [
      { id: "main-dining", label: "Main Dining Room", icon: Home },
      { id: "private-1", label: "Private Room 1", icon: Building },
      { id: "patio", label: "Outdoor Patio", icon: Sun },
      { id: "vip", label: "VIP Lounge", icon: Crown },
  ]

  const renderElementButtons = (elements: typeof tableElements | typeof otherElements) => (
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
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold tracking-tight">Floor Plan</h2>
      </div>

      <Tabs defaultValue="main-dining" className="flex-grow flex flex-col">
        <TabsList className="m-2">
          {rooms.map(room => (
            <TabsTrigger key={room.id} value={room.id} className="flex-1">
              {room.label.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>
        {rooms.map(room => (
          <TabsContent key={room.id} value={room.id} className="flex-grow overflow-auto p-2 mt-0">
            <h3 className="font-semibold text-lg p-2">{room.label}</h3>
            <Accordion type="multiple" defaultValue={["tables", "other"]} className="w-full">
              <AccordionItem value="tables">
                <AccordionTrigger className="px-2 text-base font-medium hover:no-underline">Tables</AccordionTrigger>
                <AccordionContent className="p-2">
                  {renderElementButtons(tableElements)}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="other">
                <AccordionTrigger className="px-2 text-base font-medium hover:no-underline">Other Elements</AccordionTrigger>
                <AccordionContent className="p-2">
                  {renderElementButtons(otherElements)}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
