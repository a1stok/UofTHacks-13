"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal,
  Plug,
  Database,
  Code2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Play,
  FileCode,
  MessageSquare,
  GitBranch,
} from "lucide-react";

// Types
interface TerminalLine {
  id: number;
  type: "command" | "output" | "success" | "info" | "mcp" | "code" | "comment";
  text: string;
  delay?: number;
}

// Terminal script - the story we're telling
const terminalScript: Omit<TerminalLine, "id">[] = [
  { type: "command", text: "frictionless init", delay: 0 },
  { type: "output", text: "Initializing Frictionless agent...", delay: 300 },
  { type: "success", text: "Agent ready. Connecting to MCP servers...", delay: 800 },
  { type: "command", text: "frictionless connect amplitude-mcp", delay: 1500 },
  { type: "mcp", text: "MCP: amplitude-mcp connected", delay: 1800 },
  { type: "info", text: "  → get_events, get_funnels, get_cohorts, analyze_behavior", delay: 2100 },
  { type: "command", text: "frictionless connect github-mcp", delay: 2800 },
  { type: "mcp", text: "MCP: github-mcp connected", delay: 3100 },
  { type: "info", text: "  → read_file, create_pr, leave_comment, get_diff", delay: 3400 },
  { type: "command", text: "frictionless analyze --project acme-landing", delay: 4200 },
  { type: "output", text: "Fetching behavioral data from Amplitude...", delay: 4600 },
  { type: "info", text: "  → 24,847 events loaded (last 7 days)", delay: 5000 },
  { type: "info", text: "  → 3 friction patterns detected", delay: 5400 },
  { type: "output", text: "Spawning sandboxed execution environment...", delay: 5800 },
  { type: "code", text: "// Analyzing nav_dropdown_click → rage_click correlation", delay: 6200 },
  { type: "code", text: "const pattern = await analyze({ event: 'rage_click' });", delay: 6500 },
  { type: "code", text: "// Found: 34% of dropdown users exhibit frustration", delay: 6900 },
  { type: "success", text: "Analysis complete. Generating suggestions...", delay: 7400 },
  { type: "command", text: "frictionless suggest --apply", delay: 8000 },
  { type: "comment", text: "// components/nav.tsx:42", delay: 8400 },
  { type: "comment", text: "// Suggestion: Replace dropdown with mega-menu", delay: 8700 },
  { type: "comment", text: "// Impact: -18% bounce rate (predicted)", delay: 9000 },
  { type: "output", text: "Creating PR with suggested changes...", delay: 9500 },
  { type: "success", text: "PR #127 created: 'fix: replace dropdown with mega-menu'", delay: 10000 },
  { type: "info", text: "  → 3 files changed, 2 comments added", delay: 10300 },
  { type: "success", text: "Done. A/B test ready to deploy.", delay: 10800 },
];

