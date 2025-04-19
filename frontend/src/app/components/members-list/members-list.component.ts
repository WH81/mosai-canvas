import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersService } from '../../services/members-bio/members.service';
import { Member } from '../../models/members-bio/member.model';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
})
export class MembersListComponent implements OnChanges {
  @Input() bandSlug: string = ''; // Input from band-detail
  members: Member[] = [];

  constructor(private memberService: MembersService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger fetch if bandSlug changes and is defined
    if (changes['bandSlug'] && this.bandSlug) {
      this.fetchMembers();
    }
  }

  fetchMembers(): void {
    this.memberService.getMembersByBand(this.bandSlug).subscribe(
      (members: Member[]) => {
        this.members = members;
        console.log(`Fetched members for band ${this.bandSlug}:`, this.members);
      },
      (error: any) => {
        console.error('Error fetching members:', error);
      }
    );
  }
}
