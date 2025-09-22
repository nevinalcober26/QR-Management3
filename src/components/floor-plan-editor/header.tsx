import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Room } from "./index";
import { Button } from "../ui/button";
import { Plus, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
    rooms: Room[];
    activeRoomId: string;
    onActiveRoomChange: (id: string) => void;
    onAddRoom: () => void;
    onSave: () => void;
    onDeleteRoom: (id: string) => void;
}

export default function Header({ rooms, activeRoomId, onActiveRoomChange, onAddRoom, onSave, onDeleteRoom }: HeaderProps) {
    return (
        <div className="p-4 border-b flex items-center justify-between bg-card">
            <h2 className="text-xl font-semibold tracking-tight">Floor Plan</h2>
            <Tabs
                value={activeRoomId}
                onValueChange={onActiveRoomChange}
                className="flex-grow flex justify-center"
            >
                <TabsList>
                    {rooms.map((room) => (
                        <div key={room.id} className="relative group flex items-center">
                            <TabsTrigger value={room.id} className="pr-7">
                                {room.label.split(" ")[0]}
                            </TabsTrigger>
                             <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteRoom(room.id);
                                }}
                                className={cn(
                                    "absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-muted disabled:pointer-events-none",
                                    rooms.length <= 1 && "hidden",
                                    activeRoomId === room.id ? "opacity-100" : "opacity-0"
                                )}
                                disabled={rooms.length <= 1}
                                aria-label={`Delete ${room.label}`}
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    onClick={onAddRoom}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room
                </Button>
                <Button onClick={onSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                </Button>
            </div>
      </div>
    );
}
