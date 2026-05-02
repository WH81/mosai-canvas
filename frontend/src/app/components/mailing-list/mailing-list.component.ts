import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { MailingListService } from '../../services/mailing-list/mailing-list.service';
import { MailingList } from '../../models/mailing-list/mailing-list.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-mailing-list',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './mailing-list.component.html',
  styleUrls: ['./mailing-list.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }), 
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class MailingListComponent implements OnInit {
  entries: MailingList[] = [];
  newEntry: MailingList = { email: '', name: '' };
  submissionSuccess = false;
  submissionError: string = '';
  submitting = false;

  constructor(
    private mailingListService: MailingListService,
    @Inject(DOCUMENT) private document: Document // Inject Document for CSS variable access
  ) {}

  ngOnInit() {
    this.fetchEntries();
  }

  /**
   * 👉 THE PARALLAX LOGIC
   * This listens to the window scroll and updates a CSS variable.
   * The multiplier (0.2) controls the speed of the slide.
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollOffset = window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    
    // We apply the variable to the document root so the SCSS can pick it up
    this.document.documentElement.style.setProperty('--scroll-parallax', `${scrollOffset * 0.1}px`);
  }

  fetchEntries() {
    this.mailingListService.getAll().subscribe(data => this.entries = data);
  }

  addEntry(form: NgForm) {
    if (form.invalid) return;

    this.submitting = true;
    this.submissionSuccess = true; 
    this.submissionError = '';

    const tempEntry = { ...this.newEntry }; 
    this.newEntry = { email: '', name: '' };
    form.resetForm();

    setTimeout(() => this.submissionSuccess = false, 4000);

    this.mailingListService.create(tempEntry).subscribe({
      next: () => {
        this.submitting = false;
        this.entries.push(tempEntry);
      },
      error: (err) => {
        this.submitting = false;
        this.submissionSuccess = false;
        this.submissionError = err.error?.message || 'An unexpected error occurred.';
        this.newEntry = tempEntry;
      }
    });
  }

  deleteEntry(id: string) {
    this.mailingListService.delete(id).subscribe(() => this.fetchEntries());
  }
}

export type { MailingList };