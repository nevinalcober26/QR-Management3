"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { FloorElement, TableElement } from "@/lib/types";
import { Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { suggestTableConfiguration } from "@/ai/flows/suggest-table-configuration";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "../ui/scroll-area";

interface InspectorProps {
  selectedElement: FloorElement | null;
  onUpdateElement: (id: string, updates: Partial<FloorElement>) => void;
  onDeleteElement: (id: string) => void;
}

export default function Inspector({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
}: InspectorProps) {
  const [surroundingLayout, setSurroundingLayout] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  const handleSmartSuggest = async () => {
    if (!selectedElement || !selectedElement.type.includes("table")) return;

    setIsSuggesting(true);
    try {
      const result = await suggestTableConfiguration({
        tableType: (selectedElement as TableElement).type,
        surroundingLayout,
      });

      const updates: Partial<TableElement> = { seats: result.suggestedSeats };
      if (result.suggestedWidth) updates.width = result.suggestedWidth;
      if (result.suggestedHeight) updates.height = result.suggestedHeight;
      if (result.suggestedRadius) {
        updates.radius = result.suggestedRadius;
        updates.width = result.suggestedRadius * 2;
        updates.height = result.suggestedRadius * 2;
      }
      onUpdateElement(selectedElement.id, updates);
      toast({
        title: "✨ Smart Suggestion Applied",
        description: `Suggested ${result.suggestedSeats} seats and new dimensions.`,
      });
    } catch (error) {
      console.error("Smart suggestion failed:", error);
      toast({
        variant: "destructive",
        title: "Suggestion Failed",
        description: "Could not get AI suggestion. Please try again.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

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
                <div className="grid gap-2">
                  <Label htmlFor="seats">Seats</Label>
                  <Input
                    id="seats"
                    type="number"
                    value={tableElement.seats || 0}
                    onChange={(e) => onUpdateElement(selectedElement.id, { seats: parseInt(e.target.value) || 0 })}
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

          {isTable && (
            <div className="grid gap-4 pt-4 border-t">
              <h4 className="font-medium">Smart Suggestion</h4>
              <div className="grid gap-2">
                <Label htmlFor="layout-description">Describe surrounding layout</Label>
                <Textarea id="layout-description" placeholder="e.g., 'In a corner, near a window, 5 feet from the nearest table...'" value={surroundingLayout} onChange={(e) => setSurroundingLayout(e.target.value)} />
              </div>
              <Button onClick={handleSmartSuggest} disabled={isSuggesting}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isSuggesting ? "Thinking..." : "Suggest Configuration"}
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="mt-6 pt-6 border-t">
        <Button variant="destructive" className="w-full" onClick={() => onDeleteElement(selectedElement.id)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Element
        </Button>
      </div>
    </div>
  );
}
