export default function VisualDiff() {
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
          Visual Diff
        </span>
      </div>

      {/* Visual diff content */}
      <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
        {/* Removed elements */}
        <div className="shaded rounded-md p-3 border border-destructive/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-destructive">- removed</span>
          </div>
          <div className="space-y-2 opacity-60">
            {/* Old button */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-24 rounded bg-destructive/20 border border-destructive/30 flex items-center justify-center">
                <span className="text-xs text-destructive line-through">Buy Now</span>
              </div>
              <span className="text-xs text-muted-foreground">static CTA</span>
            </div>
            {/* Old price */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 rounded bg-destructive/20 border border-destructive/30 flex items-center justify-center">
                <span className="text-xs text-destructive line-through">$99</span>
              </div>
              <span className="text-xs text-muted-foreground">hardcoded</span>
            </div>
            {/* Old layout */}
            <div className="flex items-center gap-2">
              <div className="h-12 w-32 rounded bg-destructive/20 border border-destructive/30 border-dashed" />
              <span className="text-xs text-muted-foreground">fixed layout</span>
            </div>
          </div>
        </div>

        {/* Added elements */}
        <div className="bg-success/10 rounded-md p-3 border border-success/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-success">+ added</span>
          </div>
          <div className="space-y-2">
            {/* New button */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-28 rounded bg-success/20 border border-success/50 flex items-center justify-center shadow-sm">
                <span className="text-xs text-success font-medium">Get Started</span>
              </div>
              <span className="text-xs text-muted-foreground">dynamic CTA</span>
            </div>
            {/* New price with highlight */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 rounded bg-success/20 border border-success/50 flex items-center justify-center">
                <span className="text-sm text-success font-bold">$99</span>
              </div>
              <span className="text-xs text-muted-foreground">highlighted</span>
            </div>
            {/* New adaptive layout */}
            <div className="flex items-center gap-2">
              <div className="h-14 w-36 rounded bg-success/20 border border-success/50 flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="h-8 w-8 rounded-sm bg-success/30" />
                  <div className="h-8 w-8 rounded-sm bg-success/30" />
                  <div className="h-8 w-8 rounded-sm bg-success/30" />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">adaptive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-border bg-muted/30 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          3 elements changed
        </span>
        <span className="text-xs text-success font-medium">
          +23% CTR
        </span>
      </div>
    </div>
  );
}
