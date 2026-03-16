import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtUser } from "src/common/interfaces/jwt-user.interface";

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): JwtUser => {
        const request = ctx.switchToHttp().getRequest<{ user: JwtUser }>();
        return request.user; // This will return the authenticated user attached by the JwtAuthGuard
    },
);

// CurrentUser decorator:  Gives the current authenticated user

// allows route handlers to easily access the currently authenticated user's information by simply adding @CurrentUser() 

// Inputs - none 
// Process - accesses the current request's user property, which is populated by the JwtAuthGuard when a valid JWT token is provided. It retrieves the authenticated user's information from the request object.
// Output - returns a JwtUser object that contains the authenticated user's id, email, role, and name. This allows route handlers to easily access the current user's information without needing to manually extract it from the request object each time.

