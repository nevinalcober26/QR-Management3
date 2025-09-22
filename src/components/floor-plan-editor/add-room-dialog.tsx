"use client";

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
import { useState } from "react";

interface AddRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomAdd: (name: string) => void;
}

export default function AddRoomDialog({ open, onOpenChange, onRoomAdd }: AddRoomDialogProps) {
  const [roomName, setRoomName] = useState("");

  const handleAdd = () => {
    if (roomName.trim()) {
      onRoomAdd(roomName.trim());
      setRoomName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
