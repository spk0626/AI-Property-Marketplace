'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/types';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const { setAuthData } = useAuth();
    const [form, setForm] = useState({ 
        name: '', email: '', password: '' , role: 'BUYER'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const { user, token } = await authService.register(form);
            setAuthData(user, token);
            router.push('/'); // Redirect to home page after successful registration
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            setError( axiosError.response?.data?.message ?? 'Registration failed. Please try again.' );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create your account</h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
            <input
            placeholder='Full name'
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
            <input
              type="email"
              placeholder='Email address'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              placeholder='Password'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="BUYER">I&apos;m looking to buy / rent</option>
            <option value="OWNER">I want to list a property</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 font-medium">
           Login
            </Link>
        </p>
        </div>
    </div>
    );
}



// what this show: 
// 1. A registration form with fields for full name, email, password, and a dropdown to select user role (buyer or owner).
// 2. A submit button that triggers the registration process, showing a loading state while the request is in progress.
// 3. Error messages displayed in a red box if registration fails.
// 4. A link to the login page for users who already have an account.

// what handleSubmit does:
// 1. Sets the loading state to true and clears any previous error messages.
// 2. Calls the authService.register function with the form data to attempt user registration.
// 3. If registration is successful, it updates the authentication context with the new user data and token, and redirects to the home page.
// 4. If registration fails, it captures the error message and displays it to the user.
