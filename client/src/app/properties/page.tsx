'use client';
import { useState, useEffect, useCallback } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { propertyService } from '@/services/propertyService';
import { Property } from '@/types';

interface Filters {
  location: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        try {
            const params = Object.fromEntries(
                Object.entries(filters).filter(([, v]) => v !== ''),
            );
            
            const data = await propertyService.getAll(params);
            setProperties(data.properties);
            setTotal(data.total);
            } finally {
            setLoading(false);
            }
        } , [filters]);
        
        useEffect(() => {
            fetchProperties();
        }, []); // Fetch on mount only — user clicks Apply to filter

        const handleFilter = (e: React.FormEvent) => {
            e.preventDefault();
            fetchProperties();
        };
        
        const handleReset = () => {
            setFilters({ location: '', minPrice: '', maxPrice: '', bedrooms: '' });
        };
        
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Property Listings
          {!loading && (
            <span className="text-base font-normal text-gray-500 ml-2">
              ({total} found)
            </span>
          )}
        </h1>
      </div>

       {/* Filters */}
      <form
        onSubmit={handleFilter}
        className="bg-white p-4 rounded-xl shadow-sm border mb-6"
      >

         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <input
            placeholder="Location"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

           <input
            placeholder="Min Price (LKR)"
            type="number"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            placeholder="Max Price (LKR)"
            type="number"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            placeholder="Bedrooms"
            type="number"
            value={filters.bedrooms}
            onChange={(e) =>
              setFilters({ ...filters, bedrooms: e.target.value })
            }
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2 mt-3">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>


{loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No properties found. Try adjusting your filters.
        </div>
      ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}


// What this page does:
// 1. Displays a list of properties with filters for location, price range, and bedrooms.
// 2. Fetches properties from the backend based on applied filters and shows loading state.
// 3. Uses the PropertyCard component to display each property in a grid layout.
// 4. Allows users to reset filters and shows total count of properties found.

//What this is: Main page for browsing properties. It includes a filter form and displays property cards based on the applied filters. It also handles loading state and shows the total number of properties found.