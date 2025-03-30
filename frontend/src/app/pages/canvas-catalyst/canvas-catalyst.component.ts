import { Component } from '@angular/core';

@Component({
  selector: 'app-canvas-catalyst',
  standalone: true,
  imports: [],
  templateUrl: './canvas-catalyst.component.html',
  styleUrls: ['./canvas-catalyst.component.scss']
})
export class CanvasCatalystComponent {
  canvasCatalystMembers = [
    { id: '1', name: 'Zakk Doe' },
    { id: '2', name: 'Ali Smith' },
    { id: '3', name: 'Heather Harris' }
  ];
}
