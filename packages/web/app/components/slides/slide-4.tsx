import InteractiveDemo from "./interactive-demo";

export default function Slide4() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex items-center gap-2 text-4xl tracking-tight">
        <span className="text-mypage">Frictionless.</span> Realtime feedback.
        Self improving apps.
      </div>
      <div className="h-12"></div>
      <div className="px-10 w-full h-[820px]">
        <InteractiveDemo />
      </div>
    </div>
  );
}
