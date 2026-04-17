'use client';
import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { bookingService } from '@/services/bookingService';
import { useAuth } from '@/context/AuthContext';
import { Booking } from '@/types';
import ProtectedPage from '@/components/ProtectedPage';
import BookingSkeleton from '@/components/BookingSkeleton';

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-gray-100 text-gray-500',
};

type BookingStatus = Booking['status'];
type IncomingBooking = Booking & { user?: { name?: string } };

function BookingContent() {
    const { user } = useAuth();
    const [myBookings, setMyBookings] = useState<Booking[]>([]);
    const [incoming, setIncoming] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'mine' | 'incoming'>('mine');
    const [actionError, setActionError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // FIXED: Logic was slightly disjointed; using explicit checks
                const [mine] = await Promise.all([bookingService.getMyBookings()]);
                setMyBookings(mine);
                
                if (user?.role === 'OWNER') {
                    const inc = await bookingService.getIncomingBookings();
                    setIncoming(inc);
                }
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [user]);

    const handleStatusUpdate = async (id: string, status: BookingStatus) => {
        setActionError('');
        try {
            await bookingService.updateStatus(id, status);
            setIncoming((prev) =>
                prev.map((b) => (b.id === id ? { ...b, status } : b)),
            );
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            setActionError(axiosError.response?.data?.message ?? 'Action failed');
        }
    };

    const handleCancel = async (id: string) => {
        setActionError('');
        try {
            await bookingService.cancel(id);
            setMyBookings((prev) =>
                prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' as const } : b)),
            );
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            setActionError(axiosError.response?.data?.message ?? 'Cancel failed');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Bookings</h1>

            {actionError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl mb-6 flex items-center gap-2">
                   <span>⚠️</span> {actionError}
                </div>
            )}

            {user?.role === 'OWNER' && (
                <div className="flex p-1 bg-gray-100 rounded-xl mb-8 w-fit">
                    {(['mine', 'incoming'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                                tab === t
                                    ? 'bg-white text-teal-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {t === 'mine' ? 'My Requests' : `Incoming (${incoming.length})`}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <BookingSkeleton />
            ) : (
                <div className="space-y-4">
                    {(tab === 'mine' ? myBookings : incoming).length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
                           <p className="text-gray-400">No requests found here.</p>
                        </div>
                    ) : (
                        (tab === 'mine' ? myBookings : incoming).map((b) => (
                            <div key={b.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="font-bold text-gray-900 text-lg">{b.property?.title}</p>
                                        <div className="flex items-center text-sm text-gray-500 gap-2">
                                            <span>📍 {b.property?.location}</span>
                                        </div>
                                        <p className="text-sm text-teal-600 font-medium mt-2">
                                            📅 Visit: {new Date(b.visitDate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        {tab === 'incoming' && (
                                            <p className="text-sm text-gray-600 font-medium">
                                                👤 From: {(b as IncomingBooking).user?.name ?? 'Unknown user'}
                                            </p>
                                        )}
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${statusColors[b.status]}`}>
                                        {b.status}
                                    </span>
                                </div>
                                
                                {tab === 'incoming' && b.status === 'PENDING' && (
                                    <div className="flex gap-3 mt-5 pt-4 border-t border-gray-50">
                                        <button onClick={() => handleStatusUpdate(b.id, 'APPROVED')} className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors">Approve</button>
                                        <button onClick={() => handleStatusUpdate(b.id, 'REJECTED')} className="flex-1 bg-white border border-gray-200 text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">Reject</button>
                                    </div>
                                )}
                                
                                {tab === 'mine' && b.status === 'PENDING' && (
                                    <button onClick={() => handleCancel(b.id)} className="mt-4 text-sm font-semibold text-red-500 hover:text-red-600">Cancel Request</button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default function BookingsPage() {
    return (
        <ProtectedPage>
            <BookingContent />
        </ProtectedPage>
    );
}
