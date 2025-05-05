import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from '../../services/members-bio/members.service';
import { Member } from '../../models/members-bio/member.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

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
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private memberService: MembersService
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