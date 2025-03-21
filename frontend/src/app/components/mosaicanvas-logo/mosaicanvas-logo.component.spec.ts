import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MosaicanvasLogoComponent } from './mosaicanvas-logo.component';

describe('MosaicanvasLogoComponent', () => {
  let component: MosaicanvasLogoComponent;
  let fixture: ComponentFixture<MosaicanvasLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MosaicanvasLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MosaicanvasLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
