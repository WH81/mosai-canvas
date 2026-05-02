import { Request, Response, NextFunction } from 'express';
import * as MailingListService from '../services/mailing-list.service';
import { IMailingList } from '../interfaces/mailing-list.interface';
import nodemailer from 'nodemailer';

export const createMailingListEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data: IMailingList = req.body;

    // Attempt to create the entry
    const entry = await MailingListService.createEntry(data);

    // Send notification email
    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"MOSAI CANVAS" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: 'New Mailing List Subscriber!',
      text: `You have a new subscriber:\n\nName: ${entry.name}\nEmail: ${entry.email}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: 'Successfully subscribed!', entry });
  } catch (error: any) {
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern?.email) {
      res.status(400).json({ success: false, message: 'This email is already subscribed.' });
      return;
    }
    // Pass other errors to error middleware
    next(error);
  }
};

export const getAllMailingListEntries = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void> => { 
  try {
    const entries = await MailingListService.getAllEntries();
    res.status(200).json(entries);
  } catch (error) {
    next(error);
  }
};

export const getMailingListEntryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const entry = await MailingListService.getEntryById(id);

    if (!entry) {
      res.status(404).json({ message: 'Mailing list entry not found' });
      return;
    }

    res.status(200).json(entry);
  } catch (error) {
    next(error);
  }
};

export const updateMailingListEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ message: 'Invalid ID' });
      return;
    }
    const updated = await MailingListService.updateEntry(id, req.body);

    if (!updated) {
      res.status(404).json({ message: 'Mailing list entry not found' });
      return;
    }

    res.status(200).json(updated);
  } catch (error: any) {
    // Handle duplicate email on update
    if (error.code === 11000 && error.keyPattern?.email) {
      res.status(400).json({ success: false, message: 'This email is already subscribed.' });
      return;
    }
    next(error);
  }
};

export const deleteMailingListEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ message: 'Invalid ID' });
      return;
    }
    const deleted = await MailingListService.deleteEntry(id);

    if (!deleted) {
      res.status(404).json({ message: 'Mailing list entry not found' });
      return;
    }

    res.status(200).json({ message: 'Mailing list entry deleted successfully' });
  } catch (error) {
    next(error);
  }
};
