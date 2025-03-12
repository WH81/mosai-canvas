import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WailingCanvasComponent } from './wailing-canvas.component';

describe('WailingCanvasComponent', () => {
  let component: WailingCanvasComponent;
  let fixture: ComponentFixture<WailingCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WailingCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WailingCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
