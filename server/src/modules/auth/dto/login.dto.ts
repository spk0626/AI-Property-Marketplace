import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: 'Invalid email' })
    email: string;

    @IsString()
    @MinLength(1, { message: 'Password must not be empty' })
    password: string;
}

// DTO (Data Transfer Object) for user login

// 1. Defines the structure of the login data (email and password)
// 2. Uses class-validator decorators for validation rules (eg: @IsEmail, @IsString, @MinLength)