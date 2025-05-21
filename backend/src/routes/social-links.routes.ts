import express, { Request, Response } from 'express';
import SocialLinks from '../models/social-links.model';  // Import SocialLinks model
import Member from '../models/member.model';  // Import Member model

const router = express.Router();

// Create social links for a member
router.post('/:memberId', async (req: Request<{ memberId: string }, any, any>, res: Response) => {
  try {
    // Find the member by ID
    const member = await Member.findById(req.params.memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Create new social links for the member
    const socialLinks = await SocialLinks.create({
      ...req.body,
      member: member._id,  // Associate social links with this member
    });

    // Update the member's socialLinks field with the newly created social links
    member.socialLinks = socialLinks._id;
    await member.save();

    return res.status(201).json(socialLinks);  // Return the created social links
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });  // Handle errors
  }
});

// Get social links for a specific member
router.get('/:memberId', async (req: Request<{ memberId: string }>, res: Response) => {
  try {
    // Find social links by member ID
    const socialLinks = await SocialLinks.findOne({ member: req.params.memberId });
    if (!socialLinks) {
      return res.status(404).json({ message: 'Social links not found' });
    }

    return res.json(socialLinks);  // Return the social links
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });  // Handle errors
  }
});

export default router;
