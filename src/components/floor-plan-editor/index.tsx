
"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Sidebar from "./sidebar";
import Canvas from "./canvas";
import Inspector from "./inspector";
import { useState, useEffect, useCallback } from "react";
import type { ElementType, FloorElement, TableElement } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Building, Crown, Home, Sun, Copy, Undo, Redo, Rows3, ZoomIn, ZoomOut, RefreshCcw } from "lucide-react";
import Header from "./header";
import AddRoomDialog from "./add-room-dialog";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

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

const initialHistory = initialRooms.reduce((acc, room) => ({
  ...acc,
  [room.id]: [[]]
}), {} as Record<string, FloorElement[][]>);

const initialHistoryIndex = initialRooms.reduce((acc, room) => ({
  ...acc,
  [room.id]: 0
}), {} as Record<string, number>);

export default function FloorPlanEditor({
  open,
  onOpenChange,
}: FloorPlanEditorProps) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [activeRoomId, setActiveRoomId] = useState<string>(initialRooms[0].id);

  const [history, setHistory] = useState<Record<string, FloorElement[][]>>(initialHistory);
  const [historyIndex, setHistoryIndex] = useState<Record<string, number>>(initialHistoryIndex);

  const elements = history[activeRoomId]?.[historyIndex[activeRoomId]] || [];
  const canUndo = historyIndex[activeRoomId] > 0;
  const canRedo = historyIndex[activeRoomId] < (history[activeRoomId]?.length || 0) - 1;


  const setElements = (updater: (prevElements: FloorElement[]) => FloorElement[], merge = false) => {
    const currentElements = history[activeRoomId]?.[historyIndex[activeRoomId]] || [];
    const newElements = updater(currentElements);
    
    setHistory(prev => {
      const currentRoomHistory = prev[activeRoomId] || [[]];
      const newRoomHistory = currentRoomHistory.slice(0, historyIndex[activeRoomId] + 1);
      newRoomHistory.push(newElements);
      
      setHistoryIndex(prevIndex => ({ ...prevIndex, [activeRoomId]: newRoomHistory.length - 1 }));

      return { ...prev, [activeRoomId]: newRoomHistory };
    });
  };

  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const { toast } = useToast();
  const [isAddRoomDialogOpen, setIsAddRoomDialogOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDuplicateNameWarningOpen, setIsDuplicateNameWarningOpen] = useState(false);
  const [duplicateTableNames, setDuplicateTableNames] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);

  const handleUndo = useCallback(() => {
    if (canUndo) {
      setHistoryIndex(prev => ({
        ...prev,
        [activeRoomId]: prev[activeRoomId] - 1
      }));
    }
  }, [activeRoomId, canUndo]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      setHistoryIndex(prev => ({
        ...prev,
        [activeRoomId]: prev[activeRoomId] + 1
      }));
    }
  }, [activeRoomId, canRedo]);

  const handleZoom = (direction: 'in' | 'out') => {
    const zoomFactor = direction === 'in' ? 1.1 : 0.9;
    setZoom(z => Math.max(0.2, Math.min(2, z * zoomFactor)));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        setSelectedElementIds(elements.map(el => el.id));
        return;
      }
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const undo = (isMac ? event.metaKey : event.ctrlKey) && event.key === 'z' && !event.shiftKey;
      const redo = (isMac ? event.metaKey && event.shiftKey : event.ctrlKey) && (event.key === 'z' || event.key === 'y');

      if (undo) {
        event.preventDefault();
        handleUndo();
      } else if (redo) {
        event.preventDefault();
        handleRedo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUndo, handleRedo, elements]);


  const handleAddRoom = (roomName: string) => {
    const newRoom: Room = {
      id: roomName.toLowerCase().replace(/\s/g, "-"),
      label: roomName,
      icon: Building, // Default icon for new rooms
    };
    setRooms((prev) => [...prev, newRoom]);
    setHistory(prev => ({ ...prev, [newRoom.id]: [[]] }));
    setHistoryIndex(prev => ({ ...prev, [newRoom.id]: 0 }));
    setActiveRoomId(newRoom.id);
    toast({
      title: "Room Added",
      description: `New room "${roomName}" has been created.`,
    });
    setIsAddRoomDialogOpen(false);
  };

  const attemptDeleteRoom = (roomId: string) => {
    if (rooms.length <= 1) {
      toast({
        variant: "destructive",
        title: "Cannot delete room",
        description: "You must have at least one room.",
      });
      return;
    }
    
    const roomElements = history[roomId]?.[historyIndex[roomId]] || [];
    if (roomElements.length > 0) {
        setRoomToDelete(roomId);
    } else {
        handleDeleteRoom(roomId);
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    const roomToDeleteDetails = rooms.find(r => r.id === roomId);
    setRooms(prev => prev.filter(room => room.id !== roomId));
    setHistory(prev => {
        const newHistory = {...prev};
        delete newHistory[roomId];
        return newHistory;
    });
    setHistoryIndex(prev => {
        const newHistoryIndex = {...prev};
        delete newHistoryIndex[roomId];
        return newHistoryIndex;
    });


    if (activeRoomId === roomId) {
        setActiveRoomId(rooms.find(r => r.id !== roomId)!.id);
    }
    
    toast({
        title: "Room Deleted",
        description: `Room "${roomToDeleteDetails?.label}" has been deleted.`,
    });
    setRoomToDelete(null);
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
      ...(type === "l-shape" && { width: 120, height: 120, borderRadius: 0 }),
      ...(type === "curved-l-shape" && { width: 120, height: 120, borderRadius: 60 }),
      ...(type === "text" && { text: "Label", width: 100, height: 20, fontSize: 16 }),
      ...(type === "rectangle" && { width: 100, height: 60, borderRadius: 0 }),
      ...(type === "circle" && { radius: 30, width: 60, height: 60, borderRadius: 30 }),
    } as FloorElement;

    setElements(prev => ([...(prev || []), newElement]));
    setSelectedElementIds([newElement.id]);
    toast({
      title: `Added ${type.replace("-", " ")}`,
      description: "You can drag it on the canvas or edit its properties.",
    });
  };

  const handleUpdateElement = (id: string, updates: Partial<FloorElement>) => {
    setElements(prev => (prev || []).map((el) => {
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
    }));
  };
  
  const handleBulkUpdateElements = (updates: { id: string; updates: Partial<FloorElement> }[]) => {
    const updateMap = new Map(updates.map(u => [u.id, u.updates]));
    setElements(prev => (prev || []).map(el => {
      if (updateMap.has(el.id)) {
        return { ...el, ...updateMap.get(el.id) };
      }
      return el;
    }));
  };

  const handleDeleteElement = (id: string) => {
    setElements(prev => (prev || []).filter((el) => el.id !== id));
    setSelectedElementIds(prev => prev.filter(p => p !== id));
  };

  const handleDuplicateElement = (id: string) => {
    const originalElement = (elements || []).find((el) => el.id === id);
    if (!originalElement) return;
  
    const newElement: FloorElement = {
      ...originalElement,
      id: crypto.randomUUID(),
      x: originalElement.x + 20,
      y: originalElement.y + 20,
    };
  
    if (newElement.type.includes("table")) {
      const tableEl = newElement as TableElement;
      const allTableNames = Object.values(history)
        .flatMap(roomHistory => roomHistory.flat())
        .filter(el => el.type.includes('table'))
        .map(el => (el as TableElement).tableName);
  
      const nameMatch = (tableEl.tableName || "T").match(/^([^\d]*)(\d*)$/);
      const baseName = nameMatch ? nameMatch[1] : (tableEl.tableName || "T");
      
      let maxNum = 0;
      allTableNames.forEach(name => {
        if (name && name.startsWith(baseName)) {
          const numPart = name.substring(baseName.length);
          const num = parseInt(numPart, 10);
          if (!isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      });
  
      tableEl.tableName = `${baseName}${maxNum + 1}`;
    }
  
    setElements((prev) => [...(prev || []), newElement]);
    setSelectedElementIds([newElement.id]);
    toast({
      title: "Element Duplicated",
      description: `New element created.`,
    });
  };

  const handleDuplicateSelection = (ids: string[]) => {
    const elementsToDuplicate = elements.filter(el => ids.includes(el.id));
    if (elementsToDuplicate.length === 0) return;

    const newElements: FloorElement[] = [];
    const newSelectedIds: string[] = [];

    const allTableNames = Object.values(history)
      .flatMap(roomHistory => roomHistory.flat())
      .filter(el => el.type.includes('table'))
      .map(el => (el as TableElement).tableName);
      
    let maxTableNumMap = new Map<string, number>();

    elementsToDuplicate.forEach(originalElement => {
      const newElement: FloorElement = {
        ...originalElement,
        id: crypto.randomUUID(),
        x: originalElement.x + 20,
        y: originalElement.y + 20,
      };

      if (newElement.type.includes("table")) {
        const tableEl = newElement as TableElement;
        const nameMatch = (tableEl.tableName || "T").match(/^([^\d]*)(\d*)$/);
        const baseName = nameMatch ? nameMatch[1] : (tableEl.tableName || "T");

        if (!maxTableNumMap.has(baseName)) {
           let maxNum = 0;
            allTableNames.forEach(name => {
              if (name && name.startsWith(baseName)) {
                const numPart = name.substring(baseName.length);
                const num = parseInt(numPart, 10);
                if (!isNaN(num) && num > maxNum) {
                  maxNum = num;
                }
              }
            });
            maxTableNumMap.set(baseName, maxNum);
        }
        
        let currentMax = maxTableNumMap.get(baseName) || 0;
        currentMax++;
        tableEl.tableName = `${baseName}${currentMax}`;
        maxTableNumMap.set(baseName, currentMax);
      }
      
      newElements.push(newElement);
      newSelectedIds.push(newElement.id);
    });

    setElements(prev => [...(prev || []), ...newElements]);
    setSelectedElementIds(newSelectedIds);
    toast({
      title: `${newElements.length} ${newElements.length > 1 ? 'Elements' : 'Element'} Duplicated`,
      description: `New elements created with an offset.`,
    });
  };

  const performSave = () => {
    console.log("Saving data...", { rooms, elements: history });
    toast({
      title: "Floor Plan Saved",
      description: "Your changes have been successfully saved.",
    });
  };

  const handleSave = () => {
    const tableNames = new Map<string, number>();
    Object.values(history).forEach(roomHistory => {
        const currentElements = roomHistory[roomHistory.length - 1];
        if (currentElements) {
            currentElements.forEach(element => {
                if (element.type.includes('table')) {
                    const table = element as TableElement;
                    if (table.tableName) {
                        tableNames.set(table.tableName, (tableNames.get(table.tableName) || 0) + 1);
                    }
                }
            });
        }
    });

    const duplicates = Array.from(tableNames.entries())
      .filter(([, count]) => count > 1)
      .map(([name]) => name);

    if (duplicates.length > 0) {
      setDuplicateTableNames(duplicates);
      setIsDuplicateNameWarningOpen(true);
    } else {
      performSave();
    }
  };

  const handleSelectElement = (id: string | null, multiSelect = false) => {
    if (id === null) {
      setSelectedElementIds([]);
      return;
    }

    if (multiSelect || isMultiSelectMode) {
      setSelectedElementIds(prev => {
        if (prev.includes(id)) {
          return prev.filter(i => i !== id);
        } else {
          return [...prev, id];
        }
      });
    } else {
      setSelectedElementIds([id]);
    }
  };

  const activeElements = elements;
  const selectedElements = activeElements.filter((el) => selectedElementIds.includes(el.id)) ?? [];


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
            onDeleteRoom={attemptDeleteRoom}
            isFullScreen={isFullScreen}
            onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
        />
        <div className="grid grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr_320px] overflow-hidden shadow-2xl flex-grow min-h-0">
          <Sidebar
            onElementAdd={(type) => handleAddElement(type)}
          />
          <div className="bg-card relative min-h-0">
            <Canvas
              elements={activeElements}
              selectedElementIds={selectedElementIds}
              onSelectElement={handleSelectElement}
              onUpdateElement={handleUpdateElement}
              onBulkUpdateElements={handleBulkUpdateElements}
              onAddElement={handleAddElement}
              zoom={zoom}
              pan={pan}
              setZoom={setZoom}
              setPan={setPan}
            />
             <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handleUndo} disabled={!canUndo}>
                    <Undo className="w-5 h-5" />
                    <span className="sr-only">Undo</span>
                </Button>
                <Button variant="outline" size="icon" onClick={handleRedo} disabled={!canRedo}>
                    <Redo className="w-5 h-5" />
                    <span className="sr-only">Redo</span>
                </Button>
                <Button 
                  variant={isMultiSelectMode ? "secondary" : "outline"} 
                  size="icon" 
                  onClick={() => setIsMultiSelectMode(!isMultiSelectMode)}
                >
                    <Rows3 className="w-5 h-5" />
                    <span className="sr-only">Multi Select</span>
                </Button>
            </div>
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleZoom('out')}>
                    <ZoomOut className="w-5 h-5" />
                    <span className="sr-only">Zoom Out</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleZoom('in')}>
                    <ZoomIn className="w-5 h-5" />
                    <span className="sr-only">Zoom In</span>
                </Button>
                <Button variant="outline" size="icon" onClick={handleResetView}>
                    <RefreshCcw className="w-5 h-5" />
                    <span className="sr-only">Reset Zoom</span>
                </Button>
            </div>
          </div>
          <div className="hidden lg:block bg-card border-l">
            <Inspector
              selectedElements={selectedElements}
              onUpdateElement={handleUpdateElement}
              onDeleteElement={handleDeleteElement}
              onDuplicateElement={handleDuplicateElement}
              onDuplicateSelection={handleDuplicateSelection}
            />
          </div>
        </div>
        
        <AddRoomDialog open={isAddRoomDialogOpen} onOpenChange={setIsAddRoomDialogOpen} onRoomAdd={handleAddRoom} />
        
        <AlertDialog open={isDuplicateNameWarningOpen} onOpenChange={setIsDuplicateNameWarningOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Duplicate Table Names</AlertDialogTitle>
              <AlertDialogDescription>
                There are multiple tables with the same name: {duplicateTableNames.join(", ")}.
                Please change the name of the duplicate tables before saving.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setIsDuplicateNameWarningOpen(false)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!roomToDelete} onOpenChange={(open) => !open && setRoomToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this room?</AlertDialogTitle>
                <AlertDialogDescription>
                  The room "{rooms.find(r => r.id === roomToDelete)?.label}" contains floor plan elements. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setRoomToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => roomToDelete && handleDeleteRoom(roomToDelete)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

      </DialogContent>
    </Dialog>
  );
}
