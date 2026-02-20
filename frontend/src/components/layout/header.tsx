'use client';


export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between animate-in fade-in slide-in-from-top duration-700">
          {/* Title Section */}
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900 transition-all duration-300 hover:text-primary">
              Walla Walla Recovery Resources
            </h1>
            <p className="text-gray-500 text-xs md:text-sm hidden sm:block mt-0.5 animate-in fade-in duration-1000 delay-150 font-medium">
              Find support and services for your recovery journey
            </p>
          </div>

        </div>
      </div>
    </header>
  );
}