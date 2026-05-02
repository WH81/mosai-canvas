import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreReleasesComponent } from './pre-releases.component';

describe('PreReleasesComponent', () => {
  let component: PreReleasesComponent;
  let fixture: ComponentFixture<PreReleasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreReleasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreReleasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
