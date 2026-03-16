import { IsISO8601, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBookingDto {
    @IsUUID('4', { message: 'propertyId must be a valid UUID v4' })
    propertyId: string;

    @IsISO8601({}, { message: 'visitDate must be a valid ISO 8601 date' })
    visitDate: string;

    @IsString()
    @IsOptional()
    message?: string;
}

// ISO 8601 date format: YYYY-MM-DDTHH:mm:ss.sssZ (e.g., 2024-06-01T12:00:00.000Z)