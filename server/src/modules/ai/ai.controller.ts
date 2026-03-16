import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AiService } from './ai.service';
import { AiSearchDto } from './dto/ai-search.dto';

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) {}

    // Public — no auth required so visitors can try the AI search
    // Limited to 15 RPM to match Gemini free tier quota

    @Post('search')
    @Throttle({ ai: {ttl: 60_000, limit: 15 } })
    search(@Body() dto: AiSearchDto) {
        return this.aiService.search(dto.query);
    }
    // inputs: @Body - AiSearchDto containing the user's search query
    // process: calls the search method of the AiService with the user's query to perform an AI-powered property search based on the query.
    // output: returns the result of the aiService.search method, which includes a summary of the search results, an array of matching properties, the extracted filters, and the total count of matching properties.
}