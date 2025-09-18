import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true,
})
export class ScrollAnimateDirective implements OnInit {
  /**
   * Predefined animation types:
   * - 'fade-slide' = fade + translateY
   * - 'fade-in' = simple fade
   * - 'zoom-in' = fade + scale
   */
  @Input() animationType: 'fade-slide' | 'fade-in' | 'zoom-in' = 'fade-slide';

  /** Optional: custom CSS animation class */
  @Input() animationClass?: string;

  /** Optional: delay before the animation starts (e.g., '0.3s') */
  @Input() animationDelay: string = '0s';

  /** Optional: duration of animation (default 0.6s) */
  @Input() animationDuration: string = '0.6s';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Add hidden base class
    this.renderer.addClass(this.el.nativeElement, 'animate-hidden');

    const animationToApply = this.animationClass ?? `animate-${this.animationType}`;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.renderer.removeClass(this.el.nativeElement, 'animate-hidden');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(this.el.nativeElement, animationToApply);
            this.renderer.setStyle(this.el.nativeElement, 'animation-delay', this.animationDelay);
            this.renderer.setStyle(this.el.nativeElement, 'animation-duration', this.animationDuration);
            observer.unobserve(this.el.nativeElement);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(this.el.nativeElement);
  }
}
