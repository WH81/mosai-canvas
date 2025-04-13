import { Component, OnInit } from '@angular/core';
import { MembersListComponent } from '../../components/members-list/members-list.component'; // Correct path
import { CommonModule } from '@angular/common'; // CommonModule is needed for ngIf, ngFor etc.

@Component({
  selector: 'app-wailing-canvas',
  standalone: true,
  imports: [MembersListComponent, CommonModule],
  templateUrl: './wailing-canvas.component.html',
  styleUrls: ['./wailing-canvas.component.scss']
})
export class WailingCanvasComponent {
  bandName: string = 'wailing-canvas';

  constructor() {}

  ngOnInit(): void {}
}
