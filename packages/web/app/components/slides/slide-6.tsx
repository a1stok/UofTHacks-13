import DataAnalysisDemo from "./data-analysis-demo";

export default function Slide6() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex items-center gap-2 text-4xl tracking-tight">
        <span className="text-mypage">Step 1.</span> Analyze behavior, generate
        insights.
      </div>
      <div className="h-12"></div>
      <div className="px-10 w-full h-[720px]">
        <DataAnalysisDemo />
      </div>
    </div>
  );
}
