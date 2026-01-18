import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl">
            <Image
              src="/UofTHacks.png"
              alt="UofT Hacks Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              UofT Hacks
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              University of Toronto's Premier Hackathon Experience
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="shadow-lg">
              Register Now
            </Button>
            <Button variant="outline" size="lg" className="shadow-lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Innovation</CardTitle>
              <CardDescription>
                Build cutting-edge solutions with the latest technologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Join hundreds of students in creating innovative projects that solve real-world problems.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Collaboration</CardTitle>
              <CardDescription>
                Work with talented peers from diverse backgrounds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connect with like-minded individuals and form lasting partnerships in tech.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Learning</CardTitle>
              <CardDescription>
                Expand your skills through workshops and mentorship
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access expert guidance and learn new technologies in an immersive environment.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Event Details */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Event Details</CardTitle>
              <CardDescription className="text-lg">
                Everything you need to know about UofT Hacks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">When</h3>
                  <p className="text-muted-foreground">Coming Soon - Stay Tuned!</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Where</h3>
                  <p className="text-muted-foreground">University of Toronto Campus</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Duration</h3>
                  <p className="text-muted-foreground">48 Hours of Innovation</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Prizes</h3>
                  <p className="text-muted-foreground">Amazing Prizes & Recognition</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}