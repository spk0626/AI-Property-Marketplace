'use client';
import { useState } from 'react';
import Link from 'next/link';
import AiSearchBar from '@/components/AiSearchBar';
import PropertyCard from '@/components/PropertyCard';
import { AiSearchResult } from '@/types';

export default function HomePage() {
  const [aiResults, setAiResults] = useState<AiSearchResult | null>(null);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Find Your Dream Property
          </h1>
          <p className="text-indigo-200 mb-8 text-lg">
            Search in plain English - our AI understands what you are looking for!
          </p>
            <div className="flex justify-center">
          <AiSearchBar onResults={setAiResults} />
        </div>
        </div>
      </section>

      {/* AI Search Results */}
      {aiResults && (
        <section className="max-w-7xl mx-auto py-10 px-4">
          <div className="flebg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
            <p className="text-indigo-800 text-sm leading-relaxed">
              ✨ {aiResults.summary}
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
                  <Link href="/properties" className="text-indigo-600 underline">
                      Browse all listings
                  </Link>
                  </p>
                </div>
              )}
          </section>
        )}

    {/* Browse CTA */}
    {!aiResults && (
    <section className="max-w-7xl mx-auto py-16 px-4 text-center">
      <p className="text-gray-500 mb-6">
        Or browse all available properties
      </p>
      <Link
        href="/properties"
        className="bg-white border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
        >
        Browse All Properties
      </Link>
    </section>
    )}
  </div>
  );
}