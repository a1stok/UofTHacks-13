import { ArrowRight, ChartArea, LayoutTemplate, SmileIcon } from "lucide-react";
export function meta({}) {
  return [
    { title: "Frictionless" },
    { name: "description", content: "Welcome to My Page" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col justify-start">
      <div className="text-4xl text-center mb-4 tracking-tight">
        Living Interfaces. Data driven, AI powered.
      </div>
      <div className="text-muted-foreground text-4xl flex items-center gap-2 tracking-tight">
        Turn <ChartArea className="size-8" /> data <ArrowRight className="size-8" /> better interfaces <LayoutTemplate className="size-8" /> <ArrowRight className="size-8" /> happy users <SmileIcon className="size-8"/>
      </div>
    </div>
  );
}
