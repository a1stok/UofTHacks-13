import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const problems = [
  { text: "Users don't tell you what's broken", dim: "they just leave" },
  { text: "Analytics show what happened", dim: "not why or what to do" },
  {
    text: "Real UX research is slow & expensive",
    dim: "$10K+, weeks per study",
  },
];

export default function Slide3() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="max-w-6xl flex flex-col gap-6">
        <div className="text-4xl flex items-center gap-2 tracking-tight">
          <ArrowRight className="size-8 text-muted-foreground" /> Users don't
          tell you what's broken, they just leave.
        </div>
        <div className="text-4xl flex items-center gap-2 tracking-tight">
          <ArrowRight className="size-8 text-muted-foreground" /> Analytics show
          WHAT happened not WHY or WHAT to do.
        </div>
        <div className="text-4xl flex items-center gap-2 tracking-tight">
          <ArrowRight className="size-8 text-muted-foreground" /> Real UX
          research is slow & expensive. $10K/study and 3-4 weeks.
        </div>
        <div className="text-4xl text-muted-foreground italic mt-16">
          What if we could get answers, in seconds not weeks?
        </div>
      </div>
    </div>
  );
}
