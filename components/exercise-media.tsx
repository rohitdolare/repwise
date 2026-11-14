"use client";

import { Images, PlayCircle } from "lucide-react";
import type { ExerciseVideo } from "@/content/videos";
import { exerciseImages } from "@/content/visuals";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExerciseDemo } from "./exercise-demo";
import { VideoEmbed } from "./video-embed";

/** Video | Photos switcher for the exercise page header. */
export function ExerciseMedia({
  slug,
  name,
  note,
  video,
}: {
  slug: string;
  name: string;
  note?: string;
  video?: ExerciseVideo;
}) {
  if (!video) return <ExerciseDemo slug={slug} name={name} note={note} priority />;
  return (
    <Tabs defaultValue="video" className="gap-3">
      <TabsList className="h-10! w-full sm:w-fit">
        <TabsTrigger value="video" className="px-4">
          <PlayCircle /> Video guide
        </TabsTrigger>
        <TabsTrigger value="photos" className="px-4">
          <Images /> Photos
        </TabsTrigger>
      </TabsList>
      <TabsContent value="video">
        <VideoEmbed video={video} poster={exerciseImages(slug)[1]} name={name} />
      </TabsContent>
      <TabsContent value="photos">
        <ExerciseDemo slug={slug} name={name} note={note} priority />
      </TabsContent>
    </Tabs>
  );
}
