import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersBioComponent } from './members-bio.component';

describe('MembersBioComponent', () => {
  let component: MembersBioComponent;
  let fixture: ComponentFixture<MembersBioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersBioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersBioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
