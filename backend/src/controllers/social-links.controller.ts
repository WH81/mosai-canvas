import { Controller, Body, Param, Put } from '@nestjs/common';
import { SocialLinksService } from '../services/social-links.service';
import { SocialLinks } from '../models/social-links.model'; // Adjusted the path to match the correct structure

@Controller('social-links')
export class SocialLinksController {
  constructor(private readonly socialLinksService: SocialLinksService) {}

  @Put(':id')
  updateSocialLinks(@Param('id') id: string, @Body() socialLinks: SocialLinks): Promise<SocialLinks> {
    return this.socialLinksService.updateSocialLinks(id, socialLinks);
  }
}
