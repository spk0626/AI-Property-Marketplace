'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/types';
import Link from 'next/link';
import { Home } from 'lucide-react';

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
      <div className="flex-1 flex bg-gray-50">
        {/* Left side: Image/Branding */}
        <div className="hidden lg:flex w-1/2 relative bg-teal-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-800/90 to-slate-900/90 mix-blend-multiply z-10" />
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop" 
            alt="Luxury Architecture" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 flex flex-col justify-between p-16 text-white h-full">
            <div>
              <Link href="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Home className="w-6 h-6" />
                </span>
                Veranda
              </Link>
            </div>
            <div>
              <h1 className="text-5xl font-semibold leading-tight mb-6">
                Discover your perfect space.
              </h1>
              <p className="text-lg text-teal-100 max-w-md border-l-4 border-teal-500 pl-4">
                Join thousands of buyers and sellers in the most intelligent property marketplace.
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create an account</h2>
              <p className="text-gray-500 mt-1.5">Start your journey with us today.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm py-3 px-4 rounded-xl border border-red-100 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-4 bg-white/50 p-1 rounded-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Full Name</label>
                <input
                  placeholder='e.g. John Doe'
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder='john@example.com'
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Password</label>
                <input
                  type="password"
                  placeholder='••••••••'
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">How will you use this app?</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-gray-700"
                >
                  <option value="BUYER">I&apos;m looking to buy / rent</option>
                  <option value="OWNER">I want to list a property</option>
                </select>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-2 bg-teal-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-teal-700 focus:ring-4 focus:ring-teal-500/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : 'Create Account'}
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              Already have an account?{' '}
              <Link href="/login" className="text-teal-600 font-semibold hover:text-teal-700 hover:underline underline-offset-2 transition-all">
                Sign in instead
              </Link>
            </p>
          </div>
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
