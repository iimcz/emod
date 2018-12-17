import { MotionViewerModule } from './motion-viewer.module';

describe('MotionViewerModule', () => {
  let motionContainerModule: MotionViewerModule;

  beforeEach(() => {
    motionContainerModule = new MotionViewerModule();
  });

  it('should create an instance', () => {
    expect(motionContainerModule).toBeTruthy();
  });
});
