import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "~/components/ui/card";
import {
  Sparkles,
  Send,
  User,
  Bot,
  Loader2,
  GripVertical,
  X,
  Plus,
  RotateCcw,
} from "lucide-react";
import type { Route } from "./+types/ai-generated";
import { TestWebsite } from "~/components/test-website";

// Light mode CSS variables to force light theme in preview containers
const lightModeStyles: React.CSSProperties = {
  // @ts-expect-error - CSS custom properties
  "--background": "#fffcf0",
  "--foreground": "#100f0f",
  "--card": "#fffcf0",
  "--card-foreground": "#100f0f",
  "--popover": "#fffcf0",
  "--popover-foreground": "#100f0f",
  "--primary": "#1c1b1a",
  "--primary-foreground": "#f2f0e5",
  "--secondary": "#f2f0e5",
  "--secondary-foreground": "#1c1b1a",
  "--muted": "#f2f0e5",
  "--muted-foreground": "#6f6e69",
  "--accent": "#f2f0e5",
  "--accent-foreground": "#1c1b1a",
  "--destructive": "#c03e35",
  "--border": "#e6e4d9",
  "--input": "#e6e4d9",
  "--ring": "#9f9d96",
};

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "AI Generated - Website Generator" },
    { name: "description", content: "Generate websites using AI" },
  ];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface WebsiteVariant {
  heroTitle?: string;
  heroSubtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

type SectionId = "hero" | "features" | "how-it-works";

const ALL_SECTIONS: SectionId[] = ["hero", "features", "how-it-works"];

const SECTION_NAMES: Record<SectionId, string> = {
  hero: "Hero",
  features: "Features",
  "how-it-works": "How It Works",
};

interface AIResponse {
  message: string;
  variant?: Partial<WebsiteVariant>;
  sectionChanges?: {
    remove?: SectionId[];
    add?: SectionId[];
    reorder?: SectionId[];
  };
}

// Intelligent AI response generator
function generateAIResponse(
  userMessage: string,
  currentVariant: WebsiteVariant,
  currentSections: SectionId[]
): AIResponse {
  const lowerMessage = userMessage.toLowerCase();

  // Remove section commands
  const removeMatch = lowerMessage.match(
    /remove|delete|hide|get rid of|take out/
  );
  if (removeMatch) {
    const sectionsToRemove: SectionId[] = [];
    if (
      lowerMessage.includes("hero") ||
      lowerMessage.includes("header") ||
      lowerMessage.includes("top")
    ) {
      sectionsToRemove.push("hero");
    }
    if (
      lowerMessage.includes("feature") ||
      lowerMessage.includes("card") ||
      lowerMessage.includes("middle")
    ) {
      sectionsToRemove.push("features");
    }
    if (
      lowerMessage.includes("how") ||
      lowerMessage.includes("work") ||
      lowerMessage.includes("step") ||
      lowerMessage.includes("loop") ||
      lowerMessage.includes("bottom")
    ) {
      sectionsToRemove.push("how-it-works");
    }

    if (sectionsToRemove.length > 0) {
      const removedNames = sectionsToRemove
        .map((s) => SECTION_NAMES[s])
        .join(", ");
      return {
        message: `Done! I've removed the ${removedNames} section${sectionsToRemove.length > 1 ? "s" : ""}. You can add ${sectionsToRemove.length > 1 ? "them" : "it"} back anytime by asking me or using the + button.`,
        sectionChanges: { remove: sectionsToRemove },
      };
    }
  }

  // Add section commands
  const addMatch = lowerMessage.match(/add|show|bring back|restore|include/);
  if (addMatch) {
    const sectionsToAdd: SectionId[] = [];
    const removedSections = ALL_SECTIONS.filter(
      (s) => !currentSections.includes(s)
    );

    if (
      lowerMessage.includes("hero") ||
      lowerMessage.includes("header") ||
      lowerMessage.includes("top")
    ) {
      if (!currentSections.includes("hero")) sectionsToAdd.push("hero");
    }
    if (
      lowerMessage.includes("feature") ||
      lowerMessage.includes("card") ||
      lowerMessage.includes("middle")
    ) {
      if (!currentSections.includes("features")) sectionsToAdd.push("features");
    }
    if (
      lowerMessage.includes("how") ||
      lowerMessage.includes("work") ||
      lowerMessage.includes("step") ||
      lowerMessage.includes("loop") ||
      lowerMessage.includes("bottom")
    ) {
      if (!currentSections.includes("how-it-works"))
        sectionsToAdd.push("how-it-works");
    }
    if (
      lowerMessage.includes("all") ||
      lowerMessage.includes("everything") ||
      lowerMessage.includes("every section")
    ) {
      sectionsToAdd.push(...removedSections);
    }

    if (sectionsToAdd.length > 0) {
      const addedNames = sectionsToAdd.map((s) => SECTION_NAMES[s]).join(", ");
      return {
        message: `I've added the ${addedNames} section${sectionsToAdd.length > 1 ? "s" : ""} back to your page.`,
        sectionChanges: { add: sectionsToAdd },
      };
    }
  }

  // Reorder commands
  const reorderMatch = lowerMessage.match(
    /move|reorder|rearrange|swap|put .* (before|after|first|last|top|bottom)/
  );
  if (reorderMatch) {
    let newOrder: SectionId[] = [...currentSections];

    // Move hero to different positions
    if (lowerMessage.includes("hero")) {
      newOrder = newOrder.filter((s) => s !== "hero");
      if (
        lowerMessage.includes("last") ||
        lowerMessage.includes("bottom") ||
        lowerMessage.includes("end")
      ) {
        if (currentSections.includes("hero")) newOrder.push("hero");
      } else if (
        lowerMessage.includes("first") ||
        lowerMessage.includes("top") ||
        lowerMessage.includes("start")
      ) {
        if (currentSections.includes("hero")) newOrder.unshift("hero");
      } else if (lowerMessage.includes("after feature")) {
        const idx = newOrder.indexOf("features");
        if (currentSections.includes("hero"))
          newOrder.splice(idx + 1, 0, "hero");
      }
    }

    // Move features
    if (lowerMessage.includes("feature") && !lowerMessage.includes("hero")) {
      newOrder = newOrder.filter((s) => s !== "features");
      if (
        lowerMessage.includes("last") ||
        lowerMessage.includes("bottom") ||
        lowerMessage.includes("end")
      ) {
        if (currentSections.includes("features")) newOrder.push("features");
      } else if (
        lowerMessage.includes("first") ||
        lowerMessage.includes("top") ||
        lowerMessage.includes("start")
      ) {
        if (currentSections.includes("features")) newOrder.unshift("features");
      }
    }

    // Move how-it-works
    if (
      (lowerMessage.includes("how") || lowerMessage.includes("step")) &&
      !lowerMessage.includes("hero") &&
      !lowerMessage.includes("feature")
    ) {
      newOrder = newOrder.filter((s) => s !== "how-it-works");
      if (
        lowerMessage.includes("first") ||
        lowerMessage.includes("top") ||
        lowerMessage.includes("start")
      ) {
        if (currentSections.includes("how-it-works"))
          newOrder.unshift("how-it-works");
      } else if (lowerMessage.includes("after hero")) {
        const idx = newOrder.indexOf("hero");
        if (currentSections.includes("how-it-works"))
          newOrder.splice(idx + 1, 0, "how-it-works");
      } else {
        if (currentSections.includes("how-it-works"))
          newOrder.push("how-it-works");
      }
    }

    if (JSON.stringify(newOrder) !== JSON.stringify(currentSections)) {
      return {
        message: `I've rearranged the sections. The new order is: ${newOrder.map((s) => SECTION_NAMES[s]).join(" → ")}.`,
        sectionChanges: { reorder: newOrder },
      };
    }
  }

  // Reset command
  if (
    lowerMessage.includes("reset") ||
    lowerMessage.includes("start over") ||
    lowerMessage.includes("original")
  ) {
    return {
      message:
        "I've reset everything back to the original design. All sections are restored and styling is back to default.",
      variant: {
        heroTitle: undefined,
        heroSubtitle: undefined,
        primaryButtonText: undefined,
        secondaryButtonText: undefined,
        gradientFrom: undefined,
        gradientTo: undefined,
      },
      sectionChanges: { reorder: ["hero", "features", "how-it-works"] },
    };
  }

  // Style/content modifications
  if (lowerMessage.includes("gradient") || lowerMessage.includes("color")) {
    if (lowerMessage.includes("purple") || lowerMessage.includes("violet")) {
      return {
        message:
          "I've updated the background with a rich purple gradient. This creates a more premium, modern feel.",
        variant: {
          gradientFrom: "from-purple-900",
          gradientTo: "to-indigo-900",
        },
      };
    }
    if (lowerMessage.includes("blue")) {
      return {
        message:
          "I've applied a professional blue gradient. Blue conveys trust and reliability.",
        variant: {
          gradientFrom: "from-blue-900",
          gradientTo: "to-cyan-800",
        },
      };
    }
    if (lowerMessage.includes("dark") || lowerMessage.includes("black")) {
      return {
        message:
          "I've applied a sleek dark gradient for a sophisticated, modern appearance.",
        variant: {
          gradientFrom: "from-gray-900",
          gradientTo: "to-black",
        },
      };
    }
    if (lowerMessage.includes("green")) {
      return {
        message:
          "I've added a fresh green gradient, great for conveying growth and sustainability.",
        variant: {
          gradientFrom: "from-emerald-900",
          gradientTo: "to-teal-800",
        },
      };
    }
    return {
      message:
        "I've updated the background gradient to give it a more modern feel.",
      variant: {
        gradientFrom: "from-purple-900",
        gradientTo: "to-indigo-900",
      },
    };
  }

  if (
    lowerMessage.includes("hero") ||
    lowerMessage.includes("title") ||
    lowerMessage.includes("headline")
  ) {
    if (lowerMessage.includes("short") || lowerMessage.includes("minimal")) {
      return {
        message:
          "I've made the hero more concise with a punchy headline that gets straight to the point.",
        variant: {
          heroTitle: "Frictionless UX",
          heroSubtitle: "AI-powered insights. Automatic improvements.",
        },
      };
    }
    if (lowerMessage.includes("exciting") || lowerMessage.includes("bold")) {
      return {
        message:
          "I've made the hero section more exciting with a bold, action-oriented headline!",
        variant: {
          heroTitle: "Supercharge Your Product!",
          heroSubtitle:
            "Watch your UX transform as AI detects friction and automatically optimizes every interaction.",
        },
      };
    }
    return {
      message:
        "I've updated the hero with a stronger value proposition that focuses on the key benefit.",
      variant: {
        heroTitle: "Transform Your UX with AI",
        heroSubtitle:
          "Automatically detect friction, understand user behavior, and improve your product—all powered by intelligent analytics.",
      },
    };
  }

  if (lowerMessage.includes("button") || lowerMessage.includes("cta")) {
    if (lowerMessage.includes("urgent") || lowerMessage.includes("action")) {
      return {
        message:
          "I've made the CTAs more urgent and action-oriented to increase conversions.",
        variant: {
          primaryButtonText: "Start Free Now",
          secondaryButtonText: "See It In Action",
        },
      };
    }
    return {
      message:
        "I've optimized the CTAs with more engaging text that creates urgency.",
      variant: {
        primaryButtonText: "Start Free Trial",
        secondaryButtonText: "Watch Demo",
      },
    };
  }

  if (lowerMessage.includes("modern") || lowerMessage.includes("minimal")) {
    return {
      message:
        "I've applied a modern, minimal design with cleaner typography and a refined dark palette.",
      variant: {
        heroTitle: "Frictionless UX",
        heroSubtitle: "AI-powered insights. Automatic improvements.",
        gradientFrom: "from-slate-900",
        gradientTo: "to-slate-800",
        primaryButtonText: "Get Started",
        secondaryButtonText: "Learn More",
      },
    };
  }

  if (lowerMessage.includes("professional") || lowerMessage.includes("corporate")) {
    return {
      message:
        "I've refined the design with a more professional, corporate aesthetic.",
      variant: {
        heroTitle: "Enterprise-Grade UX Analytics",
        heroSubtitle:
          "Harness the power of AI to optimize user experiences at scale.",
        gradientFrom: "from-slate-800",
        gradientTo: "to-blue-900",
        primaryButtonText: "Request Demo",
        secondaryButtonText: "View Case Studies",
      },
    };
  }

  if (lowerMessage.includes("playful") || lowerMessage.includes("fun")) {
    return {
      message:
        "I've made it more playful and engaging with a friendlier tone!",
      variant: {
        heroTitle: "Say Goodbye to UX Headaches!",
        heroSubtitle:
          "Let AI do the heavy lifting while you sit back and watch your product get better.",
        gradientFrom: "from-pink-600",
        gradientTo: "to-purple-700",
        primaryButtonText: "Let's Go!",
        secondaryButtonText: "Show Me How",
      },
    };
  }

  // Help / default response
  const removedSections = ALL_SECTIONS.filter(
    (s) => !currentSections.includes(s)
  );
  const removedInfo =
    removedSections.length > 0
      ? `\n\nCurrently hidden sections: ${removedSections.map((s) => SECTION_NAMES[s]).join(", ")}`
      : "";

  return {
    message: `I can help you customize your website! Try asking me to:

**Modify content:**
• "Make the hero more exciting"
• "Update the buttons to be more urgent"
• "Make it look more professional"

**Change colors:**
• "Change gradient to purple/blue/dark/green"
• "Make it more modern and minimal"

**Rearrange sections:**
• "Move features to the top"
• "Put how it works before features"

**Add/remove sections:**
• "Remove the features section"
• "Add back the hero"
• "Reset to original"${removedInfo}`,
  };
}

export default function AIGeneratedView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Heyyyy, I'm Fricty! 👋\n\nI'm your AI design assistant. I can help you modify content, change colors, rearrange sections, or add/remove components.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [variant, setVariant] = useState<WebsiteVariant>({});
  const [visibleSections, setVisibleSections] = useState<SectionId[]>([
    "hero",
    "features",
    "how-it-works",
  ]);
  const [draggedSection, setDraggedSection] = useState<SectionId | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hiddenSections = ALL_SECTIONS.filter(
    (s) => !visibleSections.includes(s)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDragStart = useCallback((sectionId: SectionId) => {
    setDraggedSection(sectionId);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetId: SectionId) => {
      e.preventDefault();
      if (!draggedSection || draggedSection === targetId) return;

      setVisibleSections((prev) => {
        const newOrder = [...prev];
        const draggedIndex = newOrder.indexOf(draggedSection);
        const targetIndex = newOrder.indexOf(targetId);
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedSection);
        return newOrder;
      });
    },
    [draggedSection]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedSection(null);
  }, []);

  const handleRemoveSection = useCallback((sectionId: SectionId) => {
    setVisibleSections((prev) => prev.filter((s) => s !== sectionId));
  }, []);

  const handleAddSection = useCallback((sectionId: SectionId) => {
    setVisibleSections((prev) => [...prev, sectionId]);
  }, []);

  const handleReset = useCallback(() => {
    setVariant({});
    setVisibleSections(["hero", "features", "how-it-works"]);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "assistant",
        content: "Reset complete! Everything is back to the original design.",
      },
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    try {
      const response = generateAIResponse(userMessage, variant, visibleSections);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Apply variant changes
      if (response.variant) {
        setVariant((prev) => ({ ...prev, ...response.variant }));
      }

      // Apply section changes
      if (response.sectionChanges) {
        if (response.sectionChanges.reorder) {
          setVisibleSections(response.sectionChanges.reorder);
        } else {
          if (response.sectionChanges.remove) {
            setVisibleSections((prev) =>
              prev.filter((s) => !response.sectionChanges!.remove!.includes(s))
            );
          }
          if (response.sectionChanges.add) {
            setVisibleSections((prev) => [
              ...prev,
              ...response.sectionChanges!.add!.filter((s) => !prev.includes(s)),
            ]);
          }
        }
      }
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges =
    Object.keys(variant).some(
      (k) => variant[k as keyof WebsiteVariant] !== undefined
    ) ||
    JSON.stringify(visibleSections) !==
    JSON.stringify(["hero", "features", "how-it-works"]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#1c1b1a]" />
            AI Generated
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Generate website variations using AI
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#6f6e69] hover:text-[#1c1b1a] hover:bg-[#fffcf0] border border-transparent hover:border-[#e6e4d9] rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Side by Side Preview */}
      <div className="grid grid-cols-2 gap-4">
        {/* Original Website */}
        <Card className="overflow-hidden gap-0 py-0">
          <div className="p-3 border-b bg-muted/50 flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <span className="text-sm font-medium">Original</span>
          </div>
          <CardContent className="p-0">
            <div className="h-[400px] overflow-hidden relative bg-[#fffcf0]">
              <div
                className="absolute inset-0 transform scale-[0.35] origin-top-left w-[285%] h-[285%] overflow-y-auto overflow-x-hidden"
                style={lightModeStyles}
              >
                <TestWebsite />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Generated Preview */}
        <Card className="overflow-hidden border-[#e6e4d9] gap-0 py-0">
          <div className="p-3 border-b bg-[#fffcf0] flex items-center justify-between">
            <span className="text-sm font-medium text-[#1c1b1a] flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Generated
              {hasChanges && (
                <span className="ml-1 text-xs bg-[#1c1b1a] text-[#f2f0e5] px-2 py-0.5 rounded-full">
                  Modified
                </span>
              )}
            </span>
            <span className="text-xs text-[#6f6e69]">
              Hover sections to drag or remove
            </span>
          </div>
          <CardContent className="p-0">
            <div className="h-[400px] overflow-hidden relative bg-[#fffcf0]">
              <div
                className="absolute inset-0 transform scale-[0.35] origin-top-left w-[285%] h-[285%] overflow-y-auto overflow-x-hidden"
                style={lightModeStyles}
              >
                <TestWebsiteVariant
                  variant={variant}
                  sectionOrder={visibleSections}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onRemove={handleRemoveSection}
                  draggedSection={draggedSection}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hidden Sections Bar */}
      {hiddenSections.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-[#fffcf0] border border-[#e6e4d9] rounded-lg">
          <span className="text-sm text-[#6f6e69]">Hidden sections:</span>
          {hiddenSections.map((sectionId) => (
            <button
              key={sectionId}
              onClick={() => handleAddSection(sectionId)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-[#e6e4d9] rounded-md hover:bg-[#1c1b1a] hover:text-[#f2f0e5] hover:border-[#1c1b1a] transition-colors"
            >
              <Plus className="w-3 h-3" />
              {SECTION_NAMES[sectionId]}
            </button>
          ))}
        </div>
      )}

      {/* Chat Interface */}
      <Card className="gap-0 py-0 border-[#e6e4d9] bg-white">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Chat Messages Area */}
            <div className="h-48 overflow-y-auto pr-2">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-[#1c1b1a]" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] text-sm whitespace-pre-wrap ${message.role === "user"
                        ? "rounded-lg px-3 py-2 bg-[#1c1b1a] text-[#f2f0e5]"
                        : "text-[#1c1b1a] pt-1"
                        }`}
                    >
                      {message.content}
                    </div>
                    {message.role === "user" && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-[#1c1b1a]" />
                    </div>
                    <div className="pt-1">
                      <Loader2 className="w-4 h-4 animate-spin text-[#1c1b1a]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything - 'Make it more modern', 'Remove hero', etc."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1c1b1a]"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-[#1c1b1a] text-[#f2f0e5] rounded-lg hover:bg-[#343231] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface TestWebsiteVariantProps {
  variant: WebsiteVariant;
  sectionOrder: SectionId[];
  onDragStart: (sectionId: SectionId) => void;
  onDragOver: (e: React.DragEvent, targetId: SectionId) => void;
  onDragEnd: () => void;
  onRemove: (sectionId: SectionId) => void;
  draggedSection: SectionId | null;
}

// Variant component that applies the AI-generated changes
function TestWebsiteVariant({
  variant,
  sectionOrder,
  onDragStart,
  onDragOver,
  onDragEnd,
  onRemove,
  draggedSection,
}: TestWebsiteVariantProps) {
  const uofthacks = "/UofTHacks.png";
  const uofthacksbg = "/UofTHacksBg.png";

  const hasCustomGradient = variant.gradientFrom || variant.gradientTo;
  const gradientClass = hasCustomGradient
    ? `min-h-screen bg-gradient-to-br ${variant.gradientFrom || "from-[#fffcf0]"} ${variant.gradientTo || "to-[#f2f0e5]"}`
    : "min-h-screen bg-gradient-to-br from-[#fffcf0] to-[#f2f0e5]";

  const renderSection = (sectionId: SectionId) => {
    const isDragging = draggedSection === sectionId;
    const wrapperClass = `relative group transition-opacity ${isDragging ? "opacity-50" : ""}`;

    const toolbar = (
      <div className="absolute left-2 top-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        <div
          className="bg-white/95 rounded-md px-2 py-1.5 shadow-lg cursor-grab active:cursor-grabbing flex items-center gap-1.5 text-xs text-gray-700 hover:bg-gray-50 border border-gray-200"
          draggable
          onDragStart={() => onDragStart(sectionId)}
          onDragEnd={onDragEnd}
        >
          <GripVertical className="w-3 h-3" />
          {SECTION_NAMES[sectionId]}
        </div>
        <button
          onClick={() => onRemove(sectionId)}
          className="bg-white/95 rounded-md p-1.5 shadow-lg text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors"
          title="Remove section"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );

    switch (sectionId) {
      case "hero":
        return (
          <div
            key={sectionId}
            className={wrapperClass}
            onDragOver={(e) => onDragOver(e, sectionId)}
          >
            {toolbar}
            <section className="container mx-auto px-4 py-8">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="relative w-80 h-80 md:w-96 md:h-96 drop-shadow-2xl rounded-xl overflow-hidden">
                  <img
                    src={uofthacks}
                    alt="Frictionless Logo"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-bold text-[#100f0f]">
                    {variant.heroTitle || "Frictionless"}
                  </h1>
                  <p className="text-xl md:text-2xl text-[#6f6e69]">
                    {variant.heroSubtitle ||
                      "Turn behavioral events into AI-powered UX insights that automatically improve your product"}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto max-w-md">
                  <a href="#features" className="inline-block w-full sm:w-auto">
                    <button className="relative overflow-hidden cursor-pointer w-full text-lg px-8 py-6 h-auto bg-[#1c1b1a] text-[#f2f0e5] rounded-md hover:bg-[#343231] transition-colors shadow-md">
                      <span className="relative z-10">
                        {variant.primaryButtonText || "Get Started"}
                      </span>
                    </button>
                  </a>
                  <a
                    href="#how-it-works"
                    className="inline-block w-full sm:w-auto"
                  >
                    <button className="relative overflow-hidden cursor-pointer w-full text-lg px-8 py-6 h-auto border border-[#e6e4d9] bg-[#fffcf0] text-[#1c1b1a] rounded-md hover:bg-[#f2f0e5] transition-colors shadow-md">
                      <span className="relative z-10">
                        {variant.secondaryButtonText || "View Demo"}
                      </span>
                    </button>
                  </a>
                </div>
              </div>
            </section>
          </div>
        );

      case "features":
        return (
          <div
            key={sectionId}
            className={wrapperClass}
            onDragOver={(e) => onDragOver(e, sectionId)}
          >
            {toolbar}
            <section id="features" className="container mx-auto px-4 py-8">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="shadow-lg hover:shadow-xl transition-shadow rounded-lg border border-[#e6e4d9] bg-[#fffcf0] text-[#100f0f]">
                    <div className="p-6 pb-3">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight">
                        Behavioral Event Tracking
                      </h3>
                      <p className="text-sm text-[#6f6e69]">
                        Capture product analytics-style events in real-time
                      </p>
                    </div>
                    <div className="p-6 pt-3">
                      <p className="text-base text-[#6f6e69]">
                        Track user actions like clicks, searches, rage clicks,
                        and navigation patterns.
                      </p>
                    </div>
                  </div>
                  <div className="shadow-lg hover:shadow-xl transition-shadow rounded-lg border border-[#e6e4d9] bg-[#fffcf0] text-[#100f0f]">
                    <div className="p-6 pb-3">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight">
                        AI-Powered Insights
                      </h3>
                      <p className="text-sm text-[#6f6e69]">
                        AI does what rules engines cannot - find hidden patterns
                      </p>
                    </div>
                    <div className="p-6 pt-3">
                      <p className="text-base text-[#6f6e69]">
                        Our AI analyzes behavioral data to detect friction
                        patterns and segment users by behavior.
                      </p>
                    </div>
                  </div>
                  <div className="shadow-lg hover:shadow-xl transition-shadow rounded-lg border border-[#e6e4d9] bg-[#fffcf0] text-[#100f0f]">
                    <div className="p-6 pb-3">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight">
                        Self-Improving Product
                      </h3>
                      <p className="text-sm text-[#6f6e69]">
                        Data → Insights → Action loop
                      </p>
                    </div>
                    <div className="p-6 pt-3">
                      <p className="text-base text-[#6f6e69]">
                        Every user interaction feeds back into the system to
                        continuously improve.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );

      case "how-it-works":
        return (
          <div
            key={sectionId}
            className={wrapperClass}
            onDragOver={(e) => onDragOver(e, sectionId)}
          >
            {toolbar}
            <section id="how-it-works" className="container mx-auto px-4 py-8">
              <div className="max-w-6xl mx-auto">
                <div className="shadow-xl rounded-lg border border-[#e6e4d9] bg-[#fffcf0] text-[#100f0f]">
                  <div className="text-center pb-3 p-4">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight mb-1">
                      The Amplitude-Style Loop
                    </h3>
                    <p className="text-base text-[#6f6e69]">
                      Behavioral events → AI analysis → Product improvements
                    </p>
                  </div>
                  <div className="space-y-4 p-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 text-center p-6 rounded-lg bg-[#f2f0e5]/50 flex flex-col h-full">
                        <div className="text-3xl font-bold text-[#1c1b1a] mb-1">
                          1
                        </div>
                        <h3 className="font-semibold text-lg">
                          Track Behavioral Events
                        </h3>
                        <p className="text-sm text-[#6f6e69] flex-1">
                          Capture product analytics events with proper schemas.
                        </p>
                      </div>
                      <div className="space-y-2 text-center p-6 rounded-lg bg-[#f2f0e5]/50 flex flex-col h-full">
                        <div className="text-3xl font-bold text-[#1c1b1a] mb-1">
                          2
                        </div>
                        <h3 className="font-semibold text-lg">
                          AI Detects Patterns
                        </h3>
                        <p className="text-sm text-[#6f6e69] flex-1">
                          AI clusters users and detects friction patterns.
                        </p>
                      </div>
                      <div className="space-y-2 text-center p-6 rounded-lg bg-[#f2f0e5]/50 flex flex-col h-full">
                        <div className="text-3xl font-bold text-[#1c1b1a] mb-1">
                          3
                        </div>
                        <h3 className="font-semibold text-lg">
                          Improve Product
                        </h3>
                        <p className="text-sm text-[#6f6e69] flex-1">
                          The product improves itself automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className={gradientClass}>
      {sectionOrder.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-gray-500 p-8">
            <p className="text-lg">No sections visible</p>
            <p className="text-sm mt-2">
              Use the chat or click + buttons to add sections
            </p>
          </div>
        </div>
      ) : (
        sectionOrder.map((sectionId) => renderSection(sectionId))
      )}
    </main>
  );
}
