import axios, { AxiosError } from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api',
});
// api is an instance of axios that has a base URL set to NEXT_PUBLIC_API_URL 


api.interceptors.response.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;

});
// what: Adds Authorization header to outgoing requests
// input: config object of the request
// output: modified config object with Authorization header if token exists in localStorage


api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    },
);
// what: Handles 401 Unauthorized responses by clearing localStorage and redirecting to login page
// input: error object from the response
// output: redirects to login page if status is 401, otherwise rejects the error


export default api;

