import { ImageViewerModule } from './image-viewer.module';

describe('ImageViewerModule', () => {
  let imageContainerModule: ImageViewerModule;

  beforeEach(() => {
    imageContainerModule = new ImageViewerModule();
  });

  it('should create an instance', () => {
    expect(imageContainerModule).toBeTruthy();
  });
});
