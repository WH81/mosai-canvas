import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaindGlassCanvasComponent } from './staind-glass-canvas.component';

describe('StaindGlassCanvasComponent', () => {
  let component: StaindGlassCanvasComponent;
  let fixture: ComponentFixture<StaindGlassCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaindGlassCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaindGlassCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
