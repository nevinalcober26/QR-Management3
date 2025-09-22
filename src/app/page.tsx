"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import FloorPlanEditor from "@/components/floor-plan-editor";

export default function Home() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-headline">
          FloorPlanEditor
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Design and visualize your space with a modern, intuitive, and AI-powered floor plan tool.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button onClick={() => setIsEditorOpen(true)} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Edit Floor Plan
          </Button>
        </div>
      </div>
      <FloorPlanEditor open={isEditorOpen} onOpenChange={setIsEditorOpen} />
    </main>
  );
}
