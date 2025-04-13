import { Component, OnInit } from '@angular/core';
import { MembersListComponent } from '../../components/members-list/members-list.component';
import { CommonModule } from '@angular/common'; // CommonModule is needed for ngIf, ngFor etc.

@Component({
  selector: 'app-stained-glass-canvas',
  standalone: true,
  imports: [MembersListComponent, CommonModule],
  templateUrl: './stained-glass-canvas.component.html',
  styleUrls: ['./stained-glass-canvas.component.scss']
})
export class StainedGlassCanvasComponent {
  bandName: string = 'staind-glass-canvas';  // Band name for Stained Glass Canvas

  constructor() {}

  ngOnInit(): void {
    // Any additional logic for the StainedGlassCanvasComponent
  }
}
