import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mosaicanvas-logo',
  imports: [CommonModule],
  templateUrl: './mosaicanvas-logo.component.html',
  styleUrls: ['./mosaicanvas-logo.component.scss']
})
export class MosaicanvasLogoComponent {
  @Input() class: string = '';
  @Input() alt: string = 'MosaiCanvas Logo';
  @Input() width: string = '850px'; // Default for header usage
  @Input() height: string = '150px'; // Default for header usage
}
