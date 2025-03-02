export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <header className="w-full text-center">
        <h1 className="text-5xl font-bold">Welcome to Mo-Bus</h1>
        <p className="text-xl mt-4">Your ultimate ticket booking solution</p>
      </header>
      <main className="w-full flex flex-col items-center">
        <p className="text-lg mt-8 text-center">
          Experience the easiest way to book your tickets with Mo-Bus. Fast, reliable, and convenient.
        </p>
      </main>
      <footer className="w-full text-center text-gray-200 text-sm">
        &copy; 2025 Mo-Bus. All rights reserved.
      </footer>
    </div>
  );
}