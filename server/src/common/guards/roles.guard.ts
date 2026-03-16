import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { JwtUser } from "../interfaces/jwt-user.interface";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY, 
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles || requiredRoles.length === 0) return true; // No roles required, allow access

        const { user }: { user: JwtUser } = context
        .switchToHttp()
        .getRequest();

        return requiredRoles.includes(user?.role); // Check if user's role is in the required roles
    }
}

// @Injectable() makes this class available for dependency injection in other parts of the application

// Summary of class:
// Inputs - details about the current request and route handler being accessed
// process - checks if the route handler has any roles specified, and if so, checks if the user's role matches one of the required roles
// Outputs - returns true if access is allowed, false if access is denied

// Constructor initializes the RolesGuard class with an instance of the Reflector service