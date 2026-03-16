import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// AuthGuard is a built-in NestJS class that provides a way to protect routes. By extending AuthGuard and passing 'jwt' as an argument, we are telling NestJS to use the JWT strategy we defined in auth.strategy.ts for authentication

// 1. automatically validate incoming requests for protected routes
// 2. attach the authenticated user to the request object if the token is valid. If the token is invalid or missing, it will throw an UnauthorizedException, preventing access to the route.