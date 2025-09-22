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
                        <TabsTrigger key={room.id} value={room.id} className="relative group pr-8">
                            {room.label.split(" ")[0]}
                             <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteRoom(room.id);
                                }}
                                className={cn(
                                    "absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-muted disabled:pointer-events-none",
                                    rooms.length <= 1 && "hidden"
                                )}
                                disabled={rooms.length <= 1}
                                aria-label={`Delete ${room.label}`}
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </TabsTrigger>
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
