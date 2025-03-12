import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlickeringCanvasComponent } from './flickering-canvas.component';

describe('FlickeringCanvasComponent', () => {
  let component: FlickeringCanvasComponent;
  let fixture: ComponentFixture<FlickeringCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlickeringCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlickeringCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
