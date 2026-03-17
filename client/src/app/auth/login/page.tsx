'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/types';

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
         <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Welcome back</h2>
        {error && (
             <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <div className="space-y-4">
            <input
                type="email"
                placeholder='Email'
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
            <button
                onClick={handleSubmit}
                disabled={loading}
                 className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </div>
        
         <p className="text-sm text-gray-500 text-center mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-indigo-600 font-medium">
            Sign up
          </Link>
        </p>
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
