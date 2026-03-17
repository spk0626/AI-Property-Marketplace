'use client'
import { useState, KeyboardEvent } from "react";
import { aiService } from "@/services/aiService";
import { AiSearchResult } from "@/types";
import { AxiosError } from "axios";
import { ApiError } from "@/types";

interface Props {
    onResults: (results: AiSearchResult) => void;   
}

export default function AiSearchBar({ onResults }: Props) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!query.trim() || loading) return;
        setLoading(true);
        setError("");
        
        try {
            const results = await aiService.search(query.trim());
            onResults(results);
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            setError(
                axiosError.response?.data.message ??
                "search failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="w-full max-w-2xl">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder='Try: "2 bedroom apartment in Colombo under 80k with parking"'
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={loading}
                    />
                <button
                    onClick={handleSearch}
                    disabled={loading || !query.trim()}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                    >
                         {loading ? "Searching..." : "✨AI Search"}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
}
           
