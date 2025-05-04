import { Component, OnInit } from '@angular/core';
import { MembersListComponent } from '../../components/members-list/members-list.component';
import { CommonModule } from '@angular/common'; // CommonModule is needed for ngIf, ngFor etc.

@Component({
  selector: 'app-rye-canvas',
  standalone: true,
  imports: [MembersListComponent, CommonModule],
  templateUrl: './rye-canvas.component.html',
  styleUrls: ['./rye-canvas.component.scss']
})
export class RyeCanvasComponent {
  bandSlug: string = 'rye-canvas';

  constructor() {}

  ngOnInit(): void {
    // Any additional logic for the StainedGlassCanvasComponent
  }
}
