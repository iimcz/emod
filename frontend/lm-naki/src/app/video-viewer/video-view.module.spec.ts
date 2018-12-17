import { VideoViewerModule } from './video-viewer.module';

describe('VideoViewerModule', () => {
  let videoViewModule: VideoViewerModule;

  beforeEach(() => {
    videoViewModule = new VideoViewerModule();
  });

  it('should create an instance', () => {
    expect(videoViewModule).toBeTruthy();
  });
});
