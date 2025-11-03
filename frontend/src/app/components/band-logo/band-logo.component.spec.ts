import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandLogoComponent } from './band-logo.component';

describe('BandLogoComponent', () => {
  let component: BandLogoComponent;
  let fixture: ComponentFixture<BandLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
