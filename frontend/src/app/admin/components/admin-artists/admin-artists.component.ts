import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { RouterLink } from '@angular/router';
  import { HttpErrorResponse } from '@angular/common/http';
  
  import { BandService } from '../../../services/band/band.service';
  import { Band } from '../../../models/band/band.model';
  
  @Component({
    selector: 'app-admin-artists',
    standalone: true,
    imports: [
      CommonModule,
      RouterLink,
    ],
    templateUrl: './admin-artists.component.html',
    styleUrl: './admin-artists.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class AdminArtistsComponent implements OnInit {
  
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
     * Load the available bands.
     *
     * Artists belong to individual bands, so the administrator
     * must select a band before managing its artists.
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
  
        error: (error: HttpErrorResponse) => {
          console.error('Failed to load bands.', error);
  
          this.bands = [];
          this.isLoading = false;
          this.errorMessage =
            error.error?.message ??
            'Unable to load bands.';
  
          this.cdr.markForCheck();
        },
      });
    }
  
    /**
     * Refresh the list of bands.
     */
    refresh(): void {
      if (this.isLoading) {
        return;
      }
  
      this.loadBands();
    }
  }