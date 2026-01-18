export default function RefactoredInterface() {
  return (
    <div className="w-full h-full rounded-lg border border-border bg-card overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/50">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-destructive/60" />
          <div className="size-3 rounded-full bg-warning/60" />
          <div className="size-3 rounded-full bg-success/60" />
        </div>
        <span className="text-xs text-muted-foreground font-mono ml-2">
          components/pricing-card.tsx
        </span>
      </div>

      {/* Code content */}
      <div className="flex-1 overflow-auto font-mono text-xs leading-relaxed">
        {/* Removed lines */}
        <div className="shaded">
          <CodeLine num={12} type="removed">
            {'<div className="flex flex-col gap-4">'}
          </CodeLine>
          <CodeLine num={13} type="removed">
            {'  <span style={{color: "red"}}>$99</span>'}
          </CodeLine>
          <CodeLine num={14} type="removed">
            {'  <button onClick={buy}>Buy Now</button>'}
          </CodeLine>
          <CodeLine num={15} type="removed">
            {"</div>"}
          </CodeLine>
        </div>

        {/* Added lines */}
        <div className="bg-success/10">
          <CodeLine num={12} type="added">
            {"<Card variant={tierVariant}>"}
          </CodeLine>
          <CodeLine num={13} type="added">
            {"  {/* AI: highlight price for high-intent users */}"}
          </CodeLine>
          <CodeLine num={14} type="added">
            {"  <Price value={99} highlight={user.intent} />"}
          </CodeLine>
          <CodeLine num={15} type="added">
            {"  <CTAButton action={buy} urgency={metrics.ctr} />"}
          </CodeLine>
          <CodeLine num={16} type="added">
            {"</Card>"}
          </CodeLine>
        </div>

        {/* Context lines */}
        <div className="opacity-60">
          <CodeLine num={17} type="context">{"// Metrics: +23% conversion"}</CodeLine>
          <CodeLine num={18} type="context">{"// A/B: variant outperforms ctrl"}</CodeLine>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-border bg-muted/30 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          4 deletions, 5 additions
        </span>
        <span className="text-xs text-success font-medium">
          Auto-optimized
        </span>
      </div>
    </div>
  );
}

function CodeLine({
  num,
  type,
  children,
}: {
  num: number;
  type: "added" | "removed" | "context";
  children: React.ReactNode;
}) {
  const prefix = type === "added" ? "+" : type === "removed" ? "-" : " ";
  const textColor =
    type === "added"
      ? "text-success"
      : type === "removed"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <div className="flex hover:bg-muted/30 transition-colors">
      <span className="w-8 text-right pr-2 text-muted-foreground/50 select-none shrink-0">
        {num}
      </span>
      <span className={`w-4 shrink-0 ${textColor}`}>{prefix}</span>
      <code className={`${textColor} whitespace-pre`}>{children}</code>
    </div>
  );
}
