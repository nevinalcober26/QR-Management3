"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import FloorPlanEditor from "@/components/floor-plan-editor";
import Image from "next/image";

export default function Home() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <main className="dark flex min-h-screen flex-col items-center justify-center p-8 text-center bg-background">
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
      <div className="mt-16 w-full max-w-4xl">
        <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border-4 border-primary/20 shadow-2xl">
           <Image
              src="https://picsum.photos/seed/floorplan/1280/720"
              alt="Floor plan editor hero image"
              width={1280}
              height={720}
              className="object-cover"
              data-ai-hint="floor plan"
            />
        </div>
      </div>
      <FloorPlanEditor open={isEditorOpen} onOpenChange={setIsEditorOpen} />
    </main>
  );
}
