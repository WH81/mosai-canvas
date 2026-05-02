import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastReleasesComponent } from './past-releases.component';

describe('PastReleasesComponent', () => {
  let component: PastReleasesComponent;
  let fixture: ComponentFixture<PastReleasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastReleasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastReleasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
