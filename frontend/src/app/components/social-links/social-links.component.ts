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
  @Input() links?: SocialLinks;
  @Input() size: 'small' | 'large' = 'small';
}
