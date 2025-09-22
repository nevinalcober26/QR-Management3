"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FloorElement, TableElement, DoorElement, WindowElement } from "@/lib/types";
import { Copy, Trash2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface InspectorProps {
  selectedElement: FloorElement | null;
  onUpdateElement: (id: string, updates: Partial<FloorElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
}

export default function Inspector({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
}: InspectorProps) {
  if (!selectedElement) {
    return (
      <div className="p-4 border-l h-full flex items-center justify-center text-center">
        <p className="text-sm text-muted-foreground">
          Select an element to see its properties.
        </p>
      </div>
    );
  }

  const isTable = selectedElement.type.includes("table");
  const tableElement = isTable ? (selectedElement as TableElement) : null;
  const isDoor = selectedElement.type === "door";
  const doorElement = isDoor ? (selectedElement as DoorElement) : null;
  const isCornerRadiusApplicable =
    selectedElement.type === "square-table" ||
    selectedElement.type === "rectangle-table" ||
    selectedElement.type === "wall";


  const handleRotationChange = (value: number) => {
    let newRotation = value;
    if (newRotation < 0) newRotation = 0;
    if (newRotation > 360) newRotation = 360;
    onUpdateElement(selectedElement.id, { rotation: newRotation });
  }

  return (
    <div className="p-4 border-l h-full flex flex-col">
      <ScrollArea className="flex-grow pr-2">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg capitalize mb-4">
              {selectedElement.type.replace("-", " ")}
            </h3>
            <div className="grid gap-4">
              {isTable && tableElement && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="table-name">Table Name/Number</Label>
                    <Input
                      id="table-name"
                      type="text"
                      value={tableElement.tableName || ''}
                      onChange={(e) => onUpdateElement(selectedElement.id, { tableName: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="seats">Capacity</Label>
                    <Input
                      id="seats"
                      type="number"
                      value={tableElement.seats || 0}
                      onChange={(e) => onUpdateElement(selectedElement.id, { seats: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </>
              )}

              {isDoor && doorElement && (
                 <div className="grid gap-2">
                    <Label htmlFor="door-label">Label</Label>
                    <Input
                      id="door-label"
                      type="text"
                      value={doorElement.label || ''}
                      onChange={(e) => onUpdateElement(selectedElement.id, { label: e.target.value })}
                    />
                  </div>
              )}

              {selectedElement.type === 'round-table' && tableElement?.radius !== undefined && (
                <div className="grid gap-2">
                  <Label htmlFor="radius">Radius (in)</Label>
                  <Input id="radius" type="number" value={tableElement.radius} onChange={(e) => onUpdateElement(selectedElement.id, { radius: parseInt(e.target.value) || 0 })} />
                </div>
              )}
              {(selectedElement.type !== 'round-table') && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="width">Width (in)</Label>
                    <Input id="width" type="number" value={selectedElement.width} onChange={(e) => onUpdateElement(selectedElement.id, { width: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="height">Height (in)</Label>
                    <Input id="height" type="number" value={selectedElement.height} onChange={(e) => onUpdateElement(selectedElement.id, { height: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
              )}

              {isCornerRadiusApplicable && (
                <div className="grid gap-2">
                  <Label htmlFor="border-radius">Corner Radius (px)</Label>
                  <Input
                    id="border-radius"
                    type="number"
                    value={selectedElement.borderRadius ?? 0}
                    onChange={(e) => onUpdateElement(selectedElement.id, { borderRadius: parseInt(e.target.value) || 0 })}
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="rotation">Rotation</Label>
                <div className="flex items-center gap-2">
                  <Slider id="rotation" min={0} max={360} step={1} value={[selectedElement.rotation]} onValueChange={([val]) => handleRotationChange(val)} />
                  <div className="relative">
                    <Input 
                      type="number" 
                      className="w-20 text-right pr-6" 
                      value={selectedElement.rotation} 
                      onChange={(e) => handleRotationChange(parseInt(e.target.value, 10) || 0)}
                      min={0}
                      max={360}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="mt-6 pt-6 border-t space-y-2">
        <Button variant="outline" className="w-full" onClick={() => onDuplicateElement(selectedElement.id)}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate Element
        </Button>
        <Button variant="destructive" className="w-full" onClick={() => onDeleteElement(selectedElement.id)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Element
        </Button>
      </div>
    </div>
  );
}
