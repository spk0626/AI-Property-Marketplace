import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum UserRole {
    BUYER = 'BUYER',
    OWNER = 'OWNER',
}

export class RegisterDto {
    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters' })
    name: string;

    @IsEmail({}, { message: 'Invalid email' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole = UserRole.BUYER;  // default to BUYER if not provided
}

// DTO (Data Transfer Object) for user registration

// 1. Defines the structure of the registration data (name, email, password, role)
// 2. Uses class-validator decorators (eg: @IsString, @MinLength) to validation rules on the input data, such as minimum length for name and password, valid email format, and allowed values for role.
// 3. Provides a default value for the role property