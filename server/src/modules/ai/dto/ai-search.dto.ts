import { IsString, MinLength, MaxLength } from 'class-validator';

export class AiSearchDto {
    @IsString()
    @MinLength(3, { message: 'Query must be at least 3 characters long' })
    @MaxLength(300, { message: 'Query must be at most 300 characters long' })
    query: string;
}