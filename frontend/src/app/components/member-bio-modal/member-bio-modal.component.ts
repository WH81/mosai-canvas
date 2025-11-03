import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../models/members-bio/member.model'; 
import { SocialLinksComponent } from '../social-links/social-links.component';

@Component({
  selector: 'app-member-bio-modal',
  standalone: true,
  imports: [CommonModule, SocialLinksComponent],
  templateUrl: './member-bio-modal.component.html',
  styleUrl: './member-bio-modal.component.scss'
})
export class MemberBioModalComponent {
  // --- INPUTS TO RECEIVE DATA/STATE FROM PARENT ---
  @Input() memberData: Member | null = null; 
  @Input() isOpen: boolean = false;         

  // --- OUTPUT TO COMMUNICATE CLOSE ACTION TO PARENT ---
  @Output() closeEvent = new EventEmitter<void>();

  /**
   * Emits the close event when the button or backdrop is clicked.
   */
  closeModal(): void {
    this.closeEvent.emit();
  }
}