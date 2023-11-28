import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Req() req: Request) {
        return this.authService.login(req.user);
    }

    @Post('/forgot-password')
    forgotPassword(@Body() { email }: { email: string }) {
        return this.authService.forgotPassword(email);
    }

    @Post('/verify-otp')
    verifyOtp(@Body() { email, otp }: { email: string; otp: number }) {
        return this.authService.verifyOtp(email, otp);
    }

    @Post('/reset-password')
    resetPassword(@Body() { id, newPassword }: { id: number, newPassword: string }) {
        return this.authService.resetPassword(id, newPassword);
    }


}
