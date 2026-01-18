import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

// Code content for the animation
const REMOVED_LINES = [
  { num: 12, code: '<div className="flex flex-col gap-4">' },
  { num: 13, code: '  <span style={{color: "red"}}>$99</span>' },
  { num: 14, code: "  <button onClick={buy}>Buy Now</button>" },
  { num: 15, code: "</div>" },
];

const ADDED_LINES = [
  { num: 12, code: "<Card variant={tierVariant}>" },
  { num: 13, code: "  {/* AI: highlight price for high-intent users */}" },
  { num: 14, code: "  <Price value={99} highlight={user.intent} />" },
  { num: 15, code: "  <CTAButton action={buy} urgency={metrics.ctr} />" },
  { num: 16, code: "</Card>" },
];

const CONTEXT_LINES = [
  { num: 17, code: "// Metrics: +23% conversion" },
  { num: 18, code: "// A/B: variant outperforms ctrl" },
];

// Animation phases
type Phase =
  | "idle"
  | "scanning"
  | "removing"
  | "generating"
  | "context"
  | "complete";

export default function RefactoredInterfaceAnimated() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [removedCount, setRemovedCount] = useState(0);
  const [addedLines, setAddedLines] = useState<
    { num: number; code: string; charIndex: number }[]
  >([]);
  const [contextVisible, setContextVisible] = useState(false);
  const [scanLineIndex, setScanLineIndex] = useState(-1);

  const resetAnimation = useCallback(() => {
    setPhase("idle");
    setRemovedCount(0);
    setAddedLines([]);
    setContextVisible(false);
    setScanLineIndex(-1);
  }, []);

  // Main animation loop
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    switch (phase) {
      case "idle":
        // Start after a brief pause
        timeout = setTimeout(() => setPhase("scanning"), 800);
        break;

      case "scanning":
        // Scan through removed lines
        if (scanLineIndex < REMOVED_LINES.length - 1) {
          timeout = setTimeout(() => {
            setScanLineIndex((i) => i + 1);
          }, 200);
        } else {
          timeout = setTimeout(() => setPhase("removing"), 400);
        }
        break;

      case "removing":
        // Remove lines one by one
        if (removedCount < REMOVED_LINES.length) {
          timeout = setTimeout(() => {
            setRemovedCount((c) => c + 1);
          }, 150);
        } else {
          timeout = setTimeout(() => setPhase("generating"), 300);
        }
        break;

      case "generating":
        // Type out new lines character by character
        const currentLineIndex = addedLines.length;

        if (currentLineIndex < ADDED_LINES.length) {
          const currentLine = addedLines[currentLineIndex - 1];
          const targetLine = ADDED_LINES[currentLineIndex];

          if (!currentLine || currentLine.charIndex >= currentLine.code.length) {
            // Start a new line
            timeout = setTimeout(() => {
              setAddedLines((lines) => [
                ...lines,
                { ...targetLine, charIndex: 0 },
              ]);
            }, 100);
          } else {
            // Continue typing current line
            const charsToAdd = Math.min(3, currentLine.code.length - currentLine.charIndex);
            timeout = setTimeout(() => {
              setAddedLines((lines) =>
                lines.map((line, i) =>
                  i === lines.length - 1
                    ? { ...line, charIndex: line.charIndex + charsToAdd }
                    : line
                )
              );
            }, 30);
          }
        } else {
          // Check if last line is fully typed
          const lastLine = addedLines[addedLines.length - 1];
          if (lastLine && lastLine.charIndex < lastLine.code.length) {
            const charsToAdd = Math.min(3, lastLine.code.length - lastLine.charIndex);
            timeout = setTimeout(() => {
              setAddedLines((lines) =>
                lines.map((line, i) =>
                  i === lines.length - 1
                    ? { ...line, charIndex: line.charIndex + charsToAdd }
                    : line
                )
              );
            }, 30);
          } else {
            timeout = setTimeout(() => setPhase("context"), 200);
          }
        }
        break;

      case "context":
        setContextVisible(true);
        timeout = setTimeout(() => setPhase("complete"), 500);
        break;

      case "complete":
        // Hold the complete state, then restart
        timeout = setTimeout(() => {
          resetAnimation();
        }, 3000);
        break;
    }

    return () => clearTimeout(timeout);
  }, [phase, scanLineIndex, removedCount, addedLines, resetAnimation]);

  const showRemovedLines = phase === "scanning" || phase === "removing";
  const showGenerating = phase === "generating" || phase === "context" || phase === "complete";

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
        {/* AI Status indicator */}
        <div className="ml-auto flex items-center gap-2">
          <AnimatePresence mode="wait">
            {phase !== "complete" && phase !== "idle" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5"
              >
                <motion.div
                  className="size-2 rounded-full bg-primary"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-xs text-primary font-medium">
                  {phase === "scanning" && "Analyzing..."}
                  {phase === "removing" && "Removing..."}
                  {phase === "generating" && "Generating..."}
                  {phase === "context" && "Finalizing..."}
                </span>
              </motion.div>
            )}
            {phase === "complete" && (
              <motion.span
                key="complete"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-success font-medium"
              >
                Optimized
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Code content */}
      <div className="flex-1 overflow-auto font-mono text-xs leading-relaxed">
        {/* Removed lines section */}
        <AnimatePresence>
          {showRemovedLines && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="shaded"
            >
              {REMOVED_LINES.map((line, index) => (
                <AnimatePresence key={line.num}>
                  {index >= removedCount && (
                    <motion.div
                      initial={{ opacity: 1, height: "auto" }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        x: -20,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <CodeLine
                        num={line.num}
                        type="removed"
                        isScanning={scanLineIndex === index}
                      >
                        {line.code}
                      </CodeLine>
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Added lines section */}
        <AnimatePresence>
          {showGenerating && addedLines.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-success/10"
            >
              {addedLines.map((line, index) => (
                <motion.div
                  key={`added-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <StreamingCodeLine
                    num={line.num}
                    code={line.code}
                    charIndex={line.charIndex}
                    isTyping={
                      index === addedLines.length - 1 &&
                      line.charIndex < line.code.length
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Context lines */}
        <AnimatePresence>
          {contextVisible && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {CONTEXT_LINES.map((line) => (
                <CodeLine key={line.num} num={line.num} type="context">
                  {line.code}
                </CodeLine>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state during idle */}
        {phase === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-full text-muted-foreground/50"
          >
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Starting analysis...
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-border bg-muted/30 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          <AnimatePresence mode="wait">
            {phase === "complete" ? (
              <motion.span
                key="complete"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                4 deletions, 5 additions
              </motion.span>
            ) : (
              <motion.span
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {removedCount > 0 && `${removedCount} removed`}
                {removedCount > 0 && addedLines.length > 0 && ", "}
                {addedLines.length > 0 && `${addedLines.length} added`}
                {removedCount === 0 && addedLines.length === 0 && "Analyzing..."}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <AnimatePresence>
          {phase === "complete" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs text-success font-medium"
            >
              Auto-optimized
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CodeLine({
  num,
  type,
  children,
  isScanning = false,
}: {
  num: number;
  type: "added" | "removed" | "context";
  children: React.ReactNode;
  isScanning?: boolean;
}) {
  const prefix = type === "added" ? "+" : type === "removed" ? "-" : " ";
  const textColor =
    type === "added"
      ? "text-success"
      : type === "removed"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <div
      className={`flex transition-colors ${isScanning ? "bg-primary/20" : "hover:bg-muted/30"}`}
    >
      <span className="w-8 text-right pr-2 text-muted-foreground/50 select-none shrink-0">
        {num}
      </span>
      <span className={`w-4 shrink-0 ${textColor}`}>{prefix}</span>
      <code className={`${textColor} whitespace-pre`}>{children}</code>
      {isScanning && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="ml-2 text-primary"
        >
          
        </motion.span>
      )}
    </div>
  );
}

function StreamingCodeLine({
  num,
  code,
  charIndex,
  isTyping,
}: {
  num: number;
  code: string;
  charIndex: number;
  isTyping: boolean;
}) {
  const displayedCode = code.slice(0, charIndex);

  return (
    <div className="flex hover:bg-muted/30 transition-colors">
      <span className="w-8 text-right pr-2 text-muted-foreground/50 select-none shrink-0">
        {num}
      </span>
      <span className="w-4 shrink-0 text-success">+</span>
      <code className="text-success whitespace-pre">
        {displayedCode}
        {isTyping && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-[2px] h-[1em] bg-success ml-[1px] align-middle"
          />
        )}
      </code>
    </div>
  );
}
