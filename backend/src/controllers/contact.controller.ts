import { Request, Response } from 'express';
import Contact, { IContactDocument } from '../models/contact.model';
import { IContact } from '../interfaces/contact.interface';
import sanitizeHtml from 'sanitize-html';
import nodemailer from 'nodemailer';

export const sendContactMessage = async (req: Request, res: Response) => {
  try {
    // Sanitize input to prevent XSS or malicious content
    const sanitized: Partial<IContact> = {
      name: sanitizeHtml(req.body.name || ''),
      email: sanitizeHtml(req.body.email || ''),
      subject: sanitizeHtml(req.body.subject || ''),
      message: sanitizeHtml(req.body.message || ''),
    };

    // Save to MongoDB
    await Contact.create(sanitized as IContactDocument);

    // Configure nodemailer transporter (using environment variables)
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail', // or your preferred service
    //   auth: {
    //     user: process.env.MAIL_USER,
    //     pass: process.env.MAIL_PASS,
    //   },
    // });

    // Mailer using Yahoo SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    
    // Verify SMTP connection
    await transporter.verify()
      .then(() => console.log('SMTP server is ready to send'))
      .catch(err => {
        console.error('SMTP verify failed:', err);
        throw err;
      });

    // Compose email content
    const mailOptions = {
      from: process.env.MAIL_USER,        // ✅ Your authorized sender
      to: process.env.MAIL_USER,          // ✅ Your inbox
      // replyTo: sanitized.email,        // ❌ Comment this out for Yahoo
      subject: sanitized.subject || 'Mosai Canvas Contact Message',
      text: `
        From: ${sanitized.name}
        Email: ${sanitized.email}
        Message: ${sanitized.message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Success response
    res.status(200).json({ message: 'Message sent and saved.' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      message: 'Failed to send message.',
      error: error instanceof Error ? error.message : error,
    });
  }
  console.log('MAIL_USER:', process.env.MAIL_USER);
  console.log('MAIL_PASS:', process.env.MAIL_PASS ? 'Set' : 'Missing');
};
