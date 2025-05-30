import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BandService } from '../../services/bands/band.service';
import { CommonModule } from '@angular/common';
import { MembersListComponent } from '../../components/members-list/members-list.component';
import { Subscription } from 'rxjs';
import { SocialLinksComponent } from '../social-links/social-links.component';
import { StreamingLinksComponent } from '../streaming-links/streaming-links.component';

@Component({
  selector: 'app-band-detail',
  standalone: true,
  imports: [CommonModule, MembersListComponent, SocialLinksComponent, StreamingLinksComponent],
  templateUrl: './band-detail.component.html',
  styleUrls: ['./band-detail.component.scss'],
})
export class BandDetailComponent implements OnInit, OnDestroy {
  band: any;
  private routeSub: Subscription | undefined;
  imageLoaded = false;

  constructor(
    private bandService: BandService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      const slug = params['bandSlug'];
      this.getBand(slug);
    });
  }

  getBand(slug: string): void {
    this.bandService.getBandBySlug(slug).subscribe(
      (data) => {
        this.band = data;

        // 🧠 Only run image load logic *after* band is fetched
        const img = new Image();
        img.src = this.band.image;
        img.onload = () => {
          this.imageLoaded = true;
        };
      },
      (error) => {
        console.error('Error fetching band data:', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
