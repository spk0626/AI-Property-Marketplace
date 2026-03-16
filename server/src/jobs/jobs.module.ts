import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './email.processor';

export const BOOKING_QUEUE = 'booking';  // this will be used to identify the queue when adding jobs and processing them

@Module({
    imports: [
        BullModule.registerQueue({ name: BOOKING_QUEUE }),  // registers a Bull queue with the name 'booking'
    ],
    providers: [EmailProcessor],  // registers the EmailProcessor as a provider, which will handle processing jobs from the 'booking' queue
})
export class JobsModule {}

// Summary of module:
// - It imports the BullModule and registers a queue named 'booking' for handling background jobs related to bookings.
// - It provides the EmailProcessor, which contains the logic for processing jobs from the 'booking' queue, such as sending confirmation emails or notifications.