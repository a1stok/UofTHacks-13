import { ArrowRight, ChartArea, LayoutTemplate, SmileIcon } from "lucide-react";
import StreamingEvents from "../streaming-events";
import HappyUsers from "./happy-users";
import VisualDiffAnimated from "./visual-diff-animated";

export default function Slide1() {
  return (
    <div className="flex flex-col justify-start w-full h-full items-center">
      <div className="text-4xl text-center mb-4 tracking-tight">
        The AI Agent that watches, learns, and ships.
      </div>
      <div className="text-muted-foreground text-4xl flex items-center gap-2 tracking-tight">
        Turn <ChartArea className="size-8" /> analytics{" "}
        <ArrowRight className="size-8" /> better interfaces{" "}
        <LayoutTemplate className="size-8" /> <ArrowRight className="size-8" />{" "}
        happier users <SmileIcon className="size-8" />
      </div>
      <div className="h-24"></div>
      <div className="grid max-w-7xl w-full h-128 max-h-128 grid-cols-3 gap-4">
        <div className="max-h-128">
          <StreamingEvents />
        </div>
        <div className="max-h-128">
          <VisualDiffAnimated />
        </div>
        <div className="max-h-128">
          <HappyUsers />
        </div>
      </div>
    </div>
  );
}
