import api from '@/lib/axios';
import { Property, PaginatedProperties } from '@/types';

export const propertyService = {
    getAll: async (params?: Record<string, unknown>) => {
        const response = await api.get<PaginatedProperties>('/properties', { params });
        return response.data;
    },
    // inputs - Optional query parameters for filtering, sorting, or pagination
    // output - An object containing an array of properties, total count, current page, and total pages
    // getAll: (params?: Record<string, unknown>) => { Promise <PaginatedProperties> ( endpoint, { params } ); return response.data }


    getById: async (id: string) => {
        const response = await api.get<Property>(`/properties/${id}`);
        return response.data;
    },

    getMyProperties: async () => {
        const response = await api.get<Property[]>('/properties/owner/my');
        return response.data;
    },
    // inputs - None (relies on authentication to determine the current user)
    // output - An array of properties owned by the currently authenticated user

    create: async (data: Partial<Property>) => {
        const response = await api.post<Property>('/properties', data);
        return response.data;
    },
    // inputs - An object containing the property details to be created (title, description, price, location, etc.)
    // output - The created property object returned from the server

    update: async (id: string, data: Partial<Property>) => {
        const response = await api.put<Property>(`/properties/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/properties/${id}`);
    },
    // output - None (the property is deleted on the server, and the client can handle any necessary state updates after this call)

    uploadImage: async (propertyId: string, file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post(`/properties/${propertyId}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    // process - Creates a FormData object, appends the image file, and sends a POST request to upload the image for the specified property. The server should handle the file upload and associate it with the property.

};