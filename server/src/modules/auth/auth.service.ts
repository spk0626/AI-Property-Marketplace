import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) {}
    // Inputs - PrismaService for database access and JwtService for handling JWT operations
    // Process - Initializes the AuthService
    // Output - An instance of AuthService with access to database and JWT functionalities


    async register(dto: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) throw new ConflictException('Email already in use');

        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash,
                role: dto.role ?? 'BUYER',
            },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        return { user, token: this.signToken(user.id, user.email, user.role) };
    }
    // Inputs - RegisterDto containing name, email, password, and optional role
    // Process - Checks if a user with the provided email already exists. If so, it throws a ConflictException. If not, it hashes the password, creates a new user in the database, and generates a JWT token for the newly registered user.
    // Output - Returns an object containing the newly created user's information (excluding password) and a JWT token for authentication.


    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

        const { passwordHash: _omit, ...safeUser} = user;
        return { user: safeUser, token: this.signToken(user.id, user.email, user.role) };
    }
    // Inputs - LoginDto containing email and password
    // Process - Looks up the user by email. If the user does not exist, it throws an UnauthorizedException. If the user exists, it compares the provided password with the stored password hash. If the password is invalid, it throws an UnauthorizedException. If valid, it returns the user's information (excluding password) and a JWT token for authentication.
    // Output - Returns an object containing the authenticated user's information (excluding password) and a JWT token for authentication.


    async getUserById(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
    }
    // Inputs - userId (string)
    // Process - Retrieves a user's information from the database based on their unique ID. It selects only specific fields to return, excluding sensitive information like the password hash.
    // Output - Returns an object containing the user's id, name, email, role, and createdAt timestamp. If the user does not exist, it returns null.


    private signToken(id: string, email: string, role: string): string {
        return this.jwt.sign({ id, email, role });
    }
    // Inputs - id, email, and role of the user
    // Process - Uses the JwtService to create a signed JWT token containing the user's id, email, and role as the payload.
    // Output - Returns a JWT token as a string that can be used for authenticating subsequent requests.
}

/* AuthService: 
1. handles all authentication-related operations, including user registration, login, and retrieving user information
2. interacts with the database through PrismaService and manages JWT tokens using JwtService. 
Methods:
- register: Handles user registration by validating input, checking for existing users, hashing passwords, creating new user records, and returning user info along with a JWT token.
- login: Handles user login by validating credentials, checking password hashes, and returning user info along with a JWT token if authentication is successful.
- getUserById: Retrieves user information based on their unique ID, excluding sensitive data.
- signToken: Generates a JWT token containing the user's id, email, and role for authentication purposes.
*/