export default function AgentCLIDemo() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [connectedMCPs, setConnectedMCPs] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const runDemo = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLines([]);
    setConnectedMCPs([]);
    idRef.current = 0;

    // Schedule each line
    terminalScript.forEach((line, i) => {
      setTimeout(() => {
        idRef.current++;
        setLines((prev) => [...prev, { ...line, id: idRef.current }]);

        // Track connected MCPs
        if (line.type === "mcp") {
          if (line.text.includes("amplitude")) {
            setConnectedMCPs((prev) => [...prev, "amplitude"]);
          } else if (line.text.includes("github")) {
            setConnectedMCPs((prev) => [...prev, "github"]);
          }
        }
      }, line.delay || 0);
    });

    // Reset after completion
    setTimeout(() => {
      setIsRunning(false);
    }, 12000);
  };

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Start on mount
  useEffect(() => {
    const timer = setTimeout(() => runDemo(), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full flex gap-4">
      {/* Left side - Terminal */}
      <div className="flex-1 rounded-lg border border-border bg-[#1a1a1a] overflow-hidden flex flex-col">
        {/* Terminal header */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/50 bg-[#252525]">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-[#ff5f57]" />
            <div className="size-3 rounded-full bg-[#febc2e]" />
            <div className="size-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Terminal className="size-4" />
            <span>frictionless</span>
          </div>
          <div className="flex-1" />
          <button
            onClick={runDemo}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-mypage/20 text-mypage hover:bg-mypage/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="size-3" />
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>

        {/* Terminal content */}
        <div
          ref={terminalRef}
          className="flex-1 p-4 font-mono text-sm overflow-auto"
          style={{ scrollBehavior: "smooth" }}
        >
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <TerminalLineComponent key={line.id} line={line} />
            ))}
          </AnimatePresence>

          {/* Blinking cursor */}
          {isRunning && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-gray-400 ml-1"
            />
          )}
        </div>
      </div>

      {/* Right side - MCP connections & status */}
      <div className="w-72 flex flex-col gap-4">
        {/* Connected MCPs */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Plug className="size-4 text-mypage" />
            <span className="text-sm font-medium">Connected MCPs</span>
          </div>
          <div className="space-y-2">
            <MCPCard
              name="Amplitude"
              icon={Database}
              tools={["get_events", "analyze_behavior", "get_funnels"]}
              isConnected={connectedMCPs.includes("amplitude")}
            />
            <MCPCard
              name="GitHub"
              icon={GitBranch}
              tools={["read_file", "create_pr", "leave_comment"]}
              isConnected={connectedMCPs.includes("github")}
            />
            <MCPCard
              name="Sandbox"
              icon={Code2}
              tools={["execute_code", "analyze_pattern"]}
              isConnected={lines.some((l) => l.text.includes("sandboxed"))}
            />
          </div>
        </div>

        {/* Agent capabilities */}
        <div className="rounded-lg border border-border bg-card p-4 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="size-4 text-mypage" />
            <span className="text-sm font-medium">Agent Capabilities</span>
          </div>
          <div className="space-y-2 text-xs">
            <CapabilityItem
              icon={Database}
              text="Fetch behavioral data from analytics"
              active={lines.some((l) => l.text.includes("Fetching"))}
            />
            <CapabilityItem
              icon={Code2}
              text="Run sandboxed code analysis"
              active={lines.some((l) => l.type === "code")}
            />
            <CapabilityItem
              icon={MessageSquare}
              text="Generate inline code comments"
              active={lines.some((l) => l.type === "comment")}
            />
            <CapabilityItem
              icon={FileCode}
              text="Suggest refactors with diffs"
              active={lines.some((l) => l.text.includes("PR"))}
            />
            <CapabilityItem
              icon={GitBranch}
              text="Create PRs automatically"
              active={lines.some((l) => l.text.includes("PR #127"))}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <StatBox
              label="Events"
              value={lines.some((l) => l.text.includes("24,847")) ? "24.8k" : "—"}
            />
            <StatBox
              label="Patterns"
              value={lines.some((l) => l.text.includes("3 friction")) ? "3" : "—"}
            />
            <StatBox
              label="PRs"
              value={lines.some((l) => l.text.includes("PR #127")) ? "1" : "—"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Terminal line component
function TerminalLineComponent({ line }: { line: TerminalLine }) {
  const getLineStyle = () => {
    switch (line.type) {
      case "command":
        return "text-white";
      case "output":
        return "text-gray-400";
      case "success":
        return "text-green-400";
      case "info":
        return "text-gray-500";
      case "mcp":
        return "text-mypage";
      case "code":
        return "text-yellow-300/80 pl-4 border-l-2 border-yellow-500/30";
      case "comment":
        return "text-blue-400/80 pl-4 border-l-2 border-blue-500/30";
      default:
        return "text-gray-400";
    }
  };

  const getPrefix = () => {
    if (line.type === "command") {
      return <span className="text-mypage mr-2">❯</span>;
    }
    if (line.type === "success") {
      return <span className="text-green-400 mr-2">✓</span>;
    }
    if (line.type === "mcp") {
      return <span className="text-mypage mr-2">⚡</span>;
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={`py-0.5 ${getLineStyle()}`}
    >
      {getPrefix()}
      <span>{line.text}</span>
    </motion.div>
  );
}

// MCP Card component
function MCPCard({
  name,
  icon: Icon,
  tools,
  isConnected,
}: {
  name: string;
  icon: typeof Database;
  tools: string[];
  isConnected: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: isConnected ? 1 : 0.5 }}
      className={`p-2 rounded-md border transition-colors ${
        isConnected
          ? "bg-mypage/10 border-mypage/30"
          : "bg-muted/30 border-border"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`size-3.5 ${isConnected ? "text-mypage" : "text-muted-foreground"}`} />
        <span className={`text-xs font-medium ${isConnected ? "text-foreground" : "text-muted-foreground"}`}>
          {name}
        </span>
        {isConnected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto"
          >
            <CheckCircle2 className="size-3 text-success" />
          </motion.div>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {tools.slice(0, 3).map((tool) => (
          <span
            key={tool}
            className={`text-[9px] px-1.5 py-0.5 rounded ${
              isConnected ? "bg-mypage/20 text-mypage" : "bg-muted text-muted-foreground"
            }`}
          >
            {tool}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// Capability item
function CapabilityItem({
  icon: Icon,
  text,
  active,
}: {
  icon: typeof Database;
  text: string;
  active: boolean;
}) {
  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.4 }}
      className="flex items-center gap-2"
    >
      <div
        className={`size-5 rounded flex items-center justify-center ${
          active ? "bg-success/20" : "bg-muted"
        }`}
      >
        {active ? (
          <CheckCircle2 className="size-3 text-success" />
        ) : (
          <Icon className="size-3 text-muted-foreground" />
        )}
      </div>
      <span className={active ? "text-foreground" : "text-muted-foreground"}>{text}</span>
    </motion.div>
  );
}

// Stat box
function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2">
      <motion.div
        key={value}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-lg font-semibold text-mypage"
      >
        {value}
      </motion.div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}
