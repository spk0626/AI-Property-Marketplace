'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { propertyService } from '@/services/propertyService';
import { bookingService } from '@/services/bookingService';
import { Property, ApiError } from '@/types';
import { useAuth } from '@/context/AuthContext';


export default function PropertyDetailsPage() {
    const { id } = useParams<{ id: string }>(); // Get the property ID from the URL parameters using Next.js useParams hook
    const router = useRouter();
    const { user } = useAuth(); // Get the current authenticated user from the authentication context

    const [property, setProperty] = useState<Property | null>(null); // State to hold the property details, initially null
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0); // State to track the currently displayed image index, initially 0
    const [visitDate, setVisitDate] = useState('');
    const [message, setMessage] = useState('');
    const [booking, setBooking] = useState(false);
    const [booked, setBooked] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
    propertyService
      .getById(id)
      .then(setProperty)
      .catch(() => router.push('/properties'))  // If there's an error fetching the property (e.g., not found), redirect back to the properties listing page
      .finally(() => setLoading(false));
  }, [id, router]);   // gives the property ID from the URL and the router object for navigation. 
  // The effect runs when the component mounts and whenever the id or router changes (though in this case, id is unlikely to change without remounting the component). It fetches the property details by ID, updates the state, and handles errors by redirecting if the property cannot be fetched. Finally, it sets loading to false once the fetch is complete.

    const handleBook = async () => {
    if (!user) return router.push('/login');
    if (!visitDate) return setError('Please select a visit date');

    setBooking(true);
    setError('');
    // handles the booking process when the user clicks the "Book Visit" button. It first checks if the user is authenticated; if not, it redirects them to the login page. Then it checks if a visit date has been selected; if not, it sets an error message prompting the user to select a date. If both checks pass, it sets the booking state to true (indicating that a booking process is in progress) and clears any existing error messages.

    try {
      await bookingService.create({ propertyId: id, visitDate, message });
      setBooked(true);
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError.response?.data?.message ?? 'Booking failed. Please try again.',
      );
    } finally {
      setBooking(false);
    }
  };

    if (loading) {
        return (
             <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

    if (!property) return null; // If property is not found, don't render anything (or you could show a "Not Found" message)

    return (
         <div className="max-w-5xl mx-auto px-4 py-8">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">    {/* For responsive UI: 1 column on mobile, 2 on tablet, 3 on desktop */}
        {/* Images */}
        <div>
          <div className="h-72 bg-gray-100 rounded-2xl overflow-hidden">
            {property.images.length > 0 ? (
              <img
                src={property.images[currentImage]?.url}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No images available
              </div>
            )}
          </div>
          {property.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {property.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentImage(i)}
                  className="flex-shrink-0"
                >
                     <img
                    src={img.url}
                    alt={`View ${i + 1}`}
                    className={`w-16 h-16 rounded-lg object-cover border-2 transition-colors ${
                      i === currentImage
                        ? 'border-indigo-500'
                        : 'border-transparent'
                    }`}
                  />
                </button>
                              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
          <p className="text-gray-500 mt-1">{property.location}</p>
          <p className="text-3xl font-bold text-indigo-600 mt-3">
            LKR {property.price.toLocaleString()}
          </p>

<div className="flex gap-6 mt-4 text-gray-600 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {property.bedrooms}
              </div>
              <div>Bedrooms</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {property.bathrooms}
              </div>
              <div>Bathrooms</div>
            </div>
            {property.area && (
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {property.area}
                </div>
                <div>sq ft</div>
              </div>
            )}
            {property.parking && (
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">🅿</div>
                <div>Parking</div>
              </div>
            )}
          </div>

            <p className="text-gray-600 mt-4 leading-relaxed text-sm">
            {property.description}
          </p>

          <p className="text-sm text-gray-500 mt-3">
            Listed by{' '}
            <span className="font-medium text-gray-700">
              {property.owner.name}
            </span>
          </p>

           {/* Booking form */}
          {!booked ? (
            <div className="mt-6 bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold mb-3">Request a Visit</h3>
              {error && (
                <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-lg">
                  {error}
                </p>
              )}
               <input
                type="datetime-local"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full border rounded-lg px-3 py-2 text-sm mb-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
               <textarea
                placeholder="Message to owner (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm mb-3 resize-none h-20 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
               <button
                onClick={handleBook}
                disabled={booking}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                  {booking ? 'Sending request...' : 'Request Visit'}
              </button>
            </div>
            ) : (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-green-700 font-medium">
                ✓ Visit request sent!
              </p>
              <p className="text-green-600 text-sm mt-1">
                The owner will review your request. Check your bookings for
                updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// This page shows:
// - Property details including images, title, location, price, features, description, and owner information.
// - A booking form for users to request a visit, which includes selecting a date and sending an optional message to the owner. It handles the booking process and shows success or error messages accordingly.

// html elements: 
// - A main container with a grid layout to display property images on the left and details on the right.
// - An image carousel that allows users to click on thumbnails to view different images of the property.
// - A booking form that includes a datetime picker for selecting a visit date, a textarea for an optional message, and a button to submit the booking request. The form also displays error messages if the booking fails and a success message when the request is sent successfully.
// - texts and labels to show property information and guide the user through the booking process.
// - buttons for Booking and image selection

// Responsive UI:
// - sm: 1 column layout for small phones or smaller tablets
// - md: 2 column layout for tablets
// - lg: 3 column layout for laptops
// - xl: 4 column layout for desktops and larger screens

