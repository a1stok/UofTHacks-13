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
    { title: "Frictionless" },
    { name: "description", content: "Generate website variations for Frictionless using AI" },
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
  backgroundColor?: string; // For solid background colors like red
  swapPictureAndText?: boolean; // Swap image and text in hero
  swapParagraphs?: boolean; // Swap paragraphs in features section
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
  targetServer?: 1 | 2 | "both"; // Which server to apply changes to
}

// TODO: Replace with actual AI API call
async function generateAIResponse(
  userMessage: string,
  currentVariant: WebsiteVariant,
  currentSections: SectionId[]
): Promise<AIResponse> {
  // This should call an actual AI API endpoint
  // Example: const response = await fetch('/api/ai/generate', { ... })
  // For now, return a placeholder response
  throw new Error("AI integration not implemented. Please connect to an AI service.");
}

export default function AIGeneratedView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
        content:
        "Heyyyy, I'm Fricty! 👋\n\nI'm your AI design assistant. I can help you modify content, change colors, rearrange sections, swap components, or add/remove components. By default, changes apply to the right side. Specify 'left' or 'right' to target a specific side.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Separate state for each server
  const [variant1, setVariant1] = useState<WebsiteVariant>({});
  const [variant2, setVariant2] = useState<WebsiteVariant>({});
  const [visibleSections1, setVisibleSections1] = useState<SectionId[]>([
    "hero",
    "features",
    "how-it-works",
  ]);
  const [visibleSections2, setVisibleSections2] = useState<SectionId[]>([
    "hero",
    "features",
    "how-it-works",
  ]);
  const [draggedSection, setDraggedSection] = useState<SectionId | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hiddenSections1 = ALL_SECTIONS.filter(
    (s) => !visibleSections1.includes(s)
  );
  const hiddenSections2 = ALL_SECTIONS.filter(
    (s) => !visibleSections2.includes(s)
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

  const handleDragOver1 = useCallback(
    (e: React.DragEvent, targetId: SectionId) => {
      e.preventDefault();
      if (!draggedSection || draggedSection === targetId) return;

      setVisibleSections1((prev) => {
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

  const handleDragOver2 = useCallback(
    (e: React.DragEvent, targetId: SectionId) => {
      e.preventDefault();
      if (!draggedSection || draggedSection === targetId) return;

      setVisibleSections2((prev) => {
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

  const handleReset = useCallback((server?: 1 | 2) => {
    if (server === 1) {
      setVariant1({});
      setVisibleSections1(["hero", "features", "how-it-works"]);
    } else if (server === 2) {
      setVariant2({});
      setVisibleSections2(["hero", "features", "how-it-works"]);
    } else {
      setVariant1({});
      setVariant2({});
      setVisibleSections1(["hero", "features", "how-it-works"]);
      setVisibleSections2(["hero", "features", "how-it-works"]);
    }
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "assistant",
        content: "Reset complete!",
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

    try {
      // Call AI API to generate response
      const response = await generateAIResponse(userMessage, variant1, visibleSections1);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      const targetServer = response.targetServer || "both";

      // Apply variant changes to appropriate server(s)
      if (response.variant) {
        if (targetServer === 1 || targetServer === "both") {
          setVariant1((prev) => ({ ...prev, ...response.variant }));
        }
        if (targetServer === 2 || targetServer === "both") {
          setVariant2((prev) => ({ ...prev, ...response.variant }));
        }
      }

      // Apply section changes to appropriate server(s)
      if (response.sectionChanges) {
        const applyChanges = (setSections: React.Dispatch<React.SetStateAction<SectionId[]>>) => {
          if (response.sectionChanges!.reorder) {
            setSections(response.sectionChanges!.reorder);
          } else {
            if (response.sectionChanges!.remove) {
              setSections((prev) =>
                prev.filter((s) => !response.sectionChanges!.remove!.includes(s))
              );
            }
            if (response.sectionChanges!.add) {
              setSections((prev) => [
                ...prev,
                ...response.sectionChanges!.add!.filter((s) => !prev.includes(s)),
              ]);
            }
          }
        };

        if (targetServer === 1 || targetServer === "both") {
          applyChanges(setVisibleSections1);
        }
        if (targetServer === 2 || targetServer === "both") {
          applyChanges(setVisibleSections2);
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

  const hasChanges1 =
    Object.keys(variant1).some(
      (k) => variant1[k as keyof WebsiteVariant] !== undefined
    ) ||
    JSON.stringify(visibleSections1) !==
    JSON.stringify(["hero", "features", "how-it-works"]);
  
  const hasChanges2 =
    Object.keys(variant2).some(
      (k) => variant2[k as keyof WebsiteVariant] !== undefined
    ) ||
    JSON.stringify(visibleSections2) !==
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
            Generate Frictionless website variations using AI
          </p>
        </div>
        {(hasChanges1 || hasChanges2) && (
          <button
            onClick={() => handleReset()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#6f6e69] hover:text-[#1c1b1a] hover:bg-[#fffcf0] border border-transparent hover:border-[#e6e4d9] rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All
          </button>
        )}
      </div>

      {/* Side by Side Preview */}
      <div className="grid grid-cols-2 gap-4">
        {/* Test Server 1 */}
        <Card className="overflow-hidden gap-0 py-0">
          <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Web Test 1</span>
              {hasChanges1 && (
                <span className="ml-1 text-xs bg-[#1c1b1a] text-[#f2f0e5] px-2 py-0.5 rounded-full">
                  Modified
                </span>
              )}
            </div>
            {hasChanges1 && (
              <button
                onClick={() => handleReset(1)}
                className="text-xs text-[#6f6e69] hover:text-[#1c1b1a] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
          <CardContent className="p-0">
            <div className="h-[400px] overflow-hidden relative bg-[#fffcf0]">
              <div
                className="absolute inset-0 transform scale-[0.35] origin-top-left w-[285%] h-[285%] overflow-y-auto overflow-x-hidden"
                style={lightModeStyles}
              >
                <TestWebsiteVariant
                  variant={variant1}
                  sectionOrder={visibleSections1}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver1}
                  onDragEnd={handleDragEnd}
                  onRemove={(id) => setVisibleSections1((prev) => prev.filter((s) => s !== id))}
                  draggedSection={draggedSection}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Server 2 */}
        <Card className="overflow-hidden border-[#e6e4d9] gap-0 py-0">
          <div className="p-3 border-b bg-[#fffcf0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-[#1c1b1a]">Web Test 2</span>
              {hasChanges2 && (
                <span className="ml-1 text-xs bg-[#1c1b1a] text-[#f2f0e5] px-2 py-0.5 rounded-full">
                  Modified
                </span>
              )}
            </div>
            {hasChanges2 && (
              <button
                onClick={() => handleReset(2)}
                className="text-xs text-[#6f6e69] hover:text-[#1c1b1a] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
          <CardContent className="p-0">
            <div className="h-[400px] overflow-hidden relative bg-[#fffcf0]">
              <div
                className="absolute inset-0 transform scale-[0.35] origin-top-left w-[285%] h-[285%] overflow-y-auto overflow-x-hidden"
                style={lightModeStyles}
              >
                <TestWebsiteVariant
                  variant={variant2}
                  sectionOrder={visibleSections2}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver2}
                  onDragEnd={handleDragEnd}
                  onRemove={(id) => setVisibleSections2((prev) => prev.filter((s) => s !== id))}
                  draggedSection={draggedSection}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hidden Sections Bars */}
      {(hiddenSections1.length > 0 || hiddenSections2.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {hiddenSections1.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-[#fffcf0] border border-[#e6e4d9] rounded-lg">
              <span className="text-sm text-[#6f6e69]">Server 1 hidden:</span>
              {hiddenSections1.map((sectionId) => (
                <button
                  key={sectionId}
                  onClick={() => setVisibleSections1((prev) => [...prev, sectionId])}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-[#e6e4d9] rounded-md hover:bg-[#1c1b1a] hover:text-[#f2f0e5] hover:border-[#1c1b1a] transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  {SECTION_NAMES[sectionId]}
                </button>
              ))}
            </div>
          )}
          {hiddenSections2.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-[#fffcf0] border border-[#e6e4d9] rounded-lg">
              <span className="text-sm text-[#6f6e69]">Server 2 hidden:</span>
              {hiddenSections2.map((sectionId) => (
                <button
                  key={sectionId}
                  onClick={() => setVisibleSections2((prev) => [...prev, sectionId])}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-[#e6e4d9] rounded-md hover:bg-[#1c1b1a] hover:text-[#f2f0e5] hover:border-[#1c1b1a] transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  {SECTION_NAMES[sectionId]}
                </button>
              ))}
            </div>
          )}
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
                placeholder="Try: 'make background red', 'swap picture and text', 'swap paragraphs'"
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

  // Determine background style
  let backgroundClass = "min-h-screen";
  if (variant.backgroundColor) {
    // Solid background color
    const colorMap: Record<string, string> = {
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      black: "bg-black",
      white: "bg-white",
    };
    backgroundClass += ` ${colorMap[variant.backgroundColor] || "bg-red-500"}`;
  } else {
    // Gradient background
    const hasCustomGradient = variant.gradientFrom || variant.gradientTo;
    backgroundClass += hasCustomGradient
      ? ` bg-gradient-to-br ${variant.gradientFrom || "from-[#fffcf0]"} ${variant.gradientTo || "to-[#f2f0e5]"}`
      : " bg-gradient-to-br from-[#fffcf0] to-[#f2f0e5]";
  }

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
                {variant.swapPictureAndText ? (
                  <>
                    <div className="space-y-2 max-w-4xl">
                      <h1 className="text-4xl md:text-6xl font-bold text-[#100f0f]">
                        {variant.heroTitle || "Frictionless"}
                      </h1>
                      <p className="text-xl md:text-2xl text-[#6f6e69]">
                        {variant.heroSubtitle ||
                          "Turn behavioral events into AI-powered UX insights that automatically improve your product"}
                      </p>
                    </div>
                    <div className="relative w-80 h-80 md:w-96 md:h-96 drop-shadow-2xl rounded-xl overflow-hidden">
                      <img
                        src={uofthacks}
                        alt="Frictionless Logo"
                        className="object-cover"
                      />
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
        // Define feature cards
        const featureCards = [
          {
            title: "Behavioral Event Tracking",
            subtitle: "Capture product analytics-style events in real-time",
            description: "Track user actions like clicks, searches, rage clicks, and navigation patterns.",
          },
          {
            title: "AI-Powered Insights",
            subtitle: "AI does what rules engines cannot - find hidden patterns",
            description: "Our AI analyzes behavioral data to detect friction patterns and segment users by behavior.",
          },
          {
            title: "Self-Improving Product",
            subtitle: "Data → Insights → Action loop",
            description: "Every user interaction feeds back into the system to continuously improve.",
          },
        ];

        // Swap order if requested
        const displayCards = variant.swapParagraphs
          ? [featureCards[2], featureCards[1], featureCards[0]]
          : featureCards;

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
                  {displayCards.map((card, index) => (
                    <div
                      key={index}
                      className="shadow-lg hover:shadow-xl transition-shadow rounded-lg border border-[#e6e4d9] bg-[#fffcf0] text-[#100f0f]"
                    >
                      <div className="p-6 pb-3">
                        <h3 className="text-2xl font-semibold leading-none tracking-tight">
                          {card.title}
                        </h3>
                        <p className="text-sm text-[#6f6e69]">
                          {card.subtitle}
                        </p>
                      </div>
                      <div className="p-6 pt-3">
                        <p className="text-base text-[#6f6e69]">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  ))}
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
    <main className={backgroundClass}>
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
