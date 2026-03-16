import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import * as nodemailer from 'nodemailer';
import { BOOKING_QUEUE } from './jobs.module';

export const EMAIL_JOBS = {
    BOOKING_CONFIRMATION: 'booking-confirmation',
} as const;
// EMAIL_JOBS that contains the property BOOKING_CONFIRMATION with the value 'booking-confirmation'.

export interface BookingConfirmationJob {
    to: string;  // recipient email address
    userName: string;  
    propertyTitle: string;
    visitDate: string;  // ISO string format
}
// defines the structure of the data that will be passed to handleBookingConfirmation 


@Processor(BOOKING_QUEUE)
export class EmailProcessor {
    private readonly logger = new Logger(EmailProcessor.name);

    // Transporter: to send emails. It is initialized lazily. Only created in the first time, then reused 
    private transporter: nodemailer.Transporter | null = null; 

    private async getTransporter(): Promise<nodemailer.Transporter> { 
        if (this.transporter) return this.transporter;
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: { user: testAccount.user, pass: testAccount.pass },
        });
        return this.transporter;
    }
    // summary:
    // inputs - none
    // process - checks if the transporter has already been created; if not, it creates a test email account using nodemailer, sets up a transporter with the SMTP configuration for Ethereal (a fake SMTP service for testing), and returns the transporter instance. If the transporter already exists, it simply returns the existing instance.
    // output - returns a nodemailer.Transporter instance that can be used to send emails.

    @Process(EMAIL_JOBS.BOOKING_CONFIRMATION)
    async handleBookingConfirmation(
        job: Job<BookingConfirmationJob>,
    ): Promise<void> {
        this.logger.log(`Processing job ${job.id}: booking confirmation`);
        const { to, userName, propertyTitle, visitDate } = job.data;
        const transporter = await this.getTransporter();

        const info = await transporter.sendMail({
            from: ' "Property Marketplace" <noreply@property-marketplace.com>',
            to,
            subject: 'Your Visit Request Has Been Received',
            html:`
            <div style="font-family: sans-serif; max-width: 480px;margin:0 auto;">
            <h2>Hi ${userName},</h2>
            <p>Your visit request for <strong>${propertyTitle}</strong> 
            has been received.</p>
            <p><strong>Requested date:</strong> 
            ${new Date(visitDate).toLocaleString('en-US', {
                weekday: 'long', year: 'numeric', 
                month: 'long', day: 'numeric', 
            })}</p>
            <p>The owner will review your request shortly.</p>
            </div>
            `,
        });
        // summary:
        // inputs - list of BookingConfirmationJob jobs with to, userName, propertyTitle, and visitDate
        // process - logs the start of job processing, retrieves the transporter instance, and sends an email using the transporter with the specified recipient, subject, and HTML content that includes the user's name, property title, and formatted visit date.
        // output - void. sends an email to the specified recipient with the booking confirmation details.

        // Click this url in terminal to preview the email in a browser
        this.logger.log(
            `Email sent. Preview: ${nodemailer.getTestMessageUrl(info) as string}`,
        );
    }
}