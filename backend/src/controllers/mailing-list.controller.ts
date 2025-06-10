import { Request, Response, NextFunction } from 'express';
import * as MailingListService from '../services/mailing-list.service';
import { IMailingList } from '../interfaces/mailing-list.interface';
import nodemailer from 'nodemailer'; // ✅ Added for sending emails

export const createMailingListEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data: IMailingList = req.body;
    const entry = await MailingListService.createEntry(data);

    // ✅ Send email notification after successful DB save
    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 465,
      secure: true, // SSL for port 465
      auth: {
        user: process.env.NOTIFY_EMAIL,
        pass: process.env.NOTIFY_EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"MOSAICANVAS Website" <${process.env.NOTIFY_EMAIL}>`,
      to: 'waynehite@yahoo.com', // Replace with your actual email
      subject: 'New Mailing List Subscriber!',
      text: `You have a new subscriber:\n\nName: ${entry.name}\nEmail: ${entry.email}`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json(entry);
  } catch (error) {
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
  } catch (error) {
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
