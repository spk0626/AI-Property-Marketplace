'use client';
import { useState } from 'react';
import Link from 'next/link';
import AiSearchBar from '@/components/AiSearchBar';
import PropertyCard from '@/components/PropertyCard';
import { AiSearchResult } from '@/types';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  const [aiResults, setAiResults] = useState<AiSearchResult | null>(null);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center px-4 py-16 lg:py-20 overflow-hidden min-h-[calc(100vh-4rem)]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero Architecture" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/90 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center mt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span className="text-sm font-medium text-teal-50">AI-Powered Real Estate</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-lg">
            Find your dream home, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-200">
               smarter and faster.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed shadow-sm">
            Just describe what you're looking for in plain English. Our AI will instantly find the perfect match from thousands of premium listings.
          </p>
          
          <div className="flex justify-center w-full max-w-3xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
            <div className="w-full bg-white/10 backdrop-blur-xl p-2 sm:p-3 rounded-2xl border border-white/20 shadow-2xl">
              <AiSearchBar onResults={setAiResults} />
            </div>
          </div>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-teal-500/20 blur-[120px]" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 blur-[120px]" />
        </div>
      </section>

      {/* AI Search Results */}
      {aiResults && (
        <section className="max-w-7xl mx-auto py-10 px-4">
          <div className="flebg-teal-50 border border-teal-100 rounded-xl p-4 mb-6">
            <p className="text-teal-800 text-sm leading-relaxed flex gap-2 items-start">
              <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{aiResults.summary}</span>
          </p>
          </div>
          
          {aiResults.properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiResults.properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
                ))}
            </div>
          ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>
                    No properties found for that search.
                  <Link href="/properties" className="text-teal-600 underline">
                      Browse all listings
                  </Link>
                  </p>
                </div>
              )}
          </section>
        )}

    {/* Browse CTA */}
    {!aiResults && (
    <section className="max-w-7xl mx-auto py-10 px-4 text-center">
      <p className="text-gray-500 mb-6">
        Or browse all available properties
      </p>
      <Link
        href="/properties"
        className="bg-white border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors"
        >
        Browse All Properties
      </Link>
    </section>
    )}
  </div>
  );
}
