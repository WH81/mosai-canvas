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
 
import { SocialLinksComponent } from '../social-links/social-links.component';
import { StreamingLinksComponent } from '../streaming-links/streaming-links.component';
 
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
      { threshold: 0.1 }
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
  selectedMember: any | null = null;
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
 
  // Groups members into rows of 3
  get memberRows(): Member[][] {
    const rows: Member[][] = [];
    for (let i = 0; i < this.members.length; i += 3) {
      rows.push(this.members.slice(i, i + 3));
    }
    return rows;
  }
 
  // Returns true if the selected member belongs to this row
  isInRow(row: Member[]): boolean {
    if (!this.selectedMember) return false;
    return row.some((m) => m.name === this.selectedMember.name);
  }
 
  toggleExpand(memberKey: string): void {
    const member = this.members.find((m) => m.name === memberKey);
 
    if (this.selectedMember && this.selectedMember.name === memberKey) {
      this.handleClose();
    } else if (member) {
      this.selectedMember = member;
      Object.keys(this.expandedStates).forEach(
        (k) => (this.expandedStates[k] = false)
      );
      this.expandedStates[memberKey] = true;
    }
  }
 
  handleClose(): void {
    this.selectedMember = null;
    Object.keys(this.expandedStates).forEach(
      (k) => (this.expandedStates[k] = false)
    );
  }
 
  isExpanded(memberKey: string): boolean {
    return !!this.expandedStates[memberKey];
  }
 
  trackByName(_: number, member: Member): string {
    return member.name;
  }
 
  trackByRow(index: number): number {
    return index;
  }
}