import { Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface ExtractedFilters {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    parking?: boolean;
}
// To Extract filters from user queries and search properties.

const GEMINI_TIMEOUT_MS = 10_000; // 10 seconds

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private readonly gemini: GenerativeModel;

    constructor(
        private readonly prisma: PrismaService,
        config: ConfigService,
    ) {
        const genAI = new GoogleGenerativeAI(
            config.getOrThrow<string>('GEMINI_API_KEY'),
        );
        this.gemini = genAI.getGenerativeModel({ model: 'gemini-1.5-flash'});
    }
    // Constructor:
    // Inputs - PrismaService 
    // Process - Initializes the Google Generative AI client with the provided API key and sets up the Gemini model for generating responses.
    // Output - An instance of AiService class (this class)


    async search(query: string) {                               // Main method
        const filters = await this.extractFilters(query);
        this.logger.log(`AI extracted filters: ${JSON.stringify(filters)}`);

        const where = this.buildWhereClause(filters);

        const properties = await this.prisma.property.findMany({
            where,
            include: { 
                images: {take: 1},
                owner: { select: { name: true}},
            },
            take: 10,
            orderBy: { price: 'asc' },
        });

        const summary = await this.summarizeResults(query, properties);

        return { summary, properties, filters, total: properties.length }; 
    }
    // inputs: user query string
    // process: extracts filters from the query using the Gemini model, builds a Prisma where clause based on the extracted filters, queries the database for properties matching the criteria, and generates a summary of the results using the Gemini model.
    // output: an object containing a summary of the search results, an array of matching properties, the extracted filters, and the total count of matching properties.

    

    /* Private */

    private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
        const timeout = new Promise<never>((_, reject) =>
            setTimeout(
                () => reject(new RequestTimeoutException(`AI service timed out after ${ms} ms`)),
            ms
        ));
        return Promise.race([promise, timeout]);
    }
    // inputs: a promise and a timeout duration in milliseconds
    // process: creates a timeout promise that rejects after the specified duration and
    // output: returns a new promise that resolves or rejects with the result of the timeout result


    private async extractFilters(query: string): Promise<ExtractedFilters> {
        const prompt = `
        You are a real estate search filter extractor.
        Return ONLY a valid JSON object. No markdown, no explanation. 
        
        User query: "${query}"
        
        Extract into this JSON (omit fields not mentioned):
        
        {
        "location": string,
        "minPrice": number,
        "maxPrice": number,
        "bedrooms": number,
        "bathrooms": number,
        "parking": boolean
        }
        
        Examples:
        "2 bedroom near Colombo under 80k" → {"location":"Colombo","bedrooms":2,"maxPrice":80000}
        "house with parking above 50k" → {"parking":true,"minPrice":50000}
        `.trim();

        try{
            const result = await this.withTimeout(
                this.gemini.generateContent(prompt),
                GEMINI_TIMEOUT_MS,
            );
            
            const text = result.response
            .text()
            .trim()
            .replace(/```json\n?```/g, '')
            .trim();

            const parsed = JSON.parse(text) as Record<string, unknown>;

            return Object.fromEntries(
                Object.entries(parsed).filter(([_, value]) => value !== null && value !== undefined)
            ) as ExtractedFilters;
        } catch (error) {
            this.logger.warn(`Filter extraction failed: ${error}. Using empty filters.`)
            return {};
        }
    }
    // inputs: user query string
    // process: constructs a prompt for the Gemini model to extract search filters from the user query, calls the model to generate a response, and attempts to parse the response as JSON to extract the filters
    // output: an object containing the extracted filters based on the user query, with any fields that were not mentioned in the query omitted



    private buildWhereClause(
        filters: ExtractedFilters,
    ): Prisma.PropertyWhereInput {
        const where: Prisma.PropertyWhereInput = {};

        if (filters.location) {
            where.location = { contains: filters.location, mode: 'insensitive' };
        }

        if(filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price = {
                ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
                ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
            };
        }

        if (filters.bedrooms !== undefined) where.bedrooms = filters.bedrooms;
        if (filters.bathrooms !== undefined) where.bathrooms = filters.bathrooms;
        if (filters.parking !== undefined) where.parking = filters.parking;

        return where;
    }
    // inputs: an object containing the extracted filters
    // process: constructs a Prisma where clause based on the provided filters to be used in a database query for properties
    // output: a Prisma.PropertyWhereInput object that can be used to query the database for properties matching the specified filters


    private async summarizeResults(
        query: string,
        properties: Array<{
            title: string;
            location: string;
            price: number;
            bedrooms: number;
            bathrooms: number;
            parking: boolean;
        }>,
    ): Promise<string> {
        if (properties.length === 0) {
            return `No properties found matching "${query}". Try broadening your search criteria.`;
        }

        const list = properties
        .slice(0, 5)
        .map(
            (p) =>
                `- ${p.title} in ${p.location}: LKR ${p.price.toLocaleString()},`+
            ` ${p.bedrooms} bed, ${p.bathrooms} bath`+
            ` ${p.parking ? ', parking included': ''}`,
        )
        .join('\n');

        const prompt = `
        A user searched for "${query}" 
        Top matching properties:
        ${list}
        Write a helpful 2-3 sentence summary. Mention count, price range, and locations.
    `.trim();

    try{
        const result = await this.withTimeout(
            this.gemini.generateContent(prompt),
            GEMINI_TIMEOUT_MS,
        );
        return result.response.text().trim();
    } catch {
        const prices = properties.map(p => p.price);
        const min = Math.min(...prices).toLocaleString();
        const max = Math.max(...prices).toLocaleString();

        return `Found ${properties.length} properties matching your search, priced between LKR ${min} and LKR ${max}.`}
    }
    // inputs: user query string and an array of matching properties with their details
    // process: constructs a prompt for the Gemini model to generate a summary of the search results, including the count of properties, price range, and locations. If the model fails to generate a summary within the timeout, it falls back to a simple summary based on the count and price range of the properties.
    // output: a string summary of the search results to be displayed to the user
}


// flow of the search method in AiService is as follows:
// 1. The user submits a search query.
// 2. The extractFilters method is called to extract search filters from the query using the Gemini model.
// 3. The buildWhereClause method constructs a Prisma where clause based on the extracted filters.
// 4. The Prisma client queries the database for properties matching the where clause.
// 5. The summarizeResults method generates a summary of the search results using the Gemini model.



