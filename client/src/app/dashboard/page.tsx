'use client';
import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { useAuth } from '@/context/AuthContext';
import { propertyService } from '@/services/propertyService';
import { Property } from '@/types';
import PropertyCard from '@/components/PropertyCard';
import PropertiesPage from '../properties/page';
import Link from 'next/link';
import ProtectedPage from '@/components/ProtectedPage';


function DashboardContent() {
    const { user } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        if (user?.role === 'OWNER') return;
        setLoading(true);
        propertyService
        .getMyProperties()
        .then(setProperties)
        .finally(() => setLoading(false));
    }, [user]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this property?')) return;
        setDeleteError('');
        try {
            await propertyService.delete(id);
            setProperties((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            setDeleteError( axiosError.response?.data?.message ?? 'Failed to delete property' );
        }
    };

    return(
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">My Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">
                    {user?.name} · {user?.role}
                    </p>
                </div>
                {user?.role === 'OWNER' && (
                    <Link 
                        href="/properties/create"
                         className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + New Listing
          </Link>
        )}
      </div>

        {deleteError && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {deleteError}
        </div>
        )}

        {user?.role === 'OWNER' && (
            <div>
          <h2 className="font-semibold text-gray-700 mb-4">
            Your Listings ({properties.length})
          </h2>
            {loading ? (
                 <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : properties.length === 0 ? (
             <div className="text-center py-16 text-gray-400">
              <p className="mb-4">No listings yet.</p>
              <Link
                href="/properties/create"
                className="text-indigo-600 underline"
              >
                Create your first listing
                </Link >
            </div>
            ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                    <div key={property.id} className="relative">
                        <PropertyCard property={property} />
                        <button
                            onClick={() => handleDelete(property.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>   
                    </div>
                ))}
            </div>
            )}
        </div>
        )}

        {user?.role === 'BUYER' && (
            <div className="text-center py-16">
             <p className="text-gray-500 mb-6 text-lg">
            Ready to find your perfect home?
          </p>
          <Link
            href="/properties"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Browse Properties
          </Link>
        </div>
      )}
    </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedPage>
            <DashboardContent />
        </ProtectedPage>
    );
}

// what this show:
// - A dashboard page that shows different content based on whether the user is an OWNER or BUYER.
// - For OWNERS: It fetches and displays their listed properties with an option to delete each listing. If there are no listings, it prompts them to create one.
// - For BUYERS: It shows a call-to-action to browse available properties.
// - The page also handles loading states and errors when deleting properties.

// How it works:
// 1. It uses the useAuth hook to get the current user and their role.
// 2. It fetches the user's properties if they are an OWNER and displays them in a grid.
// 3. Each property card for OWNERS has a delete button that allows them to remove the listing, with error handling for failed deletions.
// 4. If the user is a BUYER, it simply shows a message and a button to browse properties.

// A protected dashboard page: shows personalized content based on user role. It allows property owners to manage their listings and buyers to easily navigate to browse properties.

/* STYLES EXPLANATION: */
// - bg-indigo-600: Sets the background color to a specific shade of indigo.
// - text-white: Sets the text color to white.
// - px-6: Applies horizontal padding of 1.5rem (24px) on both left and right sides.
// - py-3: Applies vertical padding of 0.75rem (12px) on both top and bottom.
// - rounded-lg: Applies a large border-radius to make the corners of the element rounded.
// - text-sm: Sets the font size to small.
// - font-medium: Sets the font weight to medium, making the text slightly bolder than normal.
// - hover:bg-indigo-700: Changes the background color to a darker shade of indigo when the user hovers over the element.
// - transition-colors: Adds a smooth transition effect when the background color changes on hover, making the color change appear more fluid and visually appealing.

// - mb-6: Applies a margin-bottom of 1.5rem (24px) to create space below the element.
// - text-lg: Sets the font size to large, making the text bigger than the default size.

// - absolute: Positions the element absolutely within its nearest positioned ancestor.
// - top-2: Positions the element 0.5rem (8px) from the top of its containing block.
// - right-2: Positions the element 0.5rem (8px) from the right of its containing block.
// - text-xs: Sets the font size to extra small, making the text smaller than the default size.
// - px-2: Applies horizontal padding of 0.5rem (8px) on both left and right sides.
// - py-1: Applies vertical padding of 0.25rem (4px) on both top and bottom.
// - rounded-md: Applies a medium border-radius to make the corners of the element rounded.

// - grid: Defines a CSS grid container, enabling the use of grid layout for its children.
// - grid-cols-1: Sets the grid to have 1 column by default (on small screens).
// - sm:grid-cols-2: Changes the grid to have 2 columns on small screens and above (min-width: 640px).
// - lg:grid-cols-3: Changes the grid to have 3 columns on large screens and above (min-width: 1024px).
// - gap-6: Sets a gap of 1.5rem (24px) between grid items, both horizontally and vertically.
// - relative: Sets the position of the element to relative, which allows absolutely positioned child elements to be positioned relative to this container. In this case, it enables the delete button to be positioned in the top-right corner of each property card.

// - w-6: Sets the width of the element to 1.5rem (24px).
// - h-6: Sets the height of the element to 1.5rem (24px).
// - border-2: Applies a border with a width of 2 pixels around the element.
// - border-t-transparent: Makes the top border transparent, which creates a visual effect when combined with the animate-spin class to indicate loading.
// - rounded-full: Applies a border-radius of 9999px, making the element perfectly circular.
// - animate-spin: Applies a CSS animation that rotates the element continuously, creating a spinning effect to indicate loading.
// - max-w-7xl: Sets the maximum width of the container to 80rem (1280px), centering the content and preventing it from stretching too wide on large screens.
// - mx-auto: Applies automatic horizontal margins to center the container within its parent.
// - flex: Defines a flex container, enabling the use of flexbox layout for its children.
// - justify-between: Distributes space between items in the flex container, placing the first item at the start and the last item at the end of the container.
// - items-center: Aligns items vertically to the center of the flex container.