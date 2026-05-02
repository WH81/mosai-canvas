import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Releases } from '../../../models/release/release.model';
import { ReleaseCardComponent } from '../release-card/release-card.component';

@Component({
  selector: 'app-pre-releases',
  standalone: true,
  imports: [CommonModule, ReleaseCardComponent],
  templateUrl: './pre-releases.component.html',
  styleUrls: ['./pre-releases.component.scss']
})
export class PreReleasesComponent {
  @Input() releases: Releases[] = [];
  @Input() bandSlug!: string;
  @Output() action = new EventEmitter<{ type: string; release: Releases }>();

  onCardAction(event: { type: string; release: Releases }) {
    this.action.emit(event);
  }
}
