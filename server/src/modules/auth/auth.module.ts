import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type { StringValue } from "ms";
import { AuthController } from "src/modules/auth/auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./auth.strategy";
import { JwtAuthGuard } from "./auth.guard";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt'}),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.getOrThrow<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: (config.get<string>('JWT_EXPIRES_IN') ?? '7d') as StringValue,
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, JwtAuthGuard],
    exports: [JwtAuthGuard, JwtStrategy, JwtModule, PassportModule],
})

export class AuthModule {}

// AuthModule: 
// 1. imports PassportModule for authentication and JwtModule for JWT handling, both configured to use environment variables for secrets and expiration times.
// 2. defines AuthController for handling authentication routes, AuthService for business logic related to authentication, JwtStrategy for validating JWT tokens, and JwtAuthGuard for protecting routes.
// 3. exports JwtAuthGuard, JwtStrategy, JwtModule, and PassportModule so they can be used in other modules across the application to protect routes and handle authentication.