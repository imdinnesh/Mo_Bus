import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, MapIcon, BusIcon, CreditCardIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-800">
      {/* Hero Section with silver gradient background */}
      <header className="w-full py-12 px-4 sm:px-6 md:px-8 text-center bg-gradient-to-r from-gray-100 to-gray-200">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-800">
          Welcome to <span className="text-black">Mo-Bus</span>
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          Your ultimate ticket booking solution for hassle-free travel
        </p>
        <div className="mt-10">
          <Button size="lg" className="bg-gray-800 hover:bg-black text-white font-semibold px-8 py-6 rounded-lg text-lg shadow-md transition-all">
            Book Now
          </Button>
        </div>
      </header>

      {/* Features Section */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-12 sm:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Why Choose Mo-Bus?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="flex flex-col items-center p-6">
                <BusIcon size={48} className="text-gray-700 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Modern Fleet</h3>
                <p className="text-gray-600 text-center">Comfortable buses with premium amenities</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="flex flex-col items-center p-6">
                <MapIcon size={48} className="text-gray-700 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Extensive Routes</h3>
                <p className="text-gray-600 text-center">Connecting all major cities and towns</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="flex flex-col items-center p-6">
                <CreditCardIcon size={48} className="text-gray-700 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Easy Payment</h3>
                <p className="text-gray-600 text-center">Multiple secure payment options</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="flex flex-col items-center p-6">
                <CalendarIcon size={48} className="text-gray-700 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">24/7 Booking</h3>
                <p className="text-gray-600 text-center">Book anytime, anywhere with our app</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-8 shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Ready to Travel?</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Experience the easiest way to book your tickets with Mo-Bus. Fast, reliable, and convenient travel solutions tailored to your needs.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-gray-800 hover:bg-black text-white">
            <Link href={"/signin"}>
                Signin
              </Link>
            </Button>
            <Button variant="outline" className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white">
              <Link href={"/dashboard"}>
                Routes
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 bg-gray-100 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600">
            &copy; 2025 Mo-Bus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}