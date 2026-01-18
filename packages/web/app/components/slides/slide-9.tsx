import AgentCLIDemo from "./agent-cli-demo";

export default function Slide9() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex items-center gap-2 text-4xl tracking-tight">
        <span className="text-mypage">Frictionless</span> works with your stack.
      </div>
      <div className="text-muted-foreground text-xl mt-2">
        Connect MCPs, analyze data, suggest refactors, create PRs.
      </div>
      <div className="h-10"></div>
      <div className="px-10 w-full h-[620px]">
        <AgentCLIDemo />
      </div>
    </div>
  );
}
