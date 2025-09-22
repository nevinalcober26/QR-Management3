"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Sidebar from "./sidebar";
import Canvas from "./canvas";
import Inspector from "./inspector";
import { useState } from "react";
import type { ElementType, FloorElement, DoorElement } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Building, Crown, Home, Sun, Maximize, Minimize } from "lucide-react";
import Header from "./header";
import AddRoomDialog from "./add-room-dialog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface FloorPlanEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type Room = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const initialRooms: Room[] = [
  { id: "main-dining", label: "Main Dining Room", icon: Home },
  { id: "private-1", label: "Private Room 1", icon: Building },
  { id: "patio", label: "Outdoor Patio", icon: Sun },
  { id: "vip", label: "VIP Lounge", icon: Crown },
];

export default function FloorPlanEditor({
  open,
  onOpenChange,
}: FloorPlanEditorProps) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [activeRoomId, setActiveRoomId] = useState<string>(initialRooms[0].id);
  const [elements, setElements] = useState<Record<string, FloorElement[]>>({
    "main-dining": [],
    "private-1": [],
    "patio": [],
    "vip": [],
  });
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const { toast } = useToast();
  const [isAddRoomDialogOpen, setIsAddRoomDialogOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);


  const handleAddRoom = (roomName: string) => {
    const newRoom: Room = {
      id: roomName.toLowerCase().replace(/\s/g, "-"),
      label: roomName,
      icon: Building, // Default icon for new rooms
    };
    setRooms((prev) => [...prev, newRoom]);
    setElements((prev) => ({ ...prev, [newRoom.id]: [] }));
    setActiveRoomId(newRoom.id);
    toast({
      title: "Room Added",
      description: `New room "${roomName}" has been created.`,
    });
    setIsAddRoomDialogOpen(false);
  };

  const handleAddElement = (type: ElementType) => {
    const newElement: FloorElement = {
      id: crypto.randomUUID(),
      type,
      x: 150,
      y: 150,
      rotation: 0,
      // Default properties
      ...(type === "round-table" && { seats: 4, radius: 24, width: 48, height: 48, tableName: 'T1' }),
      ...(type === "square-table" && { seats: 4, width: 48, height: 48, tableName: 'T2' }),
      ...(type === "rectangle-table" && { seats: 6, width: 72, height: 36, tableName: 'T3' }),
      ...(type === "wall" && { width: 120, height: 8 }),
      ...(type === "door" && { width: 36, height: 8, label: 'Door' }),
      ...(type === "plant" && { radius: 12, width: 24, height: 24 }),
    } as FloorElement;

    setElements((prev) => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), newElement],
    }));
    setSelectedElementId(newElement.id);
    toast({
      title: `Added ${type.replace("-", " ")}`,
      description: "You can drag it on the canvas or edit its properties.",
    });
  };

  const handleUpdateElement = (id: string, updates: Partial<FloorElement>) => {
    setElements((prev) => ({
      ...prev,
      [activeRoomId]: (prev[activeRoomId] || []).map((el) => {
        if (el.id === id) {
          const newEl = { ...el, ...updates };
          if (newEl.type === 'round-table' || newEl.type === 'plant') {
            if (updates.radius) {
                newEl.width = updates.radius * 2;
                newEl.height = updates.radius * 2;
            }
          }
          return newEl;
        }
        return el;
      }),
    }));
  };

  const handleDeleteElement = (id: string) => {
    setElements((prev) => ({
      ...prev,
      [activeRoomId]: (prev[activeRoomId] || []).filter((el) => el.id !== id),
    }));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const activeElements = elements[activeRoomId] || [];
  const selectedElement =
    activeElements.find((el) => el.id === selectedElementId) ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
          "p-0 gap-0 border-0 flex flex-col transition-all duration-300",
          isFullScreen
            ? "w-screen h-screen max-w-full max-h-full rounded-none"
            : "max-w-screen-2xl w-[95%] h-[90vh]"
        )}>
        <DialogTitle>
          <VisuallyHidden>Floor Plan Editor</VisuallyHidden>
        </DialogTitle>
        <Header 
            rooms={rooms}
            activeRoomId={activeRoomId}
            onActiveRoomChange={setActiveRoomId}
            onAddRoom={() => setIsAddRoomDialogOpen(true)}
        />
        <div className="grid grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr_320px] h-full overflow-hidden shadow-2xl flex-grow">
          <Sidebar
            onElementAdd={handleAddElement}
          />
          <Canvas
            elements={activeElements}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElement={handleUpdateElement}
          />
          <div className="hidden lg:block bg-card">
            <Inspector
              selectedElement={selectedElement}
              onUpdateElement={handleUpdateElement}
              onDeleteElement={handleDeleteElement}
            />
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-12 z-50 text-muted-foreground"
          onClick={() => setIsFullScreen(!isFullScreen)}
        >
          {isFullScreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          <span className="sr-only">{isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}</span>
        </Button>
        <AddRoomDialog open={isAddRoomDialogOpen} onOpenChange={setIsAddRoomDialogOpen} onRoomAdd={handleAddRoom} />
      </DialogContent>
    </Dialog>
  );
}
