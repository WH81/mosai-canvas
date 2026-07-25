import { Request, Response, NextFunction } from 'express';
import * as MailingListService from '../services/mailing-list.service';
import * as SenderService from '../services/sender.service';
import { IMailingList } from '../interfaces/mailing-list.interface';

/**
 * POST /api/mailing-list
 * Subscribe a new user — saves to MongoDB and adds to Sender.net
 */
export const createMailingListEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { firstName, lastName, email }: IMailingList = req.body;

    // Validate required fields
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required.',
      });
      return;
    }

    // Check for existing subscriber
    const existing = await MailingListService.getEntryByEmail(email);
    if (existing) {
      if (existing.isSubscribed) {
        res.status(400).json({
          success: false,
          message: 'This email is already subscribed.',
        });
        return;
      }

      // Re-subscribe if previously unsubscribed
      if (existing.senderSubscriberId) {
        await SenderService.addSubscriber(firstName, lastName, email);
      }

      const updated = await MailingListService.updateEntryByEmail(email, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        isSubscribed: true,
        subscribedAt: new Date(),
      });

      res.status(200).json({
        success: true,
        message: 'Welcome back to the Collective!',
        entry: updated,
      });
      return;
    }

    // Add to Sender.net first — if this fails we don't save to MongoDB
    const senderSubscriber = await SenderService.addSubscriber(
      firstName.trim(),
      lastName.trim(),
      email.trim()
    );

    // Save to MongoDB with Sender.net subscriber ID
    const entry = await MailingListService.createEntry({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      senderSubscriberId: senderSubscriber.id,
      isSubscribed: true,
    });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed!',
      entry,
    });
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern?.email) {
      res.status(400).json({
        success: false,
        message: 'This email is already subscribed.',
      });
      return;
    }
    next(error);
  }
};

/**
 * POST /api/mailing-list/unsubscribe
 * Unsubscribe a user — updates MongoDB and Sender.net
 */
export const unsubscribeEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
      return;
    }

    const entry = await MailingListService.getEntryByEmail(email);

    if (!entry) {
      res.status(404).json({
        success: false,
        message: 'Email not found.',
      });
      return;
    }

    if (!entry.isSubscribed) {
      res.status(400).json({
        success: false,
        message: 'This email is already unsubscribed.',
      });
      return;
    }

    // Unsubscribe from Sender.net
    if (entry.senderSubscriberId) {
      await SenderService.unsubscribeSubscriber(entry.senderSubscriberId);
    }

    // Update MongoDB
    await MailingListService.updateEntryByEmail(email, {
      isSubscribed: false,
    });

    res.status(200).json({
      success: true,
      message: 'You have been unsubscribed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/mailing-list
 * Admin only — get all subscribers
 */
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

/**
 * GET /api/mailing-list/:id
 */
export const getMailingListEntryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      res.status(400).json({ message: 'Invalid ID' });
      return;
    }

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

/**
 * PUT /api/mailing-list/:id
 */
export const updateMailingListEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params['id'] as string;
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
    if (error.code === 11000 && error.keyPattern?.email) {
      res.status(400).json({
        success: false,
        message: 'This email is already subscribed.',
      });
      return;
    }
    next(error);
  }
};

/**
 * DELETE /api/mailing-list/:id
 */
export const deleteMailingListEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      res.status(400).json({ message: 'Invalid ID' });
      return;
    }

    const deleted = await MailingListService.deleteEntry(id);
    if (!deleted) {
      res.status(404).json({ message: 'Mailing list entry not found' });
      return;
    }

    res.status(200).json({
      message: 'Mailing list entry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
