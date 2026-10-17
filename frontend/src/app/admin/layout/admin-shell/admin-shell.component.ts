import {
    ChangeDetectionStrategy,
    Component,
  } from '@angular/core';
  
  import { RouterOutlet } from '@angular/router';
  
  import { AdminHeaderComponent } from '../../components/admin-header/admin-header.component';
  
  @Component({
    selector: 'app-admin-shell',
    standalone: true,
    imports: [
      RouterOutlet,
      AdminHeaderComponent,
    ],
    templateUrl: './admin-shell.component.html',
    styleUrls: ['./admin-shell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class AdminShellComponent {}