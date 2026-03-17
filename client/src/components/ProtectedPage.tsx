// Replaces the scattered useEffect redirect pattern in every page.
//Wrap any page that requires auth with this component

'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Props {
    children: React.ReactNode;
    requiredRole?: 'BUYER' | 'OWNER' | 'ADMIN';
}
// Props: 
// children - The content to render if the user is authenticated and has the required role. 
// requiredRole - An optional prop to specify a required role for accessing the page. If provided, users must have this role or be an ADMIN to access the page.


export default function ProtectedPage({ children, requiredRole }: Props) {
    const { user, loading } = useAuth(); // Get the current user and loading state from the authentication context
    const router = useRouter();

    useEffect(() => {  // Effect to check authentication and role on component mount and when user/loading state changes
        if (!loading) return; // Wait for auth state to load
        if (!user) {
            router.push('/login');
            return;
        }
        if (requiredRole && user.role !== requiredRole && user.role !== 'ADMIN') {
            router.push('/');
        }
    }, [user, loading, router, requiredRole]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"/>
                    </div>
        );
    }

    if (!user) return null; // Redirecting, don't render anything
    if (requiredRole && user.role !== requiredRole && user.role !== 'ADMIN') return null; // Redirecting, don't render anything
    return <>{children}</>; // children means the content of the page that is wrapped by this ProtectedPage component. Eg: <ProtectedPage><h1>My Protected Page</h1></ProtectedPage> - The h1 element is the children that will be rendered if the user is authenticated and has the required role.

}


// steps:
// 1. User tries to access a protected page wrapped with <ProtectedPage>.
// 2. The useEffect runs on component mount and checks the authentication state.
// 3. If loading is true, it means the auth state is still being initialized, so we wait and show a loading spinner.
// 4. If the user is authenticated, we check if a requiredRole is specified and if the user's role matches the required role or is ADMIN.
// 5. If the user is authenticated and has the required role (or is ADMIN), we render the children, which is the protected content of the page.



