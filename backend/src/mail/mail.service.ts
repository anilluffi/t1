import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', 
      port: 587, 
      secure: false, 
      auth: {
        user: process.env.MAIL_USER ||'eldertheos@gmail.com',
        pass: process.env.MAIL_PASS || 'rsynabtkirpotzxe',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"T1 app" <${process.env.MAIL_USER || 'eldertheos@gmail.com'}>`,
        to, 
        subject, 
        text, 
        html,
      });

      //console.log(`Message sent: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}
