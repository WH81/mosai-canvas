import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasCatalystComponent } from './canvas-catalyst.component';

describe('CanvasCatalystComponent', () => {
  let component: CanvasCatalystComponent;
  let fixture: ComponentFixture<CanvasCatalystComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasCatalystComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasCatalystComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
