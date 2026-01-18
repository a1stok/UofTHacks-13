import { Zap, HelpCircle, LogOut, ImageIcon } from "lucide-react";
import shrug from "../../../public/shrug.gif";

export default function Slide2() {
  return (
    <div className="flex flex-col items-center justify-start w-full h-full">
      {/* Header */}
      <div className="text-4xl text-center mb-2 tracking-tight">
        &quot;Why did users leave?&quot;
      </div>
      <div className="text-4xl"></div>
      <img src={shrug} alt="shrug" className="my-32 scale-200" />
      <div className="text-muted-foreground text-xl mb-16">
        - Every product team, every week
      </div>
    </div>
  );
}