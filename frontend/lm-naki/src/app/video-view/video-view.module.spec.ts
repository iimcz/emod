import { VideoViewModule } from './video-view.module';

describe('VideoViewModule', () => {
  let videoViewModule: VideoViewModule;

  beforeEach(() => {
    videoViewModule = new VideoViewModule();
  });

  it('should create an instance', () => {
    expect(videoViewModule).toBeTruthy();
  });
});
