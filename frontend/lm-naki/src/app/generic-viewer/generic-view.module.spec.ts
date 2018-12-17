import { GenericViewerModule } from './generic-viewer.module';

describe('GenericViewerModule', () => {
  let genericViewModule: GenericViewerModule;

  beforeEach(() => {
    genericViewModule = new GenericViewerModule();
  });

  it('should create an instance', () => {
    expect(genericViewModule).toBeTruthy();
  });
});
