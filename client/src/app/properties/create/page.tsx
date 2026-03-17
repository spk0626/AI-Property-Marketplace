'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { propertyService } from '@/services/propertyService';
import { ApiError } from '@/types';
import ProtectedPage from '@/components/ProtectedPage';

function CreatePropertyForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', description: '', price: '',
    location: '', bedrooms: '', bathrooms: '',
    parking: false, area: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const property = await propertyService.create({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        location: form.location,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        parking: form.parking,
        area: form.area ? Number(form.area) : undefined,
      });

      if (imageFile) {
        await propertyService.uploadImage(property.id, imageFile);
      }

      router.push(`/properties/${property.id}`);
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError.response?.data?.message ?? 'Failed to create listing',
      );
    } finally {
      setLoading(false);
    }
  };

    return (
         <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">List Your Property</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
        <input
          placeholder="Property title (min 5 characters)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <textarea
          placeholder="Description (min 10 characters)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded-lg px-4 py-3 text-sm h-28 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Price (LKR)"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            placeholder="Bedrooms"
            type="number"
            min="0"
            value={form.bedrooms}
            onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
            className="border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            placeholder="Bathrooms"
            type="number"
            min="0"
            value={form.bathrooms}
            onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
            className="border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            placeholder="Area (sq ft) — optional"
            type="number"
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
            className="border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={form.parking}
            onChange={(e) => setForm({ ...form, parking: e.target.checked })}
            className="rounded"
          />
          Parking available
        </label>
        <div>
          <label className="text-sm text-gray-600 block mb-1">
            Property image (JPEG, PNG, WebP — max 5 MB)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="text-sm text-gray-600"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Creating listing...' : 'Create Listing'}
        </button>
      </div>
    </div>
  );
}

export default function CreatePropertyPage() {
  return (
    <ProtectedPage requiredRole="OWNER">
      <CreatePropertyForm />
    </ProtectedPage>
  );
}


// What this page show:
// a form for property owners to create a new property listing. It includes fields for title, description, price, location, bedrooms, bathrooms, parking availability, area, and an image upload. The form validates input and displays error messages if the creation fails. Upon successful creation, it redirects the user to the newly created property's detail page.

// Key components and logic:
// - State management: useState is used to manage form data, loading state, and error messages.
// - Form handling: The handleSubmit function validates the form, sends a request to create the property, uploads the image if provided, and handles success and error cases.
// - ProtectedPage: The entire page is wrapped in a ProtectedPage component that checks if the user has the "OWNER" role before allowing access to the form.



