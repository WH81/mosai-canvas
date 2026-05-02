import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RingtoneService } from "../../services/ringtone/ringtone.service";
import { Ringtone } from "../../models/ringtone/ringtone.model";

interface UiRingtone extends Ringtone {
  showMenu?: boolean;
}

@Component({
  selector: "app-ringtones",
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: "./ringtones.component.html",
  styleUrls: ["./ringtones.component.scss"],
  providers: [RingtoneService]
})
export class RingtonesComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('ringtoneSlider') ringtoneSlider!: ElementRef;

  ringtones: UiRingtone[] = [];
  currentAudio: HTMLAudioElement | null = null;
  currentlyPlayingRingtoneUrl: string | null = null; 

  isAtStart: boolean = true;
  isAtEnd: boolean = false; // Will be updated by observer
  private resizeObserver?: ResizeObserver;

  constructor(
    private ringtoneService: RingtoneService,
    private cdr: ChangeDetectorRef // Added to prevent ExpressionChangedAfterItHasBeenCheckedError
  ) {}

  ngOnInit(): void {
    this.ringtoneService.getAll().subscribe((data) => {
      this.ringtones = data.map(r => ({ ...r, showMenu: false }));
    });
  }

  ngAfterViewInit(): void {
    // Watch for size changes to ensure buttons update when cards render
    this.resizeObserver = new ResizeObserver(() => {
      this.updateButtonStates();
      this.cdr.detectChanges(); 
    });

    if (this.ringtoneSlider) {
      this.resizeObserver.observe(this.ringtoneSlider.nativeElement);
    }

    // Fallback check after 1 second in case of slow image loading
    setTimeout(() => this.updateButtonStates(), 1000);
  }

  ngOnDestroy(): void {
    this.stopAudio();
    this.resizeObserver?.disconnect();
  }

  updateButtonStates(): void {
    if (!this.ringtoneSlider) return;
    const el = this.ringtoneSlider.nativeElement;
    
    // 1. Check if we are at the very beginning
    this.isAtStart = el.scrollLeft <= 10;

    // 2. Logic fix: A button is only 'at end' if there is scrollable content 
    // AND we have reached the right side.
    const hasScrollableContent = el.scrollWidth > el.clientWidth;
    const isScrolledToRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 15;

    // If there is no scrollable content yet, don't disable the 'Next' button
    // unless you want it disabled when there are very few ringtones.
    this.isAtEnd = hasScrollableContent ? isScrolledToRight : true;
  }

  scrollLeft(): void {
    this.ringtoneSlider.nativeElement.scrollBy({ left: -350, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.ringtoneSlider.nativeElement.scrollBy({ left: 350, behavior: 'smooth' });
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeAllMenus();
  }

  toggleDownloadMenu(event: Event, ringtone: UiRingtone): void {
    event.stopPropagation();
    const wasOpen = ringtone.showMenu;
    this.closeAllMenus();
    ringtone.showMenu = !wasOpen;
  }

  closeAllMenus(): void {
    this.ringtones.forEach(r => r.showMenu = false);
  }

  togglePlay(ringtone: UiRingtone): void {
    const previewUrl = ringtone.previewUrl;
    if (this.currentlyPlayingRingtoneUrl === previewUrl) {
      this.stopAudio();
      return;
    }
    this.stopAudio();
    this.currentAudio = new Audio(previewUrl);
    this.currentAudio.onended = () => {
      this.currentlyPlayingRingtoneUrl = null;
    };
    this.currentAudio.play().then(() => {
      this.currentlyPlayingRingtoneUrl = previewUrl;
    }).catch(err => console.error("Audio failed:", err));
  }

  private stopAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    this.currentlyPlayingRingtoneUrl = null;
  }
}