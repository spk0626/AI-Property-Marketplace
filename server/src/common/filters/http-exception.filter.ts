import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { time } from 'node:console';
import path from 'node:path';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const { statusCode, message } = this.resolveException(exception);

        // Log server errors with full details, but client errors briefly
        if (statusCode >= 500) {
            this.logger.error(
                {exception, path: request.url },
                `Internal error on ${request.method} ${request.url}`,
            );
        } else {
            this.logger.warn(
                `${statusCode} on ${request.method} ${request.url}: ${message}`,
            );
        }

        response.status(statusCode).json({
            statusCode,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }

    private resolveException(exception: unknown): { 
        statusCode: number; 
        message: string 
    } {
        if (exception instanceof HttpException) {
            const response = exception.getResponse();
            const message = 
            typeof response === 'string'
                ? response
                : (response as Record<string, unknown>).message?.toString() ??
                    exception.message;
            return { statusCode: exception.getStatus(), message };
        }

        // Prisma: unique constraint violation (eg: Duplicate Email)
        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            if (exception.code === 'P2002') {
                return { statusCode: 409, message: 'A record with this value already exists.' };

            }

            if (exception.code === 'P2025') {
                return { statusCode: 404, message: 'Record not found.' };
            }

            if (exception.code === 'P2003') {
                return { statusCode: 400, message: 'Related record does not exist' };
            }
        }

        // Prisma: validation error (eg: invalid email format)
        if (exception instanceof Prisma.PrismaClientValidationError) {
            return { statusCode: 400, message: 'Invalid data provided' };
        }

        // Unknown - do not leak internals
        return { 
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'An unexpected error occurred. Please try again later.',
        };
    }
}

// class summary:
// inputs - any exception thrown in the application
// process - catches all exceptions, determines the appropriate HTTP status code and message based on the type of exception (including specific handling for Prisma errors), logs the error details (with more verbosity for server errors), and sends a standardized JSON response to the client containing the status code, message, request path, and timestamp.
// output - a JSON response with the error details and appropriate HTTP status code, while ensuring that sensitive internal error information is not exposed to the client.

// catch method summary:
// inputs - the exception object and the arguments host (which provides access to the request and response objects)
// process - extracts the request and response objects, resolves the exception to determine the status code and message, logs the error (with different levels of detail based on the severity), and sends a JSON response to the client with the error information.
// output - sends an HTTP response with the appropriate status code and a JSON body containing the error details.

// resolveException method summary:
// inputs - an unknown exception object
// process - checks the type of the exception to determine how to extract the status code and message. It handles HttpException directly, checks for specific Prisma errors (like unique constraint violations, record not found, and related record issues), and defaults to a generic internal server error for any other types of exceptions.
// output - returns an object containing the resolved HTTP status code and a user-friendly error message based on the type of exception encountered.



