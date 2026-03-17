'use client';
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth(); // Get the current user and logout function from the authentication context

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-xl font-bold text-indigo-600">
                        AI Property Marketplace
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/properties"
                            className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Browse
                            </Link>

                        {user ? (
                            <>
                            <Link
                            href="/dashboard"
                            className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Dashboard
                            </Link>
                            
                            <Link
                            href="/bookings"
                            className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Bookings
                            </Link>
                            {user.role === 'OWNER' && (
                                <Link
                                href="/properties/create"
                                className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    List Property
                                </Link>)}

                            <button
                                onClick={logout}
                                className="text-sm text-gray-100 hover:text-gray-200 px-3 py-1.5 rounded-md transition-colors"
                                >
                                    Logout
                                </button>
                                </>
                        ) : (
                            <>
                            <Link
                            href="/login"
                            className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Login
                            </Link>
                            <Link
                            href="/register"
                            className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Sign Up
                            </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
