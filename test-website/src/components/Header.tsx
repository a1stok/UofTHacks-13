import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Hackathon Hub
            </h1>
          </div>
          <nav className="flex space-x-4">
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">Events</Button>
            <Button variant="ghost">About</Button>
            <Button variant="ghost">Contact</Button>
          </nav>
        </div>
      </div>
    </header>
  )
}