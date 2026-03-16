import { IsEnum } from "class-validator";

export enum BookingStatusUpdate {
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED'
}

export class UpdateBookingStatusDto {
    @IsEnum(BookingStatusUpdate, { 
        message: `status must be one of the following values: ${Object.values(BookingStatusUpdate).join(', ')}`
 })
 status: BookingStatusUpdate;
}


// when updating a booking, only status can be updated