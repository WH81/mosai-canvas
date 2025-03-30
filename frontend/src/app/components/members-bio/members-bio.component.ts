import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../services/members-bio/members.service'; // Service for fetching member data
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Member } from '../../models/members-bio/member.model';

@Component({
  selector: 'app-member-bio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-bio.component.html',
  styleUrls: ['./member-bio.component.scss']
})
export class MemberBioComponent implements OnInit {
  memberId: string | null = null;
  memberData: Member | null = null;
  errorMessage: string | null = null; // Add an error message for error handling

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService // Service to get member details
  ) {}

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('id');
    if (this.memberId) {
      this.memberService.getMember(this.memberId).subscribe(
        (value: Member) => {
          this.memberData = value; // Assign fetched data to the memberData variable
        },
        (error: any) => {
          console.error('Error fetching member data:', error);
          this.errorMessage = 'Failed to load member details.';
        }
      );
    }
  }
}