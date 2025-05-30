import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamingLinksComponent } from './streaming-links.component';

describe('StreamingLinksComponent', () => {
  let component: StreamingLinksComponent;
  let fixture: ComponentFixture<StreamingLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamingLinksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamingLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
