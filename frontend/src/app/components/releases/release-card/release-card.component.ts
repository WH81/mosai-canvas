import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  Renderer2,
  OnDestroy,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Releases } from '../../../models/release/release.model';

@Component({
  selector: 'app-release-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './release-card.component.html',
  styleUrls: ['./release-card.component.scss']
})
export class ReleaseCardComponent implements OnDestroy {
  @Input() release!: Releases;
  @Input() featured: boolean = false;
  @Output() action = new EventEmitter<{ type: string; release: Releases }>();

  menuOpen = false;
  private onDocClickFn?: () => void;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  isPreRelease(): boolean {
    return this.release?.releaseDate ? new Date(this.release.releaseDate) > new Date() : false;
  }

  isReleased(): boolean {
    return this.release?.releaseDate ? new Date(this.release.releaseDate) <= new Date() : false;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.onDocClickFn = this.renderer.listen('document', 'click', (event: Event) => {
        if (!this.el.nativeElement.contains(event.target)) this.closeMenu();
      });
    } else {
      this.closeMenu();
    }
  }

  closeMenu(): void {
    this.menuOpen = false;
    if (this.onDocClickFn) {
      this.onDocClickFn();
      this.onDocClickFn = undefined;
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.menuOpen) this.closeMenu();
  }

  emit(type: string): void {
    this.closeMenu();

    switch (type) {
      case 'listen_spotify':
        this.openUrl(this.release.platforms?.spotify || this.release.spotifyUrl);
        break;
      case 'listen_apple':
        this.openUrl(this.release.platforms?.appleMusic || this.release.appleMusicUrl);
        break;
      case 'listen_youtube':
        this.openUrl(this.release.platforms?.youtube || this.release.youtubeUrl);
        break;
      case 'google':
        this.addGoogleCalendar();
        break;
      case 'ics':
        this.addAppleCalendar();
        break;
      default:
        this.action.emit({ type, release: this.release });
    }
  }

  private openUrl(url?: string): void {
    if (url) window.open(url, '_blank');
  }

  private addGoogleCalendar(): void {
    // Standard Google format: YYYYMMDDTHHMMSSZ
    const start = new Date(this.release.releaseDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const title = encodeURIComponent(`Release: ${this.release.title}`);
    const details = encodeURIComponent(`${this.release.calendarDescription || 'New track'} by ${this.release.artist}`);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${start}&details=${details}`;
    window.open(url, '_blank');
  }

  private addAppleCalendar(): void {
    const start = new Date(this.release.releaseDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${start}`,
      `DTEND:${start}`,
      `SUMMARY:Release: ${this.release.title}`,
      `DESCRIPTION:${this.release.calendarDescription || 'New track'} by ${this.release.artist}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${this.release.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  ngOnDestroy(): void {
    if (this.onDocClickFn) this.onDocClickFn();
  }
}