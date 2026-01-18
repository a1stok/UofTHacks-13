import TeamReviewDemo from "./team-review-demo";

export default function Slide8() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex items-center gap-2 text-4xl tracking-tight">
        <span className="text-mypage">Step 3.</span> Team review, A/B test,
        deploy.
      </div>
      <div className="h-12"></div>
      <div className="px-10 w-full h-[720px]">
        <TeamReviewDemo />
      </div>
    </div>
  );
}
