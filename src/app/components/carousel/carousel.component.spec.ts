import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselComponent } from './carousel.component';
import { CarouselService } from '../../services/carousel/carousel.service';
import { of } from 'rxjs';
import { CarouselItem } from '../../models/carousel/carousel.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;
  let carouselServiceSpy: jasmine.SpyObj<CarouselService>;

  const mockCarouselItems: CarouselItem[] = [
    { imageUrl: 'image1.jpg', bandName: 'Band 1', songName: 'Song 1', releaseDate: '2024-01-01', buttonText: 'Play', buttonLink: '/play/1' },
    { imageUrl: 'image2.jpg', bandName: 'Band 2', songName: 'Song 2', releaseDate: '2024-02-01', buttonText: 'Play', buttonLink: '/play/2' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CarouselService', ['getCarouselItems']);

    await TestBed.configureTestingModule({
      declarations: [CarouselComponent],
      imports: [CommonModule, RouterModule],
      providers: [{ provide: CarouselService, useValue: spy }]
    }).compileComponents();

    carouselServiceSpy = TestBed.inject(CarouselService) as jasmine.SpyObj<CarouselService>;
    carouselServiceSpy.getCarouselItems.and.returnValue(of(mockCarouselItems));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize carouselItems from the service', () => {
    expect(component.carouselItems.length).toBe(mockCarouselItems.length);
  });

  it('should set currentIndex to the selected index when selectSlide is called', () => {
    component.selectSlide(1);
    expect(component.currentIndex).toBe(1);
  });

  it('should increment currentIndex when nextSlide is called', () => {
    component.currentIndex = 0;
    component.nextSlide();
    expect(component.currentIndex).toBe(1);
  });

  it('should decrement currentIndex when prevSlide is called', () => {
    component.currentIndex = 1;
    component.prevSlide();
    expect(component.currentIndex).toBe(0);
  });

  it('should wrap around when nextSlide is called at last index', () => {
    component.currentIndex = mockCarouselItems.length - 1;
    component.nextSlide();
    expect(component.currentIndex).toBe(0);
  });

  it('should wrap around when prevSlide is called at index 0', () => {
    component.currentIndex = 0;
    component.prevSlide();
    expect(component.currentIndex).toBe(mockCarouselItems.length - 1);
  });
});
