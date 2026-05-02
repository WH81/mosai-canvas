// import { Component, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { SocialLinks } from '../../models/social-links/social-links.model';

// @Component({
//   selector: 'app-social-links',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './social-links.component.html',
//   styleUrls: ['./social-links.component.scss']
// })

// export class SocialLinksComponent {
//   @Input() socialLinks?: SocialLinks;
//   @Input() size: 'small' | 'large' = 'large';
// }


import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialLinks } from '../../models/social-links/social-links.model';

@Component({
  selector: 'app-social-links',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.scss']
})

export class SocialLinksComponent {
  @Input() socialLinks?: SocialLinks;
  @Input() size: 'small' | 'large' = 'large';
  // 'default' = no dividers (Header), 'divided' = with bars (Bio), 'glass' = Home style
  @Input() variant: 'default' | 'divided' | 'glass' = 'default';

  /**
   * Transforms the SocialLinks object into a clean array for the template.
   * This ensures accessibility and easy looping.
   */
  get activeLinks() {
    if (!this.socialLinks) return [];
    
    const mapping = [
      { key: 'facebook', icon: 'fa-brands fa-facebook', label: 'Facebook' },
      { key: 'instagram', icon: 'fa-brands fa-instagram', label: 'Instagram' },
      { key: 'x', icon: 'fa-brands fa-x-twitter', label: 'X (Twitter)' },
      { key: 'youtube', icon: 'fa-brands fa-youtube', label: 'YouTube' },
      { key: 'tiktok', icon: 'fa-brands fa-tiktok', label: 'TikTok' }
    ];

    return mapping
      .filter(item => !!this.socialLinks![item.key as keyof SocialLinks])
      .map(item => ({
        url: this.socialLinks![item.key as keyof SocialLinks],
        icon: item.icon,
        label: item.label
      }));
  }
}
