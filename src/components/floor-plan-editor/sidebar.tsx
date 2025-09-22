"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ElementType } from "@/lib/types";
import {
  Circle,
  DoorOpen,
  Minus,
  RectangleHorizontal,
  Sprout,
  Square,
  Plus,
} from "lucide-react";
import { useState } from "react";
import type { Room } from "./index";

interface SidebarProps {
  rooms: Room[];
  activeRoomId: string;
  onActiveRoomChange: (id: string) => void;
  onElementAdd: (type: ElementType) => void;
  onRoomAdd: (name: string) => void;
}

function AddRoomDialog({ onRoomAdd }: { onRoomAdd: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");

  const handleAdd = () => {
    if (roomName.trim()) {
      onRoomAdd(roomName.trim());
      setRoomName("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="ml-2"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Add Room</span>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new room</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="room-name" className="text-right">
              Name
            </Label>
            <Input
              id="room-name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Kitchen"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleAdd} disabled={!roomName.trim()}>
            Add Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function Sidebar({
  rooms,
  activeRoomId,
  onActiveRoomChange,
  onElementAdd,
  onRoomAdd,
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
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Floor Plan</h2>
        <AddRoomDialog onRoomAdd={onRoomAdd} />
      </div>

      <Tabs
        value={activeRoomId}
        onValueChange={onActiveRoomChange}
        className="flex-grow flex flex-col"
      >
        <TabsList className="m-2">
          {rooms.map((room) => (
            <TabsTrigger key={room.id} value={room.id} className="flex-1">
              {room.label.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>
        {rooms.map((room) => (
          <TabsContent
            key={room.id}
            value={room.id}
            className="flex-grow overflow-auto p-2 mt-0"
          >
            <h3 className="font-semibold text-lg p-2">{room.label}</h3>
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
