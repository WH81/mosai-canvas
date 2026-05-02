import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Releases } from '../../../models/release/release.model';
import { ReleaseCardComponent } from '../release-card/release-card.component';

@Component({
  selector: 'app-past-releases',
  standalone: true,
  imports: [CommonModule, ReleaseCardComponent],
  templateUrl: './past-releases.component.html',
  styleUrls: ['./past-releases.component.scss']
})
export class PastReleasesComponent {
  @Input() releases: Releases[] = [];
  @Input() bandSlug!: string;
  @Output() action = new EventEmitter<{ type: string; release: Releases }>();

  onCardAction(event: { type: string; release: Releases }) {
    this.action.emit(event);
  }
}
