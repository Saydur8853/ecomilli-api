import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService { 
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_SMTP'), 
      port: 465, 
      secure: true, 
      auth: {
        user: this.configService.get<string>('EMAIL_USER'), 
        pass: this.configService.get<string>('EMAIL_PASS'), 
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: this.configService.get<string>('EMAIL_USER'), // Sender address
        to, // Receiver's email address
        subject,
        html, // HTML content of the email
      };

      const result = await this.transporter.sendMail(mailOptions); 

      return result;
    } catch (error) { 
      throw new  BadRequestException();
    }
  }
}
