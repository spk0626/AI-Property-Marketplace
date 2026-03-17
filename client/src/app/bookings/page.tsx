'use client';
import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { bookingService } from '@/services/bookingService';
import { useAuth } from '@/context/AuthContext';
import { Booking } from '@/types';
import ProtectedPage from '@/components/ProtectedPage';

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-gray-100 text-gray-500',
};

function BookingContent() {
    const { user } = useAuth();
    const [myBookings, setMyBookings] = useState<Booking[]>([]);
    const [incoming, setIncoming] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'mine' | 'incoming'>('mine');
    const [actionError, setActionError] = useState('');

    useEffect(() => {
        const requests = [bookingService.getMyBookings()];
        if (user?.role === 'OWNER') {
            requests.push(bookingService.getIncomingBookings());
        }

        Promise.all(requests)
            .then(([mine, incoming]) => {
                setMyBookings(mine);
                if (incoming) setIncoming(incoming);
            })
            .finally(() => setLoading(false));
    }, [user]);


    const handleAction = async (id: string, status: string) => {
        setActionError('');
        try {
            await bookingService.updateStatus(id, status);
            setIncoming((prev) =>
                prev.map((b) => (b.id === id ? { ...b, status: status as Booking['status'] } : b)),
            );
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            setActionError( axiosError.response?.data?.message ?? 'Failed to update booking status' );
        }
    };

    const handleStatus = async (id: string, status: string) => {
        setActionError('');
    try {
        await bookingService.updateStatus(id, status);
        setIncoming((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: status as Booking['status'] } : b)),
        );
    } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setActionError( axiosError.response?.data?.message ?? 'Action failed' );
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
            setActionError( axiosError.response?.data?.message ?? 'Cancel failed' );
        }
    };

    if (loading) {
        return (
             <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

   return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>

      {actionError && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
          {actionError}
        </div>
      )}

      {user?.role === 'OWNER' && (
        <div className="flex gap-2 mb-6">
          {(['mine', 'incoming'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t === 'mine' ? 'My Requests' : `Incoming (${incoming.length})`}
            </button>
          ))}
        </div>
      )}

      {/* My bookings */}
      {tab === 'mine' && (
        <div className="space-y-4">
          {myBookings.length === 0 ? (
            <p className="text-gray-400 text-center py-10">
              No booking requests made yet.
            </p>
          ) : (
            myBookings.map((b) => (
                <div key={b.id} className="bg-white rounded-xl border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{b.property?.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {b.property?.location}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Visit:{' '}
                      {new Date(b.visitDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[b.status]}`}
                  >
                    {b.status}
                    </span>
                </div>
                {b.status === 'PENDING' && (
                    <button
                    onClick={() => handleCancel(b.id)}
                    className="mt-3 text-sm text-red-500 hover:text-red-600"
                  >
                    Cancel Request
                    </button>
                )}
                </div>
            ))
            )}
        </div>
        )}

         {/* Incoming bookings (owners) */}
      {tab === 'incoming' && (
        <div className="space-y-4">
          {incoming.length === 0 ? (
            <p className="text-gray-400 text-center py-10">
              No incoming requests yet.
            </p>
          ) : (
            incoming.map((b) => (
              <div key={b.id} className="bg-white rounded-xl border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{b.property?.title}</p>
                    <p className="text-sm text-gray-500">
                      From:{' '}
                      {(b as Booking & { user?: { name: string; email: string } }).user?.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Visit:{' '}
                      {new Date(b.visitDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    {b.message && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        &ldquo;{b.message}&rdquo;
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[b.status]}`}
                  >
                    {b.status}
                  </span>
                </div>
                {b.status === 'PENDING' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleStatus(b.id, 'APPROVED')}
                      className="text-sm bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatus(b.id, 'REJECTED')}
                      className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Reject
                    </button>
                  </div>
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






