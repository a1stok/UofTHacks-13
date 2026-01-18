import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Logo */}
          <div className="relative w-80 h-80 md:w-96 md:h-96 drop-shadow-2xl rounded-xl overflow-hidden">
            <Image
              src="/UofTHacks.png"
              alt="Frictionless Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Frictionless
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              The AI UX Researcher — Detect friction patterns and get prioritized UI fixes with evidence
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a href="#features" className="inline-block w-full sm:w-auto">
              <Button 
                size="lg" 
                className="shadow-lg relative overflow-hidden group cursor-pointer w-full text-lg px-8 py-6 h-auto"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                  <Image
                    src="/UofTHacksBg.png"
                    alt="Background"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="relative z-10">Get Started</span>
              </Button>
            </a>
            <a href="#how-it-works" className="inline-block w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="shadow-lg relative overflow-hidden group cursor-pointer w-full text-lg px-8 py-6 h-auto"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                  <Image
                    src="/UofTHacksBg.png"
                    alt="Background"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="relative z-10">View Demo</span>
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>AI-Powered Detection</CardTitle>
              <CardDescription>
                Automatically identify friction patterns in user behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analyzes behavioral events like clicks, hovers, searches, and rage clicks to detect where users struggle in your interface.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Prioritized Fixes</CardTitle>
              <CardDescription>
                Get actionable recommendations with evidence-backed insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Receive specific, prioritized UI fixes with behavioral evidence, user journey maps, and predicted impact metrics.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Self-Improving Loop</CardTitle>
              <CardDescription>
                Continuous learning from user behavior and your decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The system learns from every session and your feedback, creating a self-improving product that gets better over time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Project Details */}
      <section id="how-it-works" className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl mb-1">How It Works</CardTitle>
              <CardDescription className="text-lg">
                From behavioral events to actionable insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 text-center p-4 rounded-lg bg-secondary/50">
                  <div className="text-3xl font-bold text-primary mb-1">1</div>
                  <h3 className="font-semibold text-lg">Capture Events</h3>
                  <p className="text-sm text-muted-foreground">
                    Stream behavioral events: clicks, hovers, searches, navigation patterns, and rage clicks in real-time.
                  </p>
                </div>
                <div className="space-y-2 text-center p-4 rounded-lg bg-secondary/50">
                  <div className="text-3xl font-bold text-primary mb-1">2</div>
                  <h3 className="font-semibold text-lg">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced AI detects friction patterns, dead-end workflows, and identifies unused features eating UI space.
                  </p>
                </div>
                <div className="space-y-2 text-center p-4 rounded-lg bg-secondary/50">
                  <div className="text-3xl font-bold text-primary mb-1">3</div>
                  <h3 className="font-semibold text-lg">Get Fixes</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive prioritized recommendations with evidence, user journey maps, and predicted impact metrics.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}