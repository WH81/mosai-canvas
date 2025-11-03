import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandAboutComponent } from './band-about.component';

describe('BandAboutComponent', () => {
  let component: BandAboutComponent;
  let fixture: ComponentFixture<BandAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandAboutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
