import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  RouterLink,
} from '@angular/router';

import {
  CarouselItem,
} from '../../../models/carousel/carousel.model';

import {
  AdminCarouselService,
  CreateCarouselRequest,
  UpdateCarouselRequest,
} from '../../services/admin-carousel.service';

@Component({
  selector: 'app-admin-carousel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl:
    './admin-carousel.component.html',
  styleUrls: [
    './admin-carousel.component.scss',
  ],
  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class AdminCarouselComponent
  implements OnInit {

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly carouselService =
    inject(AdminCarouselService);

  private readonly changeDetector =
    inject(ChangeDetectorRef);

  /**
   * Drag and drop state management.
   */
  draggedItemId: string | null = null;
  dragOverItemId: string | null = null;

  /**
   * Carousel records currently loaded
   * from MongoDB.
   *
   * The array order is the same order
   * displayed to the administrator.
   */
  carouselItems:
    CarouselItem[] = [];

  /**
   * Initial loading state.
   */
  isLoading = true;

  /**
   * Save operation state.
   */
  isSaving = false;

  /**
   * Reorder operation state.
   */
  isReordering = false;

  /**
   * ID currently being deleted.
   */
  deletingId:
    string | null = null;

  /**
   * ID currently being edited.
   *
   * null means create mode.
   */
  editingId:
    string | null = null;

  /**
   * User-facing messages.
   */
  errorMessage = '';
  successMessage = '';

  /**
   * One form handles both create and edit.
   */
  readonly carouselForm =
    this.formBuilder.nonNullable.group({

      imageUrl: [
        '',
        [
          Validators.required,
          Validators.maxLength(2048),
          Validators.pattern(
            /^https?:\/\/.+/i
          ),
        ],
      ],

      bandName: [
        '',
        [
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],

      songName: [
        '',
        [
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],

      releaseDate: [
        '',
        [
        ],
      ],

      buttonText: [
        '',
        [
          Validators.minLength(1),
          Validators.maxLength(50),
        ],
      ],

      buttonLink: [
        '',
        [
          Validators.maxLength(2048),
          Validators.pattern(
            /^https?:\/\/.+/i
          ),
        ],
      ],
    });

  ngOnInit(): void {
    this.loadCarousel();
  }

  /**
   * Load Carousel content.
   */
  loadCarousel(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.carouselService
      .getCarouselItems()
      .subscribe({
        next: (items) => {
          /**
           * Trust the server's authoritative ordering.
           */
          this.carouselItems =
            [...items].sort(
              (a, b) =>
                a.order - b.order
            );

          this.isLoading = false;

          this.changeDetector
            .markForCheck();
        },

        error: (error) => {
          console.error(
            'Failed to load Carousel content.',
            error
          );

          this.carouselItems = [];
          this.isLoading = false;

          this.errorMessage =
            'Unable to load Carousel content. Please try again.';

          this.changeDetector
            .markForCheck();
        },
      });
  }

  /**
   * Drag and drop handlers for template events
   */
  onDragStart(event: DragEvent, item: CarouselItem): void {
    this.draggedItemId = item._id;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent, item: CarouselItem): void {
    event.preventDefault();
    this.dragOverItemId = item._id;
    this.changeDetector.markForCheck();
  }

  onDrop(event: DragEvent, targetItem: CarouselItem): void {
    event.preventDefault();

    if (!this.draggedItemId || this.draggedItemId === targetItem._id) {
      this.onDragEnd();
      return;
    }

    const draggedIndex = this.carouselItems.findIndex(
      (item) => item._id === this.draggedItemId
    );
    const targetIndex = this.carouselItems.findIndex(
      (item) => item._id === targetItem._id
    );

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const updatedItems = [...this.carouselItems];
      const [movedItem] = updatedItems.splice(draggedIndex, 1);
      updatedItems.splice(targetIndex, 0, movedItem);

      this.carouselItems = updatedItems;
      this.saveOrder();
    } else {
      this.onDragEnd();
    }
  }

  onDragEnd(): void {
    this.draggedItemId = null;
    this.dragOverItemId = null;
    this.changeDetector.markForCheck();
  }

  /**
   * Called by the drag/drop UI after
   * the local array has been reordered.
   *
   * The component then persists the complete
   * order to MongoDB.
   */
  saveOrder(): void {
    if (
      this.isReordering ||
      this.isSaving ||
      this.deletingId !== null
    ) {
      return;
    }

    if (
      this.carouselItems.length < 2
    ) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isReordering = true;

    const itemIds =
      this.carouselItems.map(
        (item) => item._id
      );

    this.carouselService
      .reorderCarouselItems({
        orderedIds: itemIds,
      })
      .subscribe({
        next: (items) => {
          /**
           * Always use the database response
           * as the authoritative final order.
           */
          this.carouselItems =
            [...items].sort(
              (a, b) =>
                a.order - b.order
            );

          this.isReordering = false;

          this.successMessage =
            'Carousel order saved successfully.';

          this.onDragEnd();
        },

        error: (error) => {
          console.error(
            'Failed to save Carousel order.',
            error
          );

          this.isReordering = false;

          this.errorMessage =
            error?.error?.message ??
            'Unable to save Carousel order.';

          this.onDragEnd();

          /**
           * Reload the server state so the UI
           * cannot remain different from MongoDB.
           */
          this.loadCarousel();
        },
      });
  }

  /**
   * Begin editing an existing Carousel item.
   */
  startEdit(
    item: CarouselItem
  ): void {
    this.editingId =
      item._id;

    this.errorMessage = '';
    this.successMessage = '';

    this.carouselForm.reset({
      imageUrl:
        item.imageUrl ?? '',

      bandName:
        item.bandName ?? '',

      songName:
        item.songName ?? '',

      /**
       * The API now provides a date-only
       * YYYY-MM-DD value.
       */
      releaseDate:
        this.toDateInputValue(
          item.releaseDate
        ),

      buttonText:
        item.buttonText ?? '',

      buttonLink:
        item.buttonLink ?? '',
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    this.changeDetector
      .markForCheck();
  }

  /**
   * Convert an API date into the exact
   * format expected by HTML date input.
   *
   * Accepts optional string values to avoid TS errors.
   */
  private toDateInputValue(
    value?: string
  ): string {
    if (!value) {
      return '';
    }

    return value.substring(
      0,
      10
    );
  }

  /**
   * Return to create mode.
   */
  cancelEdit(): void {
    this.editingId = null;

    this.resetForm();

    this.errorMessage = '';
    this.successMessage = '';

    this.changeDetector
      .markForCheck();
  }

  /**
   * Reset the form.
   */
  private resetForm(): void {
    this.carouselForm.reset({
      imageUrl: '',
      bandName: '',
      songName: '',
      releaseDate: '',
      buttonText: '',
      buttonLink: '',
    });
  }

  /**
   * Save either a new Carousel item
   * or an existing one.
   */
  save(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      this.carouselForm.invalid
    ) {
      this.carouselForm
        .markAllAsTouched();

      this.changeDetector
        .markForCheck();

      return;
    }

    if (
      this.isSaving ||
      this.isReordering ||
      this.deletingId
    ) {
      return;
    }

    const form =
      this.carouselForm
        .getRawValue();

    const request:
      CreateCarouselRequest = {
        imageUrl:
          form.imageUrl.trim(),

        bandName:
          form.bandName?.trim() ?? '',

        songName:
          form.songName?.trim() ?? '',

        releaseDate:
          form.releaseDate ? form.releaseDate.trim() : '',

        buttonText:
          form.buttonText?.trim() ?? '',

        buttonLink:
          form.buttonLink?.trim() ?? '',
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
   * Create Carousel item.
   */
  private create(
    request: CreateCarouselRequest
  ): void {
    this.carouselService
      .createCarouselItem(
        request
      )
      .subscribe({
        next: (createdItem) => {
          this.carouselItems = [
            ...this.carouselItems,
            createdItem,
          ].sort(
            (a, b) =>
              a.order - b.order
          );

          this.isSaving = false;
          this.editingId = null;

          this.resetForm();

          this.successMessage =
            'Carousel item created successfully.';

          this.changeDetector
            .markForCheck();
        },

        error: (error) => {
          console.error(
            'Failed to create Carousel item.',
            error
          );

          this.isSaving = false;

          this.errorMessage =
            error?.error?.message ??
            'Unable to create Carousel item.';

          this.changeDetector
            .markForCheck();
        },
      });
  }

  /**
   * Update Carousel item.
   */
  private update(
    id: string,
    request: UpdateCarouselRequest
  ): void {
    this.carouselService
      .updateCarouselItem(
        id,
        request
      )
      .subscribe({
        next: (updatedItem) => {
          this.carouselItems =
            this.carouselItems.map(
              (item) =>
                item._id ===
                updatedItem._id
                  ? updatedItem
                  : item
            );

          this.isSaving = false;
          this.editingId = null;

          this.resetForm();

          this.successMessage =
            'Carousel item updated successfully.';

          this.changeDetector
            .markForCheck();
        },

        error: (error) => {
          console.error(
            'Failed to update Carousel item.',
            error
          );

          this.isSaving = false;

          this.errorMessage =
            error?.error?.message ??
            'Unable to update Carousel item.';

          this.changeDetector
            .markForCheck();
        },
      });
  }

  /**
   * Delete Carousel item.
   */
  delete(
    item: CarouselItem
  ): void {
    if (
      this.deletingId ||
      this.isSaving ||
      this.isReordering
    ) {
      return;
    }

    const displayName = item.songName || item.bandName || 'this item';
    const confirmed =
      window.confirm(
        `Delete "${displayName}"? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.deletingId =
      item._id;

    this.changeDetector
      .markForCheck();

    this.carouselService
      .deleteCarouselItem(
        item._id
      )
      .subscribe({
        next: () => {
          this.carouselItems =
            this.carouselItems.filter(
              (existingItem) =>
                existingItem._id !==
                item._id
            );

          if (
            this.editingId ===
            item._id
          ) {
            this.editingId = null;
            this.resetForm();
          }

          this.deletingId = null;

          this.successMessage =
            'Carousel item deleted successfully.';

          this.changeDetector
            .markForCheck();
        },

        error: (error) => {
          console.error(
            'Failed to delete Carousel item.',
            error
          );

          this.deletingId = null;

          this.errorMessage =
            error?.error?.message ??
            'Unable to delete Carousel item.';

          this.changeDetector
            .markForCheck();
        },
      });
  }

  get imageUrlControl() {
    return this.carouselForm.controls.imageUrl;
  }

  get bandNameControl() {
    return this.carouselForm.controls.bandName;
  }

  get songNameControl() {
    return this.carouselForm.controls.songName;
  }

  get releaseDateControl() {
    return this.carouselForm.controls.releaseDate;
  }

  get buttonTextControl() {
    return this.carouselForm.controls.buttonText;
  }

  get buttonLinkControl() {
    return this.carouselForm.controls.buttonLink;
  }
}