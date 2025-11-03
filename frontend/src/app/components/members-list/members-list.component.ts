import { Component, Input, OnChanges, SimpleChanges, Directive, ElementRef, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersService } from '../../services/members-bio/members.service';
import { Member } from '../../models/members-bio/member.model';

// --- Imports for Standalone Components ---
import { SocialLinksComponent } from '../social-links/social-links.component';
import { MemberBioModalComponent } from '../member-bio-modal/member-bio-modal.component';

// --- Scroll Animation Directive (Remains Standalone or is made Standalone) ---
@Directive({
  selector: '[appScrollAnimation]',
  standalone: true
})
export class ScrollAnimationDirective implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
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
  imports: [CommonModule, ScrollAnimationDirective, MemberBioModalComponent],
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
})
export class MembersListComponent implements OnChanges {
  @Input() bandSlug: string = '';
  members: Member[] = [];

  // --- MODAL STATE ---
  selectedMember: Member | null = null;
  isModalOpen: boolean = false;

  // --- RESTORED CARD STATE (Fixes "no members show" issue) ---
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
        // Restore logic to initialize expandedStates
        if (!this.expandedStates) {
          this.expandedStates = {};
        }
        this.members.forEach(m => {
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
   * Manages both the card's visual state and the modal's state.
   */
  toggleExpand(memberKey: string): void {
    const member = this.members.find(m => m.name === memberKey);

    // If the modal is already open for THIS member, close both modal and card
    if (this.selectedMember && this.selectedMember.name === memberKey) {
        this.handleModalClose();
    }
    // If a different member is clicked, open the modal and update card states
    else if (member) {
        // 1. Modal Logic
        this.selectedMember = member;
        this.isModalOpen = true;

        // 2. Card Visual State Logic
        Object.keys(this.expandedStates).forEach(k => this.expandedStates[k] = false);
        this.expandedStates[memberKey] = true;
    }
  }

  /**
   * Resets both modal and card states when the modal emits a close event.
   */
  handleModalClose(): void {
    this.isModalOpen = false;
    this.selectedMember = null;
    // Reset all card states to closed
    Object.keys(this.expandedStates).forEach(k => this.expandedStates[k] = false);
  }

  /**
   * Logic required by the member card HTML binding (fixes rendering issue).
   */
  isExpanded(memberKey: string): boolean {
    return !!this.expandedStates[memberKey];
  }

  trackByName(_: number, member: Member): string {
    return member.name;
  }
}