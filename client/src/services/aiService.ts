import api from "@/lib/axios";
import { AiSearchResult } from "@/types";

export const aiService = {
    search: async (query: string) => {
        const response = await api.post<AiSearchResult>("/ai/search", { query });
        return response.data;
    },
    // inputs - A string query for searching properties using AI
    // output - An object containing the search results, which may include an array of properties and any relevant metadata returned from the server
    
};