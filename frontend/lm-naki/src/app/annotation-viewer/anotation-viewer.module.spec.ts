import { AnnotationViewerModule } from './annotation-viewer.module';

describe('AnnotationViewerModule', () => {
  let anotationViewerModule: AnnotationViewerModule;

  beforeEach(() => {
    anotationViewerModule = new AnnotationViewerModule();
  });

  it('should create an instance', () => {
    expect(anotationViewerModule).toBeTruthy();
  });
});
