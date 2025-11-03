import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberBioModalComponent } from './member-bio-modal.component';

describe('MemberBioModalComponent', () => {
  let component: MemberBioModalComponent;
  let fixture: ComponentFixture<MemberBioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberBioModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberBioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
