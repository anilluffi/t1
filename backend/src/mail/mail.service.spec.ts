import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendMail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: '"Support" <eldertheos@gmail.com>',
      to,
      subject,
      text,
    });
  }
}
