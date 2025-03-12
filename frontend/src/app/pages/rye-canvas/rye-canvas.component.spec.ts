import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RyeCanvasComponent } from './rye-canvas.component';

describe('RyeCanvasComponent', () => {
  let component: RyeCanvasComponent;
  let fixture: ComponentFixture<RyeCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RyeCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RyeCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
