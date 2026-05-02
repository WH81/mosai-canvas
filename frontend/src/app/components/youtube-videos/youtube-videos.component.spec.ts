import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { YouTubeVideosComponent } from './youtube-videos.component';
import { YouTubeVideosService } from '../../services/youtube-videos/youtube-videos.service';

describe('YouTubeVideosComponent', () => {
  let component: YouTubeVideosComponent;
  let fixture: ComponentFixture<YouTubeVideosComponent>;
  let mockService: jasmine.SpyObj<YouTubeVideosService>;

  const mockVideos = [
    {
      videoId: '111',
      title: 'Video 1',
      thumbnail: 'thumb1.jpg',
    },
    {
      videoId: '222',
      title: 'Video 2',
      thumbnail: 'thumb2.jpg',
    },
    {
      videoId: '333',
      title: 'Video 3',
      thumbnail: 'thumb3.jpg',
    },
  ];

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('YouTubeVideosService', [
      'getBandVideos',
    ]);

    await TestBed.configureTestingModule({
      imports: [YouTubeVideosComponent],
      providers: [
        {
          provide: YouTubeVideosService,
          useValue: mockService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YouTubeVideosComponent);
    component = fixture.componentInstance;

    component.bandSlug = 'wailing-canvas';

    mockService.getBandVideos.and.returnValue(of(mockVideos));

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load videos and set featured video', () => {
    expect(component.videos.length).toBe(3);
    expect(component.featuredVideo.videoId).toBe('111');
  });

  it('should limit videos to 9 or less', () => {
    expect(component.videos.length).toBeLessThanOrEqual(9);
  });

  it('should change featured video when selecting a thumbnail', () => {
    component.selectVideo(mockVideos[2]);

    expect(component.featuredVideo.videoId).toBe('333');
  });
});