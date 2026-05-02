import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandPageComponent } from './band-page.component';

describe('BandPageComponent', () => {
  let component: BandPageComponent;
  let fixture: ComponentFixture<BandPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
