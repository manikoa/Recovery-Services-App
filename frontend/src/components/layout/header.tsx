'use client';


export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-blue-600/95 backdrop-blur-md border-b border-blue-500/20 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between animate-in fade-in slide-in-from-top duration-700">
          {/* Title Section */}
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-white transition-all duration-300 hover:text-blue-50">
              Walla Walla Recovery Resources
            </h1>
            <p className="text-blue-100/80 text-xs md:text-sm hidden sm:block mt-0.5 animate-in fade-in duration-1000 delay-150">
              Find support and services for your recovery journey
            </p>
          </div>

        </div>
      </div>
    </header>
  );
}