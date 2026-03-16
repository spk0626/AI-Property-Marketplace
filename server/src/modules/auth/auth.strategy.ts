import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtUser } from "../../common/interfaces/jwt-user.interface";

interface JwtPayload {
    id: string;
    email: string;
    role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        config: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
            ignoreExpiration: false,
        });
    }
    // summary:
    // Inputs - ConfigService for accessing environment variables and PrismaService for database access
    // Process - Configures the JWT strategy to extract tokens from the Authorization header, uses a secret key for verification, and does not ignore token expiration.
    // Output - Initializes the JWT strategy for use in authentication

    async validate(payload: JwtPayload): Promise<JwtUser> {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.id },
            select: { id: true, email: true, role: true, name: true },
        });

        if (!user) throw new UnauthorizedException('User no longer exists');
        return user; // This user object will be attached to the request object as req.user
    }
    // summary:
    // Inputs - payload (decoded JWT token containing user id, email, and role)
    // Process - looks up the user in the database using the id from the payload, checks if the user exists, and if so, returns the user information. If the user does not exist, it throws an UnauthorizedException.
    // Output - returns a JwtUser object with the user's id, email, role, and name if validation is successful; otherwise, it throws an error indicating that the user no longer exists.
}


// JwtStrategy class:
// Inputs - JWT token from the Authorization header of incoming requests
// Process - Extracts the JWT token, verifies it using the secret key, and retrieves the user information from the database based on the payload of the token. If the user exists, it returns the user information; if not, it throws an UnauthorizedException.
// Output - Returns a JwtUser object that contains the user's id, email, role, and name if validation is successful; otherwise, it throws an error.