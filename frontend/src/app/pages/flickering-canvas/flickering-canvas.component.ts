import { Component, OnInit } from '@angular/core';
import { MembersListComponent } from '../../components/members-list/members-list.component';
import { CommonModule } from '@angular/common'; // CommonModule is needed for ngIf, ngFor etc.

@Component({
  selector: 'app-flickering-canvas',
  standalone: true,
  imports: [MembersListComponent, CommonModule],
  templateUrl: './flickering-canvas.component.html',
  styleUrls: ['./flickering-canvas.component.scss']
})
export class FlickeringCanvasComponent {
  bandName: string = 'flickering-canvas';

  constructor() {}

  ngOnInit(): void {
    // Any additional logic for the FlickeringCanvasComponent
  }
}
