import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Directive,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersService } from '../../services/members-bio/members.service';
import { Member } from '../../models/members-bio/member.model';

// --- Imports for Standalone Components ---
import { SocialLinksComponent } from '../social-links/social-links.component';
import { StreamingLinksComponent } from '../streaming-links/streaming-links.component';

// --- Scroll Animation Directive ---
@Directive({
  selector: '[appScrollAnimation]',
  standalone: true,
})
export class ScrollAnimationDirective implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(this.el.nativeElement, 'scrolled-in');
            this.observer?.unobserve(this.el.nativeElement);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}

// --- Members List Component (Parent) ---
@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [
    CommonModule,
    ScrollAnimationDirective,
    SocialLinksComponent,
    StreamingLinksComponent,
  ],
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
})
export class MembersListComponent implements OnChanges {
  @Input() bandSlug: string = '';
  members: Member[] = [];

  // --- FOOTER TRAY STATE ---
  selectedMember: any | null = null; // Changed to any to allow dynamic bio/socials properties

  // --- CARD VISUAL STATE ---
  expandedStates: Record<string, boolean> = {};

  constructor(private memberService: MembersService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const bandSlugChange = changes['bandSlug'];
    if (
      bandSlugChange &&
      bandSlugChange.currentValue !== bandSlugChange.previousValue &&
      this.bandSlug
    ) {
      this.fetchMembers();
    }
  }

  fetchMembers(): void {
    this.memberService.getMembersByBand(this.bandSlug).subscribe(
      (members: Member[]) => {
        this.members = members || [];
        if (!this.expandedStates) {
          this.expandedStates = {};
        }
        this.members.forEach((m) => {
          if (!(m.name in this.expandedStates)) {
            this.expandedStates[m.name] = false;
          }
        });
      },
      (error: any) => {
        console.error('Error fetching members:', error);
      }
    );
  }

  /**
   * Manages the active member selection and expands the footer tray.
   */
  toggleExpand(memberKey: string): void {
    const member = this.members.find((m) => m.name === memberKey);

    // If clicking the same member, collapse everything
    if (this.selectedMember && this.selectedMember.name === memberKey) {
      this.handleClose();
    }
    // Otherwise, select the new member and expand the footer tray
    else if (member) {
      this.selectedMember = member;

      // Reset all card visual states and highlight only the active one
      Object.keys(this.expandedStates).forEach(
        (k) => (this.expandedStates[k] = false)
      );
      this.expandedStates[memberKey] = true;
    }
  }

  /**
   * Collapses the footer and resets card highlights.
   */
  handleClose(): void {
    this.selectedMember = null;
    Object.keys(this.expandedStates).forEach(
      (k) => (this.expandedStates[k] = false)
    );
  }

  /**
   * Logic for template binding to determine active card visual state.
   */
  isExpanded(memberKey: string): boolean {
    return !!this.expandedStates[memberKey];
  }

  trackByName(_: number, member: Member): string {
    return member.name;
  }
}
