// // 1. Move Component, OnInit, signal, and inject to @angular/core
// import { Component, OnInit, signal, inject } from '@angular/core';

// // 2. Keep NgOptimizedImage and CommonModule in @angular/common
// import { CommonModule, NgOptimizedImage } from '@angular/common';

// // 3. Keep HttpClient in @angular/common/http
// import { HttpClient, HttpClientModule } from '@angular/common/http';

// // 4. Keep animations in @angular/animations
// import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

// @Component({
//   selector: 'app-art',
//   standalone: true,
//   imports: [CommonModule, NgOptimizedImage, HttpClientModule],
//   templateUrl: './art.component.html',
//   styleUrls: ['./art.component.scss'],
//   animations: [
//     trigger('galleryAnimation', [
//       transition(':enter', [
//         query('.art-card', [
//           style({ opacity: 0, transform: 'translateY(40px) scale(0.95)' }),
//           stagger(60, [
//             animate('0.7s cubic-bezier(0.19, 1, 0.22, 1)', 
//             style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
//           ])
//         ], { optional: true })
//       ])
//     ])
//   ]
// })
// export class ArtComponent implements OnInit {
//   private http = inject(HttpClient);
  
//   // 2026 Signal-based state management
//   artCollection = signal<any[]>([]);
//   isLoading = signal<boolean>(true);
//   errorStatus = signal<string | null>(null);

//   ngOnInit(): void {
//     this.loadGalleryData();
//   }

//   loadGalleryData(): void {
//     this.http.get<any[]>('/api/gallery').subscribe({
//       next: (data) => {
//         this.artCollection.set(data);
//         this.isLoading.set(false);
//       },
//       error: (err) => {
//         console.error('Vault Access Error:', err);
//         this.errorStatus.set('Failed to load the gallery.');
//         this.isLoading.set(false);
//       }
//     });
//   }
// }


import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-art',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, HttpClientModule],
  templateUrl: './art.component.html',
  styleUrls: ['./art.component.scss'],
  animations: [
    trigger('galleryAnimation', [
      transition(':enter', [
        query('.art-card', [
          style({ opacity: 0, transform: 'translateY(40px) scale(0.95)' }),
          stagger(60, [
            animate('0.7s cubic-bezier(0.19, 1, 0.22, 1)', 
            style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
          ])
        ], { optional: true })
      ])
    ]),
    // New animation for the modal
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.2s ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ArtComponent implements OnInit {
  private http = inject(HttpClient);
  
  artCollection = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  errorStatus = signal<string | null>(null);

  // Track the currently selected image for the modal
  selectedArt = signal<any | null>(null);

  ngOnInit(): void {
    this.loadGalleryData();
  }

  loadGalleryData(): void {
    this.http.get<any[]>('/api/gallery').subscribe({
      next: (data) => {
        this.artCollection.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Vault Access Error:', err);
        this.errorStatus.set('Failed to load the gallery.');
        this.isLoading.set(false);
      }
    });
  }

  openModal(item: any): void {
    this.selectedArt.set(item);
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  }

  closeModal(): void {
    this.selectedArt.set(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  }
}
