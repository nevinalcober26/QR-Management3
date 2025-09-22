import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Room } from "./index";
import { Button } from "../ui/button";
import { Plus, Save } from "lucide-react";

interface HeaderProps {
    rooms: Room[];
    activeRoomId: string;
    onActiveRoomChange: (id: string) => void;
    onAddRoom: () => void;
    onSave: () => void;
}

export default function Header({ rooms, activeRoomId, onActiveRoomChange, onAddRoom, onSave }: HeaderProps) {
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
                        <TabsTrigger key={room.id} value={room.id} className="flex-1">
                            {room.label.split(" ")[0]}
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
