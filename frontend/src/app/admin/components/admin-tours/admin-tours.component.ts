import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    inject,
  } from '@angular/core';
  
  import { CommonModule } from '@angular/common';
  
  import {
    FormBuilder,
    ReactiveFormsModule,
    Validators,
  } from '@angular/forms';
  
  import { RouterLink } from '@angular/router';
  
  import { Tour } from '../../../models/tour/tour.model';
  
  import {
    AdminToursService,
    CreateTourRequest,
    UpdateTourRequest,
  } from '../../services/admin-tours.service';
  
  @Component({
    selector: 'app-admin-tours',
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      RouterLink,
    ],
    templateUrl: './admin-tours.component.html',
    styleUrls: ['./admin-tours.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class AdminToursComponent implements OnInit {
    private readonly formBuilder = inject(FormBuilder);
  
    private readonly tourService = inject(AdminToursService);
  
    private readonly changeDetector = inject(ChangeDetectorRef);
  
    /**
     * Tour dates currently loaded from MongoDB.
     *
     * The server is authoritative for ordering.
     */
    tours: Tour[] = [];
  
    /**
     * Initial loading state.
     */
    isLoading = true;
  
    /**
     * Save operation state.
     */
    isSaving = false;
  
    /**
     * ID currently being deleted.
     */
    deletingId: string | null = null;
  
    /**
     * ID currently being edited.
     *
     * null means create mode.
     */
    editingId: string | null = null;
  
    /**
     * User-facing messages.
     */
    errorMessage = '';
  
    successMessage = '';
  
    /**
     * One form handles both create and edit.
     */
    readonly tourForm = this.formBuilder.nonNullable.group({
      date: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),
        ],
      ],
  
      band: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
        ],
      ],
  
      venue: [
        '',
        [
          Validators.required,
          Validators.maxLength(200),
        ],
      ],
  
      city: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
        ],
      ],
  
      state: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
        ],
      ],
    });
  
    ngOnInit(): void {
      this.loadTours();
    }
  
    /**
     * Load Tour Dates from the API.
     */
    loadTours(): void {
      this.isLoading = true;
      this.errorMessage = '';
  
      this.tourService.getTours().subscribe({
        next: (tours) => {
          this.tours = this.sortTours(tours);
  
          this.isLoading = false;
  
          this.changeDetector.markForCheck();
        },
  
        error: (error) => {
          console.error(
            'Failed to load Tour Dates.',
            error
          );
  
          this.tours = [];
  
          this.isLoading = false;
  
          this.errorMessage =
            error?.error?.message ??
            'Unable to load Tour Dates. Please try again.';
  
          this.changeDetector.markForCheck();
        },
      });
    }
  
    /**
     * Keep the admin list in chronological order.
     *
     * Date values are expected to be YYYY-MM-DD.
     */
    private sortTours(tours: Tour[]): Tour[] {
      return [...tours].sort((a, b) =>
        a.date.localeCompare(b.date)
      );
    }
  
    /**
     * Begin editing an existing Tour Date.
     */
    startEdit(tour: Tour): void {
      if (!tour._id) {
        return;
      }
  
      this.editingId = tour._id;
  
      this.errorMessage = '';
      this.successMessage = '';
  
      this.tourForm.reset({
        date: this.toDateInputValue(tour.date),
  
        band: tour.band ?? '',
  
        venue: tour.venue ?? '',
  
        city: tour.city ?? '',
  
        state: tour.state ?? '',
      });
  
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
  
      this.changeDetector.markForCheck();
    }
  
    /**
     * Convert the API date into the format required
     * by an HTML date input.
     */
    private toDateInputValue(value?: string): string {
      if (!value) {
        return '';
      }
  
      return value.substring(0, 10);
    }
  
    /**
     * Return the editor to create mode.
     */
    cancelEdit(): void {
      this.editingId = null;
  
      this.resetForm();
  
      this.errorMessage = '';
      this.successMessage = '';
  
      this.changeDetector.markForCheck();
    }
  
    /**
     * Reset the Tour form.
     */
    private resetForm(): void {
      this.tourForm.reset({
        date: '',
        band: '',
        venue: '',
        city: '',
        state: '',
      });
    }
  
    /**
     * Create or update a Tour Date.
     */
    save(): void {
      this.errorMessage = '';
      this.successMessage = '';
  
      if (this.tourForm.invalid) {
        this.tourForm.markAllAsTouched();
  
        this.changeDetector.markForCheck();
  
        return;
      }
  
      if (
        this.isSaving ||
        this.deletingId !== null
      ) {
        return;
      }
  
      const form = this.tourForm.getRawValue();
  
      const request: CreateTourRequest = {
        date: form.date.trim(),
  
        band: form.band.trim(),
  
        venue: form.venue.trim(),
  
        city: form.city.trim(),
  
        state: form.state.trim(),
      };
  
      this.isSaving = true;
  
      if (this.editingId) {
        this.update(
          this.editingId,
          request
        );
  
        return;
      }
  
      this.create(request);
    }
  
    /**
     * Create a new Tour Date.
     */
    private create(
      request: CreateTourRequest
    ): void {
      this.tourService
        .createTour(request)
        .subscribe({
          next: (createdTour) => {
            this.tours = this.sortTours([
              ...this.tours,
              createdTour,
            ]);
  
            this.isSaving = false;
  
            this.editingId = null;
  
            this.resetForm();
  
            this.successMessage =
              'Tour Date created successfully.';
  
            this.changeDetector.markForCheck();
          },
  
          error: (error) => {
            console.error(
              'Failed to create Tour Date.',
              error
            );
  
            this.isSaving = false;
  
            this.errorMessage =
              error?.error?.message ??
              'Unable to create Tour Date.';
  
            this.changeDetector.markForCheck();
          },
        });
    }
  
    /**
     * Update an existing Tour Date.
     */
    private update(
      id: string,
      request: UpdateTourRequest
    ): void {
      this.tourService
        .updateTour(id, request)
        .subscribe({
          next: (updatedTour) => {
            this.tours = this.sortTours(
              this.tours.map((tour) =>
                tour._id === updatedTour._id
                  ? updatedTour
                  : tour
              )
            );
  
            this.isSaving = false;
  
            this.editingId = null;
  
            this.resetForm();
  
            this.successMessage =
              'Tour Date updated successfully.';
  
            this.changeDetector.markForCheck();
          },
  
          error: (error) => {
            console.error(
              'Failed to update Tour Date.',
              error
            );
  
            this.isSaving = false;
  
            this.errorMessage =
              error?.error?.message ??
              'Unable to update Tour Date.';
  
            this.changeDetector.markForCheck();
          },
        });
    }
  
    /**
     * Delete a Tour Date.
     */
    delete(tour: Tour): void {
      if (
        this.deletingId ||
        this.isSaving ||
        !tour._id
      ) {
        return;
      }
  
      const displayName =
        `${tour.band} at ${tour.venue}`;
  
      const confirmed = window.confirm(
        `Delete "${displayName}"? This action cannot be undone.`
      );
  
      if (!confirmed) {
        return;
      }
  
      this.errorMessage = '';
      this.successMessage = '';
  
      this.deletingId = tour._id;
  
      this.changeDetector.markForCheck();
  
      this.tourService
        .deleteTour(tour._id)
        .subscribe({
          next: () => {
            this.tours = this.tours.filter(
              (existingTour) =>
                existingTour._id !== tour._id
            );
  
            if (
              this.editingId === tour._id
            ) {
              this.editingId = null;
  
              this.resetForm();
            }
  
            this.deletingId = null;
  
            this.successMessage =
              'Tour Date deleted successfully.';
  
            this.changeDetector.markForCheck();
          },
  
          error: (error) => {
            console.error(
              'Failed to delete Tour Date.',
              error
            );
  
            this.deletingId = null;
  
            this.errorMessage =
              error?.error?.message ??
              'Unable to delete Tour Date.';
  
            this.changeDetector.markForCheck();
          },
        });
    }
  
    get dateControl() {
      return this.tourForm.controls.date;
    }
  
    get bandControl() {
      return this.tourForm.controls.band;
    }
  
    get venueControl() {
      return this.tourForm.controls.venue;
    }
  
    get cityControl() {
      return this.tourForm.controls.city;
    }
  
    get stateControl() {
      return this.tourForm.controls.state;
    }
  }