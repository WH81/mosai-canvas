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
  // Use a Record to track the expanded state for each member, using their name as a key.
  expandedStates: Record<string, boolean> = {};

  constructor(private memberService: MembersService) {}

  /**
   * Lifecycle hook that responds when Angular sets or resets data-bound input properties.
   * Fetches members when the 'bandSlug' input changes to ensure the list is up-to-date.
   * @param changes A SimpleChanges object containing the current and previous input values.
   */
  ngOnChanges(changes: SimpleChanges): void {
    const bandSlugChange = changes['bandSlug'];
    // Check if bandSlug exists and has actually changed to avoid unnecessary fetches
    if (bandSlugChange && bandSlugChange.currentValue !== bandSlugChange.previousValue && this.bandSlug) {
      console.log('bandSlug input changed to:', this.bandSlug);
      this.fetchMembers();
    }
  }

  /**
   * Fetches members data based on the current bandSlug from the MembersService.
   * Resets the expanded states for all members when new data is loaded, ensuring all cards are collapsed initially.
   */
  fetchMembers(): void {
    this.memberService.getMembersByBand(this.bandSlug).subscribe(
      (members: Member[]) => {
        this.members = members;
        // Reset expanded state for all members when new data is fetched
        this.expandedStates = {};
      },
      (error: any) => {
        console.error('Error fetching members:', error);
        // Implement more robust error handling for the user if necessary, e.g., show a message
      }
    );
  }

  /**
   * Toggles the expanded (bio) state of a specific member's card.
   * @param memberKey A unique identifier for the member, typically their name.
   */
  toggleExpand(memberKey: string): void {
    this.expandedStates[memberKey] = !this.expandedStates[memberKey];
  }

  /**
   * Checks if a specific member's card is currently in the expanded state.
   * @param memberKey A unique identifier for the member.
   * @returns `true` if the card is expanded, `false` otherwise.
   */
  isExpanded(memberKey: string): boolean {
    // Using `!!` to convert potentially undefined/null values to a strict boolean
    return !!this.expandedStates[memberKey];
  }
}
