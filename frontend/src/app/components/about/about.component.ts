import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for API calls
import { AboutService } from '../../services/about/about.service'; // Service to get About content
import { About } from '../../models/about/about.model'; // Model for About data
import { CommonModule } from '@angular/common'; // Import CommonModule for directives like *ngIf

@Component({
  selector: 'app-about',
  standalone: true,  // Standalone component
  templateUrl: './about.component.html', // Template for the About component
  styleUrls: ['./about.component.css'], // Styles for the About component
  imports: [CommonModule], // Import CommonModule to use *ngIf
  providers: [],  
})
export class AboutComponent implements OnInit {
  about: About = { title: '', body: '' }; // Initialize the About model

  // Constructor injects the AboutService for making API calls
  constructor(private aboutService: AboutService) {}

  // ngOnInit is used to load the About content when the component initializes
  ngOnInit(): void {
    this.aboutService.getAbout().subscribe(
      (data: About | null) => {
        if (data) {
          this.about = data; // Assign the fetched data to the About object
        }
      },
      (error: any) => {
        console.error('Error fetching About content', error); // Log any errors that occur during the API call
      }
    );
  }
}
