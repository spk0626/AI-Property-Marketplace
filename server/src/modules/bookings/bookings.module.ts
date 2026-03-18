import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { AuthModule } from '../auth/auth.module';
import { BOOKING_QUEUE } from '../../jobs/jobs.constants';

@Module({
    imports: [
        AuthModule,
        BullModule.registerQueue({ name: BOOKING_QUEUE }),  // registers a Bull queue named 'booking-queue' for handling booking-related background jobs, such as sending confirmation emails 
    ],
    controllers: [BookingsController],
    providers: [BookingsService],
})
export class BookingsModule {}


// 1. defines the BookingsModule, which imports the AuthModule for authentication 
// 2. registers a Bull queue for handling booking-related background jobs
// 3. It also specifies the BookingsController for handling HTTP requests related to bookings 
// 4. the BookingsService for implementing the business logic of booking operations.