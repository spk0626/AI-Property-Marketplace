'use client';   // This file is a client component

// This in Next.js replaces the useAuth hook in React. Single source of truth for auth state.

import {
    createContext, 
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';
import { User } from '../types';

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    setAuthData: (user: User, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);    // Create a context for authentication state and actions, initially null

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);   // State to hold the current authenticated user, initially null
    const [loading, setLoading] = useState(true);          // State to indicate if auth state is being initialized, initially true

    useEffect(() => {
        try {
            const stored = localStorage.getItem('user');   
            if (stored) setUser(JSON.parse(stored) as User);
        } catch {
            // Corrupted storage, clear it
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    }, []);
    //on component mount, try to load user from localStorage, handle errors, and set loading to false when done.
    // useEffect means: Run this code after the component mounts (initial render) only.
    // useEffect structure: useEffect(() => { /* code to run */ }, [/* dependencies */]);
    // In this case, the dependency array is empty, so it runs only once after the initial render.
    // the component here is the AuthProvider, which will wrap the entire app to provide auth state and actions to all components.


    const setAuthData = useCallback((userData: User, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    }, []);
    // A function to set authentication data (user and token) in localStorage and update the user state. Wrapped in useCallback to prevent unnecessary re-creations.
    // useCallback means: Return a memoized version of the callback that only changes if one of the dependencies has changed. In this case, there are no dependencies, so the function will be created once and never change.
    // callBack function struncture: const memoizedCallback = useCallback(() => { /* function code */ }, [/* dependencies */]);


    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/'; // Redirect to home page after logout
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setAuthData, logout }}>
            {children}
        </AuthContext.Provider>
    );
    //a callback function to log out the user, clear localStorage, and redirect to home page. Wrapped in useCallback to prevent unnecessary re-creations.
    // return: Provides the AuthContext to child components, passing down the user, loading state, setAuthData function, and logout function as context value.
    // { children }: The child nodes that will have access to the authentication context. Eg: <AuthProvider><App /></AuthProvider> - App and all its children can access the auth context.
}

// Typed hook — throws if used outside AuthProvider
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context)  throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
// A custom hook to access the authentication context. It throws an error if used outside of the AuthProvider, ensuring that components can only access auth state when properly wrapped.


// types of functions in here are:
// 1. useState: A React hook that allows you to add state to functional components. It returns a state variable and a function to update that variable.
// 2. useEffect: A React hook that allows you to perform side effects in functional components. It runs after the component renders and can be used for things like data fetching, subscriptions, or manually changing the DOM.
// 3. useCallback: A React hook that returns a memoized version of a callback function. It is used to optimize performance by preventing unnecessary re-creations of functions on every render.
// 4. createContext: A React function that creates a Context object, which can be used to pass data through the component tree without having to pass props down manually at every level.
// 5. useContext: A React hook that allows you to consume a context value in a functional component. It takes a context object (the value returned from createContext) and returns the current context value for that context.
// 6. ReactNode: A type from the React library that represents any valid React child, such as elements, strings, numbers, fragments, portals, etc. It is often used to type the children prop in components that wrap other components.
// 7. AuthContextValue: A TypeScript interface that defines the shape of the authentication context value, including the user object, loading state, and functions for setting auth data and logging out.
// 8. AuthProvider: A React component that provides the authentication context to its children. It manages the user state, loading state, and defines functions for setting auth data and logging out.

// Execution flow with an example:
// 1. The AuthProvider component is rendered at the root of the app, wrapping all other components.
// 2. On initial render, the useEffect hook runs and attempts to load the user from localStorage. If a user is found, it sets the user state; if not, it clears any corrupted data and sets loading to false.
// 3. The setAuthData function can be called (e.g., after a successful login) to store the user and token in localStorage and update the user state.
// 4. The logout function can be called to clear the user and token from localStorage, reset the user state, and redirect to the home page.
// 5. Any component that needs access to the auth state can use the useAuth hook to get the current user, loading state, and auth functions. If they try to use it outside of the AuthProvider, an error will be thrown.
