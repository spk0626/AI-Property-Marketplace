'use client'
import { useState, KeyboardEvent } from "react";
import { aiService } from "@/services/aiService";
import { AiSearchResult } from "@/types";
import { AxiosError } from "axios";
import { ApiError } from "@/types";
import { Sparkles } from "lucide-react";

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
        <div className="w-full max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 relative">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                       <Sparkles className="h-5 w-5 text-teal-500" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder='Try: "2 bedroom apartment in Colombo under 80k.."'
                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-3.5 sm:py-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-sm placeholder:text-gray-400"
                        disabled={loading}
                        />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={loading || !query.trim()}
                    className="bg-teal-600 flex items-center justify-center gap-2 text-white px-8 py-3.5 sm:py-4 rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all whitespace-nowrap shadow-sm hover:shadow-md hover:shadow-teal-600/20 active:scale-[0.98]"
                    >
                         {loading ? (
                             <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Searching...</>
                         ) : (
                             <>AI Search</>
                         )}
                </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-3 ml-2 font-medium bg-red-50/50 p-2 rounded-lg backdrop-blur-sm">{error}</p>}
        </div>
    );
}
           
