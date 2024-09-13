import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service:'hotmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });
  }

  async sendResetPasswordEmail(to: string, resetLink: string) {
    const mailOptions = {
      from: this.configService.get<string>('MAIL_USER'),
      to,
      subject: 'Réinitialisation de votre mot de passe',
      html: `<p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe : <a href="${resetLink}">${resetLink}</a></p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email de réinitialisation de mot de passe envoyé à ${to}`);
    } catch (error) {
      console.error(`Échec de l'envoi de l'email de réinitialisation de mot de passe à ${to}: ${error}`);
      throw new Error('Échec de l\'envoi de l\'email de réinitialisation de mot de passe');
    }
  }
}