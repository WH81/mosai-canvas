import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../services/members-bio/members.service';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit {
  band: string | null = null;
  members: any[] = []; // Array to hold members for the current band

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService // Service to fetch members
  ) {}

  ngOnInit(): void {
    // Get the band name from route data
    this.band = this.route.snapshot.data['band'];
    this.fetchMembersList();
  }

  fetchMembersList(): void {
    if (this.band) {
      // Call the service to fetch members based on the band name
      this.memberService.getMembersByBand(this.band).subscribe((data: any) => {
        this.members = data;
      });
    }
  }
}
