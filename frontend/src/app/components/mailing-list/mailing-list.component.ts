import { Component, HostListener, Inject } from '@angular/core';
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
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class MailingListComponent {
  newEntry: MailingList = { firstName: '', lastName: '', email: '' };
  submissionSuccess = false;
  submissionError: string = '';
  submitting = false;

  constructor(
    private mailingListService: MailingListService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollOffset =
      window.pageYOffset ||
      this.document.documentElement.scrollTop ||
      this.document.body.scrollTop ||
      0;
    this.document.documentElement.style.setProperty(
      '--scroll-parallax',
      `${scrollOffset * 0.1}px`
    );
  }

  addEntry(form: NgForm) {
    if (form.invalid) return;

    this.submitting = true;
    this.submissionSuccess = false;
    this.submissionError = '';

    const payload = {
      firstName: this.newEntry.firstName.trim(),
      lastName: this.newEntry.lastName.trim(),
      email: this.newEntry.email.trim().toLowerCase(),
    };

    this.mailingListService.subscribe(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.submissionSuccess = true;
        this.newEntry = { firstName: '', lastName: '', email: '' };
        form.resetForm();
        setTimeout(() => (this.submissionSuccess = false), 5000);
      },
      error: (err) => {
        this.submitting = false;
        this.submissionError =
          err.error?.message || 'An unexpected error occurred.';
      },
    });
  }
}