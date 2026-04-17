'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedPage from '@/components/ProtectedPage';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { User } from '@/types';

const formatRole = (role?: string) =>
    role ? role.charAt(0) + role.slice(1).toLowerCase() : '';

function ProfileContent() {
    const router = useRouter();
    const { updateUser, logout } = useAuth();
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        role: 'BUYER' as 'BUYER' | 'OWNER',
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await authService.getMe();
                setProfile(data);
                setForm({
                    name: data.name,
                    email: data.email,
                    role: data.role === 'OWNER' ? 'OWNER' : 'BUYER',
                });
            } catch {
                setError('Could not load profile.');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const updated = await authService.updateMe(form);
            setProfile(updated);
            updateUser(updated);
        } catch {
            setError('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete your profile? This will remove your listings and bookings.')) return;

        setDeleting(true);
        setError('');
        try {
            await authService.deleteMe();
            logout();
            router.push('/');
        } catch {
            setError('Failed to delete profile.');
            setDeleting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.12),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_55%,_#f8fafc_100%)]">
            <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14">
                <div className="mb-8 rounded-3xl border border-white/70 bg-slate-900 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] overflow-hidden">
                    <div className="px-6 py-7 sm:px-8 sm:py-8 bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/75">Account</p>
                        <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">Profile settings</h1>
                        <p className="mt-3 max-w-2xl text-white/85">
                            Edit your profile details, switch between buyer and owner, or delete your account.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 mb-6">
                        {error}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
                        {loading ? (
                            <div className="text-slate-500">Loading profile...</div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-2">Display name</p>
                                    <input
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                    />
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-2">Email</p>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-2">Account type</p>
                                        <select
                                            value={form.role}
                                            onChange={(e) => setForm({ ...form, role: e.target.value as 'BUYER' | 'OWNER' })}
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                                        >
                                            <option value="BUYER">Buyer</option>
                                            <option value="OWNER">Owner</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 pt-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 disabled:opacity-60"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => router.push('/dashboard')}
                                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        Back to Dashboard
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Current details</p>
                            <div className="mt-5 space-y-4">
                                <div>
                                    <p className="text-sm text-slate-500">Name</p>
                                    <p className="text-slate-900 font-medium">{profile?.name ?? '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Email</p>
                                    <p className="text-slate-900 font-medium">{profile?.email ?? '—'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Role</p>
                                    <p className="text-slate-900 font-medium">{formatRole(profile?.role)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-red-200 bg-red-50 shadow-sm p-6 sm:p-8">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-400">Danger zone</p>
                            <p className="mt-3 text-sm text-red-700 leading-6">
                                Deleting your profile removes your account, your listings, and related bookings.
                            </p>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="mt-5 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:opacity-60"
                            >
                                {deleting ? 'Deleting...' : 'Delete Profile'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <ProtectedPage>
            <ProfileContent />
        </ProtectedPage>
    );
}