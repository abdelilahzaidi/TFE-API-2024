

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { InvoiceEntity } from '../invoice/entity/invoice.entity';


@Injectable()
export class MailService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'hotmail', // Adapter si besoin pour un autre service
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });
  }

  // Méthode pour envoyer un email de réinitialisation de mot de passe
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

  // Méthode pour envoyer les factures par email
  async sendInvoiceEmail(userEmail: string, invoices: InvoiceEntity[]): Promise<void> {
    const emailContent = this.generateInvoiceEmailContent(invoices);

    const mailOptions = {
      from: this.configService.get<string>('MAIL_USER'),
      to: userEmail,
      subject: 'Vos factures d’abonnement',
      html: emailContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email de factures envoyé à ${userEmail}`);
    } catch (error) {
      console.error(`Erreur lors de l'envoi de l'email de factures à ${userEmail}:`, error);
      throw new Error('Erreur lors de l\'envoi de l\'email de factures.');
    }
  }

  // Méthode privée pour générer le contenu HTML de l'email de factures
  private generateInvoiceEmailContent(invoices: InvoiceEntity[]): string {
    const invoiceList = invoices.map(
      (invoice) =>
        `<li>Facture #${invoice.id} - Montant: ${invoice.montant}€ - Date d'envoi: ${invoice.dateEnvoie.toLocaleDateString()} - État: ${invoice.etatDePaiement ? 'Payée' : 'Non payée'}</li>`
    ).join('');

    return `
      <h1>Liste de vos factures</h1>
      <p>Bonjour,</p>
      <p>Voici la liste des factures générées pour votre abonnement :</p>
      <ul>${invoiceList}</ul>
      <p>Cordialement,<br>L'équipe de gestion des abonnements</p>
    `;
  }
}


  
