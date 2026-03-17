import api from '@/lib/axios';
import { User } from '@/types';

export const authService = {
    register: async (data: {
        name: string;
        email: string;
        password: string;
        role: string;
    }) => {
        const response = await api.post<{ user: User; token: string }>(
            '/auth/register',  // Endpoint for user registration
            data,              // Data containing name, email, password, and role for the new user
        );
        return response.data;
    },
    // inputs - An object containing name, email, password, and role for registration
    // output - An object containing the registered user and a token for authentication
    // register: (data: { name: string; email: string; password: string; role: string }) => { Promise <{ user: User; token: string }> ( endpoint, data ); return response.data }


    login: async (data: { email: string; password: string }) => {
        const response = await api.post<{ user: User; token: string }>(
            '/auth/login',
            data,
        );
        return response.data;
    },
    // inputs - An object containing email and password for login
    // output - An object containing the authenticated user and a token for authentication
    // login: (data: { email: string; password: string }) => { Promise <{ user: User; token: string }> ( endpoint, data ); return response.data }

    getMe: async () => {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },
    // inputs - None
    // output - The currently authenticated user's data
    // getMe: () => { Promise <User> ( endpoint ); return response.data }
};


// authService is not a function, but an object that contains three async functions: register, login, and getMe. Each function makes an API call to the corresponding endpoint and returns the response data. The functions are used for user registration, login, and fetching the current user's data, respectively.

// Overall picture where authService is used:
// 1. In AuthContext.tsx, the setAuthData function is called with the user and token returned from authService.register or authService.login to store the authentication data in localStorage and update the user state.
// 2. The getMe function can be used to fetch the current user's data, for example, when the app initializes to check if the user is already authenticated based on the token stored in localStorage.

// Execution flow example:
// 1. A user fills out a registration form and submits it.
// 2. The form submission handler calls authService.register with the form data.
// 3. The register function sends a POST request to the /auth/register endpoint with the user's data
// 4. If the registration is successful, the server responds with the registered user's data and a token.
// 5. The response data is returned from the register function and can be used to set the authentication data in the AuthContext, allowing the user to be logged in immediately after registration.

