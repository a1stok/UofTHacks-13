import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { ColoredBox } from "@/components/ColoredBox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      
      {/* Main Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Components
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          {/* Colored Boxes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <ColoredBox color="red">
              <h3 className="text-xl font-semibold mb-3">Innovation Track</h3>
              <p className="text-red-100">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
                dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
              </p>
            </ColoredBox>

            <ColoredBox color="blue">
              <h3 className="text-xl font-semibold mb-3">Technology Track</h3>
              <p className="text-blue-100">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.
              </p>
            </ColoredBox>

            <ColoredBox color="red">
              <h3 className="text-xl font-semibold mb-3">Design Track</h3>
              <p className="text-red-100">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis 
                praesentium voluptatum deleniti atque corrupti quos dolores.
              </p>
            </ColoredBox>

            <ColoredBox color="blue">
              <h3 className="text-xl font-semibold mb-3">Business Track</h3>
              <p className="text-blue-100">
                Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, 
                cum soluta nobis est eligendi optio cumque nihil impedit.
              </p>
            </ColoredBox>

            <ColoredBox color="red">
              <h3 className="text-xl font-semibold mb-3">AI/ML Track</h3>
              <p className="text-red-100">
                Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus 
                saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
              </p>
            </ColoredBox>

            <ColoredBox color="blue">
              <h3 className="text-xl font-semibold mb-3">Sustainability Track</h3>
              <p className="text-blue-100">
                Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis 
                voluptatibus maiores alias consequatur aut perferendis doloribus asperiores.
              </p>
            </ColoredBox>
          </div>

          {/* Additional Content Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Event Details</CardTitle>
                <CardDescription>
                  Everything you need to know about the hackathon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse 
                  cillum dolore eu fugiat nulla pariatur.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Prizes & Awards</CardTitle>
                <CardDescription>
                  Amazing prizes await the winners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                  deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste 
                  natus error sit voluptatem accusantium doloremque laudantium, totam rem 
                  aperiam, eaque ipsa quae ab illo inventore veritatis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Join?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Don't miss out on this incredible opportunity to showcase your skills, 
              learn from experts, and compete for amazing prizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                Register Now
              </button>
              <button className="border border-gray-300 text-gray-300 hover:bg-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
