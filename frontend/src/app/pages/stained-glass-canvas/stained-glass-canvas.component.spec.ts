import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StainedGlassCanvasComponent } from './stained-glass-canvas.component';

describe('StainedGlassCanvasComponent', () => {
  let component: StainedGlassCanvasComponent;
  let fixture: ComponentFixture<StainedGlassCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StainedGlassCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StainedGlassCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
