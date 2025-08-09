import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

/** Strongly‑typed reactive form */
type ContactFormGroup = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  subject: FormControl<string>;
  message: FormControl<string>;
}>;

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  submitted = false;
  sending = false;
  successMessage = '';
  errorMessage = '';
  contactForm!: ContactFormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.contactForm = this.fb.nonNullable.group({
      name: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      email: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.email,
      ]),
      subject: this.fb.nonNullable.control('', [
        Validators.maxLength(100),
      ]),
      message: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000),
      ]),
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = this.errorMessage = '';

    if (this.contactForm.invalid) return;

    this.sending = true;

    this.http.post('/api/contact', this.contactForm.value).subscribe({
      next: () => {
        this.successMessage = '🎉 Thanks!  Your message was sent.';
        this.contactForm.reset();
        this.submitted = false;
        this.sending = false;
      },
      error: () => {
        this.errorMessage =
          '⚠️ Sorry—something went wrong. Please try again later.';
        this.sending = false;
      },
    });
  }

  /** Shorthand for template access */
  get f() {
    return this.contactForm.controls;
  }
}
