import api from '@/lib/axios';
import { Booking } from '@/types';

export const bookingService = {
    create: async (data: {
        propertyId: string;
        visitDate: string;
        message?: string;
    }) => {
        const response = await api.post<Booking>('/bookings', data);
        return response.data;
    },
    // inputs - An object containing propertyId, visitDate, and an optional message for the booking
    // output - The created booking object returned from the server

    getMyBookings: async () => {
        const response = await api.get<Booking[]>('/bookings/my');
        return response.data;
    },
    // inputs - None (relies on authentication to determine the current user)
    // output - An array of bookings made by the currently authenticated user

    getIncomingBookings: async () => {
        const response = await api.get<Booking[]>('/bookings/incoming');
        return response.data;
    },
    // inputs - None (relies on authentication to determine the current user)
    // output - An array of bookings received for the properties owned by the currently authenticated user

    updateStatus: async (id: string, status: string) => {
        const response = await api.put<Booking>(`/bookings/${id}/status`, { status });
        return response.data;
    },
    // inputs - The booking ID and the new status to be set (e.g., "accepted", "rejected")
    // output - The updated booking object returned from the server

    cancel: async (id: string) => {
    const res = await api.put<Booking>(`/bookings/${id}/cancel`);
    return res.data;
  },
    // inputs - The booking ID to be canceled
    // output - The response from the server after canceling the booking (could be a success message or the canceled booking object)
};

// bookingService is an object that contains functions for creating a booking, fetching the user's bookings, fetching incoming bookings for the user's properties, updating the status of a booking, and canceling a booking. Each function makes an API call to the corresponding endpoint and returns the response data. The functions are used to manage bookings in the application, allowing users to book properties, view their bookings, and manage incoming booking requests.

