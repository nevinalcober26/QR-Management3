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

  const handleDeleteRoom = (roomId: string) => {
    if (rooms.length <= 1) {
      toast({
        variant: "destructive",
        title: "Cannot delete room",
        description: "You must have at least one room.",
      });
      return;
    }
    const roomToDelete = rooms.find(r => r.id === roomId);
    setRooms(prev => prev.filter(room => room.id !== roomId));
    setElements(prev => {
        const newElements = {...prev};
        delete newElements[roomId];
        return newElements;
    });

    if (activeRoomId === roomId) {
        setActiveRoomId(rooms.find(r => r.id !== roomId)!.id);
    }
    
    toast({
        title: "Room Deleted",
        description: `Room "${roomToDelete?.label}" has been deleted.`,
    });
  };

  const handleAddElement = (type: ElementType, x = 150, y = 150) => {
    const newElement: FloorElement = {
      id: crypto.randomUUID(),
      type,
      x: x,
      y: y,
      rotation: 0,
      // Default properties
      ...(type === "round-table" && { seats: 4, radius: 24, width: 48, height: 48, tableName: 'T1' }),
      ...(type === "square-table" && { seats: 4, width: 48, height: 48, tableName: 'T2', borderRadius: 4 }),
      ...(type === "rectangle-table" && { seats: 6, width: 72, height: 36, tableName: 'T3', borderRadius: 4 }),
      ...(type === "wall" && { width: 120, height: 8, borderRadius: 2 }),
      ...(type === "door" && { width: 36, height: 48, label: 'Entrance' }),
      ...(type === "window" && { width: 60, height: 8 }),
      ...(type === "plant" && { radius: 12, width: 24, height: 24 }),
      ...(type === "l-shape" && { width: 120, height: 120, borderRadius: 2 }),
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

  const handleDuplicateElement = (id: string) => {
    const originalElement = (elements[activeRoomId] || []).find((el) => el.id === id);
    if (!originalElement) return;

    const newElement: FloorElement = {
      ...originalElement,
      id: crypto.randomUUID(),
      x: originalElement.x + 20,
      y: originalElement.y + 20,
    };

    setElements((prev) => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), newElement],
    }));
    setSelectedElementId(newElement.id);
    toast({
      title: "Element Duplicated",
      description: "The selected element has been duplicated.",
    });
  };

  const handleSave = () => {
    // In a real app, you'd send this data to a backend.
    console.log("Saving data...", { rooms, elements });
    toast({
      title: "Floor Plan Saved",
      description: "Your changes have been successfully saved.",
    });
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
            onSave={handleSave}
            onDeleteRoom={handleDeleteRoom}
            isFullScreen={isFullScreen}
            onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
        />
        <div className="grid grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr_320px] h-full overflow-hidden shadow-2xl flex-grow">
          <Sidebar
            onElementAdd={(type) => handleAddElement(type)}
          />
          <Canvas
            elements={activeElements}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElement={handleUpdateElement}
            onAddElement={handleAddElement}
          />
          <div className="hidden lg:block bg-card">
            <Inspector
              selectedElement={selectedElement}
              onUpdateElement={handleUpdateElement}
              onDeleteElement={handleDeleteElement}
              onDuplicateElement={handleDuplicateElement}
            />
          </div>
        </div>
        <AddRoomDialog open={isAddRoomDialogOpen} onOpenChange={setIsAddRoomDialogOpen} onRoomAdd={handleAddRoom} />
      </DialogContent>
    </Dialog>
  );
}
