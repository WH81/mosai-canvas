import { Component, OnInit } from '@angular/core';
import { AboutService } from '../../services/about/about.service';
import { About } from '../../models/about/about.model';
import { CommonModule } from '@angular/common';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [CommonModule, ScrollAnimateDirective],
})
export class AboutComponent implements OnInit {
  aboutList: About[] = [];
  loading: boolean = true;

  constructor(private aboutService: AboutService) {}

  ngOnInit(): void {
    this.getAboutData();
  }

  getAboutData() {
    this.aboutService.getAboutData().subscribe({
      next: (data: About[]) => {
        this.aboutList = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching About data', error);
        this.loading = false;
      },
    });
  }
}
