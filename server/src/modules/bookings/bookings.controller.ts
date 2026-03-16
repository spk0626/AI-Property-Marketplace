import {
  Controller, Get, Post, Put, Param, Body, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/auth.decorator';
import type { JwtUser } from '../../common/interfaces/jwt-user.interface';


@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    @Post()
    create(@CurrentUser() user: JwtUser, @Body() dto: CreateBookingDto) {
        return this.bookingsService.create(user.id, dto);
    }
    // inputs: @CurrentUser - authenticated user & @Body - CreateBookingDto 
    // outputs: result of bookingsService.create which is the newly created booking

    @Get('my')
    getUserBookings(@CurrentUser() user: JwtUser) {
        return this.bookingsService.findByUser(user.id);
    }
    // inputs: @CurrentUser - authenticated user
    // outputs: result of bookingsService.findByUser which is an array of bookings made by the authenticated user


    @Get('incoming')
    getIncomingBookings(@CurrentUser() user: JwtUser) {
        return this.bookingsService.findIncoming(user.id);
    }
    // inputs: @CurrentUser - authenticated user
    // outputs: result of bookingsService.findIncoming which is an array of bookings for properties owned by the authenticated user

    @Put(':id/status')
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: JwtUser,
        @Body() dto: UpdateBookingStatusDto,
    ) {
        return this.bookingsService.updateStatus(id, user.id, dto.status);
    }
    // inputs: @Param - booking id, @CurrentUser - authenticated user, @Body - UpdateBookingStatusDto containing new status
    // outputs: result of bookingsService.updateStatus which is the updated booking with the new status


    @Put(':id/cancel')
    cancel(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: JwtUser,
    ) {
        return this.bookingsService.cancel(id, user.id);
    }
    // inputs: @Param - booking id, @CurrentUser - authenticated user
    // outputs: result of bookingsService.cancel which is the updated booking with the CANCELLED status



    // create: allows authenticated users to create a new booking by providing the necessary details in the request body. It uses the authenticated user's ID to associate the booking with the user.
    // getUserBookings: retrieves all bookings made by the authenticated user.
    // getIncomingBookings: retrieves all bookings for properties owned by the authenticated user, allowing them to see who has booked their properties.
    // updateStatus: allows property owners to update the status of a booking (e.g., approve or reject a booking request) by providing the booking ID and new status in the request.
    // cancel: allows users to cancel their own bookings by providing the booking ID. This updates the booking's status to 'CANCELLED'.
}