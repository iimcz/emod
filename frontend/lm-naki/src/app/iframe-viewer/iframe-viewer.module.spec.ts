import { IframeViewerModule } from './iframe-viewer.module';

describe('IframeViewerModule', () => {
  let iframeViewModule: IframeViewerModule;

  beforeEach(() => {
    iframeViewModule = new IframeViewerModule();
  });

  it('should create an instance', () => {
    expect(iframeViewModule).toBeTruthy();
  });
});
