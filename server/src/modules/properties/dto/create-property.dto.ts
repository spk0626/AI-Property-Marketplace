import {
    IsBoolean, IsNumber, IsOptional, IsPositive,
    IsString, Min, MinLength, 
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
    @IsString()
    @MinLength(5, { message: 'Title must be at least 5 characters' })
    title: string;

    @IsString()
    @MinLength(10, { message: 'Description must be at least 10 characters' })
    description: string;

    @Type(() => Number)
    @IsNumber()
    @IsPositive({message: 'Price must be a positive number'})
    price: number;

    @IsString()
    @MinLength(2)
    location: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    bedrooms: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    bathrooms: number;

    @IsBoolean()
    @IsOptional()
    parking?: boolean = false;  

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    area?: number;  // in square feet
}

// @Type(() => Number) is used to transform the input value to a number type before validation, 
// while @IsNumber() is used to validate that the value is indeed a number. 
// In this DTO, we use both to ensure that the incoming data is properly transformed and validated as numbers for fields like price, bedrooms, bathrooms, and area.