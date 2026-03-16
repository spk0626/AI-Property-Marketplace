import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterPropertiesDto {
    @IsString()
    @IsOptional()
    location?: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    minPrice?: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    maxPrice?: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @IsOptional()
    bedrooms?: number;

    @IsEnum(['true', 'false'], {message: 'parking must be either "true" or "false"'})
    @IsOptional()
    parking?: string;

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @IsOptional()
    page?: number = 1;

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @IsOptional()
    limit?: number = 10;
}

// DTO for filtering properties with validation rules for each filter parameter. 
// All parameters are optional, allowing users to filter based on any combination of criteria. The page and limit parameters have default values to support pagination.
