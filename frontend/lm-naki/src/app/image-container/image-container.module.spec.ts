import { ImageContainerModule } from './image-container.module';

describe('ImageContainerModule', () => {
  let imageContainerModule: ImageContainerModule;

  beforeEach(() => {
    imageContainerModule = new ImageContainerModule();
  });

  it('should create an instance', () => {
    expect(imageContainerModule).toBeTruthy();
  });
});
