import { MotionContainerModule } from './motion-container.module';

describe('MotionContainerModule', () => {
  let motionContainerModule: MotionContainerModule;

  beforeEach(() => {
    motionContainerModule = new MotionContainerModule();
  });

  it('should create an instance', () => {
    expect(motionContainerModule).toBeTruthy();
  });
});
