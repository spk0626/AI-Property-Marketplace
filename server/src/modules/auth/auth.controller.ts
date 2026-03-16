import {
    Controller, Post, Get, Body, UseGuards, HttpCode, 
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './auth.guard';
import { CurrentUser } from './auth.decorator';
import type { JwtUser } from 'src/common/interfaces/jwt-user.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')                     // Prevents account creation spam
    @Throttle({ auth: { ttl: 60_000, limit: 10 } }) // Limit to 10 registration attempts per minute per IP
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }
    // inputs - RegisterDto
    // outputs - AuthService register() method (user info and JWT token)


    @Post('login')                   // Prevents brute force attacks
    @HttpCode(200)                      // Return 200 OK instead of 201 Created for login   
    @Throttle({ auth: { ttl: 60_000, limit: 10 } }) // Limit to 10 login attempts per minute per IP
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
    // inputs - LoginDto
    // outputs - AuthService login() method (user info and JWT token)


    @Get('user')                  // Protected route to get current user profile
    @UseGuards(JwtAuthGuard)         // Protects the route, only accessible with a valid JWT token using JwtAuthGuard
    getProfile(@CurrentUser() user: JwtUser) {
        return this.authService.getUserById(user.id);
    }
    // inputs - none (relies on JWT token for authentication)
    // outputs - AuthService getUserById() method (current user's profile information)
}

// AuthController: the entry point for all authentication-related HTTP requests. It defines routes for registration, login, and user profile retrieval.