import { Component, OnInit } from '@angular/core';
import { MailingListService } from '../../services/mailing-list/mailing-list.service';
import { MailingList } from '../../models/mailing-list/mailing-list.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsModule, NgForm } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-mailing-list',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './mailing-list.component.html',
  styleUrls: ['./mailing-list.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms ease-in', style({ opacity: 1 }))])
    ])
  ]
})
export class MailingListComponent implements OnInit {
  entries: MailingList[] = [];
  newEntry: MailingList = { email: '', name: '' };
  submissionSuccess = false;

  constructor(private mailingListService: MailingListService) {}

  ngOnInit() {
    this.fetchEntries();
  }

  fetchEntries() {
    this.mailingListService.getAll().subscribe(data => this.entries = data);
  }

  addEntry(form: NgForm) {
    if (form.invalid) return;
  
    this.mailingListService.create(this.newEntry).subscribe(() => {
      this.newEntry = { email: '', name: '' };
      form.resetForm(); // Reset form fields and state
      this.submissionSuccess = true;
  
      // Hide thank you message after 5 seconds
      setTimeout(() => {
        this.submissionSuccess = false;
      }, 5000);
    });
  }
  
  deleteEntry(id: string) {
    this.mailingListService.delete(id).subscribe(() => this.fetchEntries());
  }
}

export type { MailingList };
