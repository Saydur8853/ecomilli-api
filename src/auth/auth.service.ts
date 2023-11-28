import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { CustomResponse } from 'src/shared/responses/CustomResponse';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';


@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.databaseService.user.findUnique({ where: { email } });

        if (!user) {
            throw new UnauthorizedException('User Not Registered.');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new UnauthorizedException('Email/Password is wrong.');
        }


        const response = {
            id: user.id,
            roleId: user.roleId
        };

        return response;

    }


    async login(payload: any) {
        const { id } = payload;
        const accessToken: string = await this.jwtService.signAsync(payload);
        const user = await this.databaseService.user.findUnique({ where: { id }, include: { role: { select: { name: true } } } });

        const response: LoggedInResponse = {
            token: accessToken,
            user: {
                id: user.id,
                roleId: user.roleId
            }
        };

        return new CustomResponse(true, "Successfully LoggedIn!", response);
    }

    // Forgot Password Related 
    async forgotPassword(email: string) {
        try {
            const user = await this.databaseService.user.findUnique({ where: { email } });
            if (!user) return new CustomResponse(false, "User Not Found.", {});

            const generatedOtp = await this.generateOtp(user.id);

            const template = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <title>OTP Verification</title>
                <style>
                    /* Add your CSS styles here for better formatting */
                    body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                    }
                    .container {
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                    color: #333;
                    text-align: center;
                    }
                    p {
                    color: #666;
                    }
                    .otp {
                    font-size: 24px;
                    font-weight: bold;
                    text-align: center;
                    padding: 20px 0;
                    border-bottom: 1px solid #ccc;
                    }
                    .note {
                    color: #999;
                    font-size: 14px;
                    text-align: center;
                    margin-top: 20px;
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <h1>Hello, ${user.name}</h1>
                    <p>Your OTP for password reset is:</p>
                    <div class="otp">${generatedOtp.toString()}</div>
                    <p class="note">Note: This OTP is valid for a limited time.</p>
                </div>
                </body>
                </html>

    `;

            await this.emailService.sendEmail(user.email, "OTP Verification", template);

            return new CustomResponse(true, "An Email  has been sent! Check you email inbox/spam folder.", {});
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async verifyOtp(email: string, otp: number) {
        try {
            const user = await this.databaseService.user.findUnique({ where: { email } });

            if (!user) return new CustomResponse(false, "User Not Registered.", {});

            if (user.otp !== otp) return new CustomResponse(false, "Invalid OTP.", {});

            await this.databaseService.user.update({
                where: { id: user.id },
                data: {
                    otp: null
                }
            });

            return new CustomResponse(true, "OTP has been Verified Successfully.", { userId: user.id, email: user.email });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async resetPassword(id: number, newPassword: string) {
        try {
            const user = await this.databaseService.user.findUnique({ where: { id, otp: { not: null } } });

            if (user) return new CustomResponse(false, "OTP is not verified. Try again!", {});

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Updating the Password
            await this.databaseService.user.update({
                where: { id },
                data: {
                    password: hashedPassword
                }
            });

            return new CustomResponse(true, "Password Reset was Successful.", {});
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }







    // Generate a 4 digit OTP Code
    async generateOtp(userId: number): Promise<number> {
        const otp = Math.floor(1000 + Math.random() * 9000);
        await this.databaseService.user.update({
            where: { id: userId },
            data: {
                otp
            }
        });
        return otp;
    }

}
