import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocialLinks } from '../models/social-links.model'; // Adjusted the path to match the correct structure
import Member from '../models/member.model'; // Adjusted the path to match the correct structure

@Injectable()
export class SocialLinksService {
  constructor(
    @InjectModel('SocialLinks') private socialLinksModel: Model<SocialLinks>,
    @InjectModel(Member.name) private memberModel: Model<typeof Member>,
  ) {}

  // 1. Create Social Links for a Member
  async createSocialLinks(memberId: string, socialLinks: Partial<SocialLinks>): Promise<SocialLinks> {
    const existingMember = await this.memberModel.findById(memberId);
    if (!existingMember) {
      throw new Error('Member not found');
    }

    const newSocialLinks = new this.socialLinksModel({ ...socialLinks, member: memberId });
    return newSocialLinks.save();
  }

  // 2. Get Social Links for a Member
  async getSocialLinks(memberId: string): Promise<SocialLinks> {
    const socialLinks = await this.socialLinksModel.findOne({ member: memberId });
    if (!socialLinks) {
      throw new Error('Social links not found');
    }
    return socialLinks;
  }

  // 3. Update Social Links for a Member
  async updateSocialLinks(memberId: string, socialLinks: Partial<SocialLinks>): Promise<SocialLinks> {
    const existingLinks = await this.socialLinksModel.findOneAndUpdate(
      { member: memberId },
      { $set: { ...socialLinks } },
      { new: true }, // Return the updated social links
    );

    if (!existingLinks) {
      throw new Error('Social links not found for this member');
    }
    return existingLinks;
  }

  // 4. Delete Social Links for a Member
  async deleteSocialLinks(memberId: string): Promise<any> {
    const deletedLinks = await this.socialLinksModel.deleteOne({ member: memberId });
    if (deletedLinks.deletedCount === 0) {
      throw new Error('No social links found for this member');
    }
    return { message: 'Social links deleted successfully' };
  }
}
