import { Component, OnInit } from '@angular/core';
import { MembersListComponent } from '../../components/members-list/members-list.component';
import { CommonModule } from '@angular/common'; // CommonModule is needed for ngIf, ngFor etc.

@Component({
  selector: 'app-canvas-catalyst',
  standalone: true,
  imports: [MembersListComponent, CommonModule],
  templateUrl: './canvas-catalyst.component.html',
  styleUrls: ['./canvas-catalyst.component.scss']
})
export class CanvasCatalystComponent {
  bandSlug: string = 'canvas-catalyst';

  constructor() {}

  ngOnInit(): void {
    // Any additional logic for the CanvasCatalystComponent
  }
}
