import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersService } from '../../services/members-bio/members.service';
import { Member } from '../../models/members-bio/member.model';
import { SocialLinksComponent } from '../social-links/social-links.component';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [CommonModule, SocialLinksComponent],
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
})
export class MembersListComponent implements OnChanges {
  @Input() bandSlug: string = '';
  members: Member[] = [];
  // keep a stable object reference to avoid re-renders
  expandedStates: Record<string, boolean> = {};

  constructor(private memberService: MembersService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const bandSlugChange = changes['bandSlug'];
    if (bandSlugChange && bandSlugChange.currentValue !== bandSlugChange.previousValue && this.bandSlug) {
      this.fetchMembers();
    }
  }

  fetchMembers(): void {
    this.memberService.getMembersByBand(this.bandSlug).subscribe(
      (members: Member[]) => {
        this.members = members || [];

        // Ensure each member has a stable expanded key (don't replace the object)
        if (!this.expandedStates) {
          this.expandedStates = {};
        }
        this.members.forEach(m => {
          if (!(m.name in this.expandedStates)) {
            this.expandedStates[m.name] = false;
          }
        });
        // Optionally remove stale keys (not required; uncomment if you want cleanup)
        // Object.keys(this.expandedStates).forEach(k => { if (!this.members.find(m => m.name === k)) delete this.expandedStates[k]; });

      },
      (error: any) => {
        console.error('Error fetching members:', error);
      }
    );
  }

  /**
   * Toggle expand for a single member.
   * Mutates the existing expandedStates object (keeps reference stable).
   */
  toggleExpand(memberKey: string): void {
    if (this.expandedStates[memberKey]) {
      this.expandedStates[memberKey] = false;
    } else {
      // close others but keep same object reference
      Object.keys(this.expandedStates).forEach(k => this.expandedStates[k] = false);
      this.expandedStates[memberKey] = true;
    }
  }

  closeAllModals(): void {
    Object.keys(this.expandedStates).forEach(k => this.expandedStates[k] = false);
  }

  closeModal(memberKey: string): void {
    if (this.expandedStates[memberKey]) {
      this.expandedStates[memberKey] = false;
    }
  }

  isExpanded(memberKey: string): boolean {
    return !!this.expandedStates[memberKey];
  }

  trackByName(_: number, member: Member): string {
    return member.name;
  }
}
