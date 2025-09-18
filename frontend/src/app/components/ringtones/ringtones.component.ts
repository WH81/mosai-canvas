import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RingtoneService } from "../../services/ringtone/ringtone.service";
import { Ringtone } from "../../models/ringtone/ringtone.model";
import { ScrollAnimateDirective } from "../../directives/scroll-animate.directive";

@Component({
  selector: "app-ringtones",
  standalone: true,
  imports: [CommonModule, HttpClientModule, ScrollAnimateDirective],
  templateUrl: "./ringtones.component.html",
  styleUrls: ["./ringtones.component.scss"],
  providers: [RingtoneService]
})
export class RingtonesComponent implements OnInit {
  ringtones: Ringtone[] = [];
  currentAudio: HTMLAudioElement | null = null;

  constructor(private ringtoneService: RingtoneService) {}

  ngOnInit(): void {
    this.ringtoneService.getAll().subscribe((data) => {
      this.ringtones = data;
    });
  }

  togglePlay(previewUrl: string): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.currentAudio = null;
      return;
    }
    this.currentAudio = new Audio(previewUrl);
    this.currentAudio.play();
  }
}
