import {
    Directive,
    ElementRef,
    OnInit,
    OnDestroy,
    OnChanges,
    Input,
    NgZone,
    SimpleChanges,
  } from '@angular/core';
  
  @Directive({
    selector: '[appScrollTypewriter]',
    standalone: true,
  })
  export class ScrollTypewriterDirective implements OnInit, OnChanges, OnDestroy {
    @Input('appScrollTypewriter') text: string = '';
    @Input() typewriterScrollRange = 600;
    @Input() typewriterStartOffset = 0.8;
  
    private spans: HTMLElement[] = [];
    private boundHandler!: () => void;
  
    private readonly COLOR_UNTYPED = '#3a3a3a';
    private readonly COLOR_TYPED   = '#ffffff';
  
    constructor(private el: ElementRef<HTMLElement>, private ngZone: NgZone) {}
  
    ngOnInit(): void {
      this.ngZone.runOutsideAngular(() => {
        this.boundHandler = () => this.onScroll();
        window.addEventListener('scroll', this.boundHandler, { passive: true });
      });
    }
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['text'] && this.text) {
        this.wrapLetters();
        this.onScroll();
      }
    }
  
    ngOnDestroy(): void {
      window.removeEventListener('scroll', this.boundHandler);
    }
  
    private wrapLetters(): void {
      const el = this.el.nativeElement;
      el.textContent = '';
      this.spans = [];
  
      const fragment = document.createDocumentFragment();
  
      for (const char of this.text) {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.color      = this.COLOR_UNTYPED;
        span.style.transition = 'color 0.06s linear';
        fragment.appendChild(span);
        this.spans.push(span);
      }
  
      el.appendChild(fragment);
    }
  
    private onScroll(): void {
      if (!this.spans.length) return;
  
      const rect         = this.el.nativeElement.getBoundingClientRect();
      const viewH        = window.innerHeight;
      const triggerY     = viewH * this.typewriterStartOffset;
      const scrolledPast = triggerY - rect.top;
      const progress     = Math.min(Math.max(scrolledPast / this.typewriterScrollRange, 0), 1);
      const revealCount  = Math.round(progress * this.spans.length);
  
      for (let i = 0; i < this.spans.length; i++) {
        this.spans[i].style.color = i < revealCount
          ? this.COLOR_TYPED
          : this.COLOR_UNTYPED;
      }
    }
  }