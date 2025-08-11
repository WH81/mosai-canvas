import { Component, Input, OnChanges, SimpleChanges, Directive, ElementRef, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersService } from '../../services/members-bio/members.service';
import { Member } from '../../models/members-bio/member.model';
import { SocialLinksComponent } from '../social-links/social-links.component';

@Directive({
  selector: '[appScrollAnimation]'
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

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [CommonModule, SocialLinksComponent, ScrollAnimationDirective],
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
})
export class MembersListComponent implements OnChanges {
  @Input() bandSlug: string = '';
  members: Member[] = [];
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

  toggleExpand(memberKey: string): void {
    if (this.expandedStates[memberKey]) {
      this.expandedStates[memberKey] = false;
    } else {
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
