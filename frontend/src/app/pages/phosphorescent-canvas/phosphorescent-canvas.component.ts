import { Component, OnInit } from '@angular/core';
import { MembersListComponent } from '../../components/members-list/members-list.component';
import { CommonModule } from '@angular/common'; // CommonModule is needed for ngIf, ngFor etc.

@Component({
  selector: 'app-phosphorescent-canvas',
  standalone: true,
  imports: [MembersListComponent, CommonModule],
  templateUrl: './phosphorescent-canvas.component.html',
  styleUrls: ['./phosphorescent-canvas.component.scss']
})
export class PhosphorescentCanvasComponent {
  bandName: string = 'phosphorescent-canvas';

  constructor() {}

  ngOnInit(): void {
    // Any additional logic for the StainedGlassCanvasComponent
  }
}
