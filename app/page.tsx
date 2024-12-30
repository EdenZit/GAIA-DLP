import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4">
            Welcome to GAIA Learning Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover, learn, and grow with our comprehensive online education platform
          </p>
          <div className="flex justify-center gap-4">
            <a href="/courses">
              <Button size="lg">
                Browse Courses
              </Button>
            </a>
            <a href="/auth/register">
              <Button size="lg" variant="outline">
                Get Started
              </Button>
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
              <p className="text-gray-600">Engage with dynamic course content and real-time interactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
              <p className="text-gray-600">Learn from industry professionals and experienced educators</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-600">Connect with peers and participate in meaningful discussions</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
