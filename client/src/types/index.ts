export type Role = 'BUYER' | 'OWNER' | 'ADMIN';
export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface PropertyImage {
    id: string;
    url: string;
    propertyId: string;
}

export interface Property {
    id: string;
    ownerId: string;
    title: string;
    description: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    parking: boolean;
    area?: number;
    createdAt: string;
    images: PropertyImage[];
    owner: { name: string; email: string };
}

export interface Booking {
    id: string;
    propertyId: string;
    userId: string;
    visitDate: string;
    status: BookingStatus;
    message?: string;
    createdAt: string;
    property?: Property;
    user?: { name: string; email: string };
}

export interface PaginatedProperties {
    properties: Property[];
    total: number;
    page: number;
    totalPages: number;
}

export interface AiSearchResult {
    summary: string;
    properties: Property[];
    filters: Record<string, unknown>;
    total: number;
}

export interface ApiError {
    statusCode: number;
    message: string;
    path: string;
    timestamp: string;
}
