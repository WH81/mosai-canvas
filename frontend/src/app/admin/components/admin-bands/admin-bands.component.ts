import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { RouterLink } from '@angular/router';
  
  import { BandService } from '../../../services/band/band.service';
  import { Band } from '../../../models/band/band.model';
  
  @Component({
    selector: 'app-admin-bands',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './admin-bands.component.html',
    styleUrl: './admin-bands.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class AdminBandsComponent implements OnInit {
    bands: Band[] = [];
  
    isLoading = true;
    errorMessage = '';
  
    constructor(
      private readonly bandService: BandService,
      private readonly cdr: ChangeDetectorRef
    ) {}
  
    ngOnInit(): void {
      this.loadBands();
    }
  
    /**
     * Load all bands available for administration.
     */
    private loadBands(): void {
      this.isLoading = true;
      this.errorMessage = '';
  
      this.bandService.getBands().subscribe({
        next: (bands) => {
          this.bands = bands;
          this.isLoading = false;
  
          this.cdr.markForCheck();
        },
  
        error: () => {
          this.errorMessage = 'Unable to load bands.';
          this.isLoading = false;
  
          this.cdr.markForCheck();
        },
      });
    }
  }