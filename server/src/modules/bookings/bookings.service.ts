import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
    Logger,
} from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import type { Queue } from "bull";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { BookingStatusUpdate } from "./dto/update-status.dto";
import { BOOKING_QUEUE, EMAIL_JOBS } from "src/jobs/jobs.constants";
import type { BookingConfirmationJob } from "src/jobs/email.processor";

@Injectable()
export class BookingsService {
    private readonly logger = new Logger(BookingsService.name);

    constructor(
        private readonly prisma: PrismaService,
        @InjectQueue(BOOKING_QUEUE) private readonly bookingQueue: Queue,
    ) {}
    // 1. initializes the PrismaService for database interactions
    // 2. injects a Bull queue for handling booking-related background jobs (e.g., sending confirmation emails)

    async create(userId: string, dto: CreateBookingDto) {
        // 1. Validate property exists and is available for the requested dates
        const property = await this.prisma.property.findUnique({
            where: { id: dto.propertyId },
        });
        if (!property) throw new NotFoundException('Property not found');
        if (property.ownerId === userId) {
            throw new BadRequestException('Cannot book your own property');
        }

        // 2. Create the booking in the database
        const booking = await this.prisma.booking.create({
            data: {
                userId,
                propertyId: dto.propertyId,
                visitDate: new Date(dto.visitDate),
                message: dto.message,
            },
            include: {
                property: { include: { images: true } },
                user: { select: { name: true, email: true } }, 
            },
        });

        // 3. Add a job to the booking queue to send a confirmation email to the user
        const jobData: BookingConfirmationJob = {
            to: booking.user.email,
            userName: booking.user.name,
            propertyTitle: booking.property.title,
            visitDate: booking.visitDate.toISOString(),
        };
        await this.bookingQueue.add(EMAIL_JOBS.BOOKING_CONFIRMATION, jobData);
        this.logger.log(`Booking created: ${booking.id}`);

        return booking;
    }
    // inputs: userId & CreateBookingDto containing propertyId, visitDate, and message
    // process: validates that the property exists and is not owned by the user, creates a new booking in the database, and adds a job to the booking queue to send a confirmation email to the user.
    // output: the newly created booking

    async findByUser(userId: string) {
        return this.prisma.booking.findMany({
            where: { userId },
            include: { property: { include: { images: { take: 1 } } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    // inputs: userId
    // process: queries the database for bookings made by the specified user, including related property information (with one image) and orders them by creation date.
    // output: a list of bookings made by the specified user, with related property details and one image for each property


    async findIncoming(ownerId: string) {
        return this.prisma.booking.findMany({
            where: { property: { ownerId } },
            include: { 
                property: { select: { id: true, title: true, location: true } },
                user: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    // inputs: ownerId
    // process: queries the database for bookings that are associated with properties owned by the specified owner, including related property and user information, and orders them by creation date.
    // output: a list of incoming bookings for the properties owned, with related property and user details


    async updateStatus(
        id: string,
        ownerId: string,
        status: BookingStatusUpdate,  // status can be either 'APPROVED', 'REJECTED', or 'PENDING'
    ) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { property: true },
        });
        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.property.ownerId !== ownerId) {
            throw new ForbiddenException('You can only update bookings for your own properties');
        }

        return this.prisma.booking.update({where: { id}, data: { status }});
    }
    // inputs: booking id, ownerId, and new status (BookingStatusUpdate)
    // process: validates that the booking exists and that the authenticated user is the owner of the property associated with the booking, then updates the booking's status in the database.
    // output: the updated booking with the new status


    async cancel(id: string, userId: string) {
        const booking = await this.prisma.booking.findUnique({ where : { id } });
        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.userId !== userId) {
            throw new ForbiddenException('You can only cancel your own bookings');
        }

        return this.prisma.booking.update({
            where: { id},
            data: { status: 'CANCELLED' },
        });   // updated as 'CANCELLED', not deleted

    }
    // inputs: booking id and userId
    // process: validates that the booking exists and that the authenticated user is the one who made the booking, then updates the booking's status to 'CANCELLED' in the database.
    // output: the updated booking with the CANCELLED status
}