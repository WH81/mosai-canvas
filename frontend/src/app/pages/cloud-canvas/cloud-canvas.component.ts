import { Component, OnInit } from '@angular/core';
import { MembersListComponent } from '../../components/members-list/members-list.component';
import { CommonModule } from '@angular/common'; // CommonModule is needed for ngIf, ngFor etc.

@Component({
  selector: 'app-cloud-canvas',
  standalone: true,
  imports: [MembersListComponent, CommonModule],
  templateUrl: './cloud-canvas.component.html',
  styleUrls: ['./cloud-canvas.component.scss']
})
export class CloudCanvasComponent {
  bandSlug: string = 'cloud-canvas';

  constructor() {}
  
  ngOnInit(): void {
    // Any additional logic for the CloudCanvasComponent
  }
}