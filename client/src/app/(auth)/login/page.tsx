'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/types';
import { Home } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { setAuthData } = useAuth(); // Get the setAuthData function from the authentication context to update the auth state after successful login
    const [form, setForm] = useState({ email: '', password: '' }); // State to hold the login form data, initialized with empty email and password
    const [loading, setLoading] = useState(false); // State to indicate if the login request is in progress
    const [error, setError] = useState(''); // State to hold any error message from the login process

    const handleSubmit = async () => {
        setLoading(true); // Set loading to true when the login process starts
        setError(''); // Clear any previous error messages
        try {
            const { user, token } = await authService.login(form);
            setAuthData(user, token); // Update the authentication context with the logged-in user's data and token
            router.push('/'); // Redirect to the home page after successful login
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            setError( axiosError.response?.data?.message ?? 'Login failed. Please try again.' ); 
        } finally {
            setLoading(false); // Set loading to false when the login process is complete, regardless of success or failure
        }
    };

    return (
      <div className="flex-1 flex bg-gray-50">
        {/* Left side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 order-2 lg:order-1">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center lg:text-left">
              <Link href="/" className="inline-flex lg:hidden items-center gap-2 font-bold text-teal-700 text-xl tracking-tight mb-8">
                <span className="w-8 h-8 rounded-lg bg-teal-600/10 text-teal-600 flex items-center justify-center">
                    <Home className="w-5 h-5" />
                </span>
                Veranda
              </Link>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
              <p className="text-gray-500 mt-1.5">Please enter your details to sign in.</p>
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
                      Logging in...
                    </>
                  ) : 'Sign In'}
              </button>
            </div>
            
            <p className="text-sm text-gray-500 text-center">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-teal-600 font-semibold hover:text-teal-700 hover:underline underline-offset-2 transition-all">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Right side: Image/Branding */}
        <div className="hidden lg:flex w-1/2 relative bg-teal-900 border-l border-teal-800 overflow-hidden order-1 lg:order-2">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-teal-900/80 mix-blend-multiply z-10" />
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop" 
            alt="Modern Interior" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 flex flex-col justify-between p-16 text-white h-full w-full">
            <div className="flex justify-end">
              <Link href="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Veranda
                <span className="w-10 h-10 rounded-xl bg-teal-500/80 backdrop-blur-sm flex items-center justify-center">
                    <Home className="w-6 h-6" />
                </span>
              </Link>
            </div>
            <div className="text-right">
              <h1 className="text-5xl font-semibold leading-tight mb-6">
                Welcome back<br />to home.
              </h1>
              <p className="text-lg text-teal-100 max-w-sm ml-auto border-r-4 border-teal-500 pr-4">
                Access your personalized property recommendations and manage your listings.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}


// what this show:
// 1. A login form with email and password fields, a submit button, and a link to the registration page.
// 2. Error messages displayed in a red box if the login fails.
// 3. A loading state that disables the form and changes the button text while the login request is in progress.

// how it works:
// 1. The user enters their email and password and clicks the login button.
// 2. The handleSubmit function is called, which sets the loading state to true and clears any previous error messages.
// 3. The authService.login function is called with the form data. If the login is successful, the user data and token are stored in the authentication context using setAuthData, and the user is redirected to the home page.
// 4. If the login fails, the error message from the server is displayed in a red box above the form. If there is no specific error message, a generic "Login failed" message is shown.
// 5. The loading state is set back to false after the login attempt is complete, allowing the user to try again if needed.

// what handleSubmit does:
// 1. Sets the loading state to true and clears any previous error messages.
// 2. Calls the authService.login function with the form data to attempt user login.
// 3. If login is successful, it updates the authentication context with the logged-in user's data and token, and redirects to the home page.
// 4. If login fails, it captures the error message from the server response and sets it in the error state to be displayed to the user.
// 5. Finally, it sets the loading state back to false regardless of success or failure, allowing the user to interact with the form again.

// why loading state is important:
// 1. It provides feedback to the user that their login request is being processed, improving the user experience.
// 2. It prevents multiple login attempts while the first request is still in progress, which can help avoid duplicate requests and potential issues with rate limiting or server overload.
