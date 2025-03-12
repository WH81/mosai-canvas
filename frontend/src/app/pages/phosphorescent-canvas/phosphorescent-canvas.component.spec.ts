import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhosphorescentCanvasComponent } from './phosphorescent-canvas.component';

describe('PhosphorescentCanvasComponent', () => {
  let component: PhosphorescentCanvasComponent;
  let fixture: ComponentFixture<PhosphorescentCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhosphorescentCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhosphorescentCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
