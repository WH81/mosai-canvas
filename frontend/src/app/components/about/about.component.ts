import { Component, OnInit } from '@angular/core';
import { AboutService } from '../../services/about/about.service';
import { About } from '../../models/about/about.model';
import { CommonModule } from '@angular/common'; // For common Angular directives like *ngIf

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [CommonModule],
})
export class AboutComponent implements OnInit {
  aboutList: About[] = []; // Store the fetched data
  loading: boolean = true; // Show loading indicator while waiting for data

  constructor(private aboutService: AboutService) {}

  ngOnInit(): void {
    this.getAboutData(); // Fetch the data when the component initializes
  }

  getAboutData() {
    this.aboutService.getAboutData().subscribe({
      next: (data: About[]) => {
        this.aboutList = data; // Store the fetched data in the about property
        this.loading = false; // Stop loading when data is fetched
      },
      error: (error) => {
        console.error('Error fetching About data', error);
        this.loading = false; // Stop loading even if there is an error
      },
    });
  }
}
