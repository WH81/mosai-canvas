import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  // Import ActivatedRoute
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
export class MembersListComponent implements OnInit {
  @Input() band: string = ''; // Use @Input() to receive the band name
  bandSlug: string = ''; // This will hold the band name (slug)
  members: Member[] = [];

  constructor(
    private route: ActivatedRoute,  // Inject ActivatedRoute to capture route params
    private memberService: MembersService
  ) {}

  ngOnInit(): void {
    // Capture the bandSlug parameter from the route
    this.bandSlug = this.route.snapshot.paramMap.get('bandSlug') || '';
    
    if (this.bandSlug) {
      this.fetchMembers(); // Fetch members by band name (slug)
    } else {
      console.error('Band slug is not provided');
    }
  }

  fetchMembers(): void {
    // Fetch members for the given band
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
