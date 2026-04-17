'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Home } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useAuth(); // Get the current user and logout function from the authentication context
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === '/'
            ? pathname === '/' || pathname === '/properties'
            : pathname === href || pathname.startsWith(`${href}/`);

    const baseNavLink = "text-sm font-medium px-3 py-2 rounded-xl transition-all";
    const inactiveNavLink = "text-slate-600 hover:text-teal-700 hover:bg-teal-50";
    const activeNavLink = "bg-teal-100 text-teal-800 shadow-sm ring-1 ring-teal-200";

    return (
        <nav className="sticky top-0 z-50 border-b border-teal-900/10 bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-[72px] py-1.5">
                    <Link href="/" className="text-xl font-semibold text-teal-800 flex items-center gap-3 group">
                        <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/20 ring-1 ring-white/70 transition-transform duration-300 group-hover:scale-105">
                            <Home className="w-5 h-5" />
                        </span>
                        <span className="flex flex-col items-start text-left leading-none">
                            <span className="tracking-tight">Veranda</span>
                            <span className="hidden sm:block mt-1 text-[11px] font-medium tracking-[0.22em] uppercase text-slate-500 leading-none">
                                Space between the world and your home.
                            </span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-1 sm:gap-3">
                        <Link
                            href="/properties"
                            className={`${baseNavLink} ${isActive('/properties') ? activeNavLink : inactiveNavLink}`}
                            >
                                Browse
                            </Link>

                        {user ? (
                            <>
                            <Link
                            href="/profile"
                            className={`${baseNavLink} ${isActive('/profile') ? activeNavLink : inactiveNavLink}`}
                            >
                                Profile
                            </Link>

                            <Link
                            href="/dashboard"
                            className={`${baseNavLink} ${isActive('/dashboard') ? activeNavLink : inactiveNavLink}`}
                            >
                                Dashboard
                            </Link>
                            
                            <Link
                            href="/bookings"
                            className={`${baseNavLink} ${isActive('/bookings') ? activeNavLink : inactiveNavLink}`}
                            >
                                Bookings
                            </Link>
                            {user.role === 'OWNER' && (
                                <Link
                                href="/properties/create"
                                className={`${baseNavLink} ${isActive('/properties/create') ? activeNavLink : "text-teal-700 bg-teal-50 hover:bg-teal-100 ring-1 ring-teal-100 hover:text-teal-800"}`}
                                >
                                    List Property
                                </Link>)}

                            <button
                                onClick={logout}
                                className="text-sm font-medium text-slate-500 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition-all ml-2"
                                >
                                    Logout
                                </button>
                                </>
                        ) : (
                            <div className="flex items-center gap-2 pr-1">
                            <Link
                            href="/login"
                            className={`${baseNavLink} px-4 ${isActive('/login') ? activeNavLink : inactiveNavLink}`}
                            >
                                Login
                            </Link>
                            <Link
                            href="/register"
                            className={`${baseNavLink} px-4 mx-1 font-semibold ${isActive('/register') ? "bg-teal-700 text-white shadow-lg shadow-teal-700/20" : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/15"}`}
                            >
                                Sign Up
                            </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
