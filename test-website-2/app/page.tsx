import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-red-500">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Title */}
          <div className="space-y-2 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Frictionless
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Turn behavioral events into AI-powered UX insights that automatically improve your product
            </p>
          </div>
          
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

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto max-w-md">
            <a href="#features" className="inline-block w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-black text-white hover:bg-gray-800 shadow-lg cursor-pointer w-full text-lg px-8 py-6 h-auto"
              >
                Get Started
              </Button>
            </a>
            <a href="#how-it-works" className="inline-block w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white text-black border-white hover:bg-gray-100 shadow-lg cursor-pointer w-full text-lg px-8 py-6 h-auto"
              >
                View Demo
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-2xl">Behavioral Event Tracking</CardTitle>
              <CardDescription className="text-sm">
                Capture product analytics-style events in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-3">
              <p className="text-base text-muted-foreground">
                Track user actions like clicks, searches, rage clicks, and navigation patterns. We treat data like behavioral product analytics with proper event schemas and user properties.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-2xl">AI-Powered Insights</CardTitle>
              <CardDescription className="text-sm">
                AI does what rules engines cannot - find hidden patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-3">
              <p className="text-base text-muted-foreground">
                Our AI analyzes behavioral data to detect friction patterns, segment users by behavior, and surface insights that no manual rules could find. It's like having a data analyst watching every session.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-2xl">Self-Improving Product</CardTitle>
              <CardDescription className="text-sm">
                Data → Insights → Action loop that gets smarter over time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-3">
              <p className="text-base text-muted-foreground">
                Every user interaction feeds back into the system. The AI learns from outcomes, adapts its recommendations, and continuously improves the product experience automatically.
              </p>
            </CardContent>
          </Card>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section id="how-it-works" className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white shadow-xl">
            <CardHeader className="text-center pb-3 p-4">
              <CardTitle className="text-2xl mb-1">The Amplitude-Style Loop</CardTitle>
              <CardDescription className="text-base">
                Behavioral events → AI analysis → Product improvements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 text-center p-6 rounded-lg bg-secondary/50 flex flex-col h-full">
                  <div className="text-3xl font-bold text-primary mb-1">1</div>
                  <h3 className="font-semibold text-lg">Track Behavioral Events</h3>
                  <p className="text-sm text-muted-foreground flex-1">
                    Capture product analytics events like page_viewed, feature_clicked, rage_click_detected, and user_struggled with proper event schemas and properties.
                  </p>
                </div>
                <div className="space-y-2 text-center p-6 rounded-lg bg-secondary/50 flex flex-col h-full">
                  <div className="text-3xl font-bold text-primary mb-1">2</div>
                  <h3 className="font-semibold text-lg">AI Detects Patterns</h3>
                  <p className="text-sm text-muted-foreground flex-1">
                    AI clusters users by behavior, detects friction patterns, and identifies opportunities that rules-based systems would miss. It's pattern recognition beyond manual segmentation.
                  </p>
                </div>
                <div className="space-y-2 text-center p-6 rounded-lg bg-secondary/50 flex flex-col h-full">
                  <div className="text-3xl font-bold text-primary mb-1">3</div>
                  <h3 className="font-semibold text-lg">Improve Product</h3>
                  <p className="text-sm text-muted-foreground flex-1">
                    The system automatically suggests product changes, UI improvements, and intervention strategies based on behavioral insights. The product improves itself.
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