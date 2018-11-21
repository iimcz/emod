import { IframeViewModule } from './iframe-view.module';

describe('IframeViewModule', () => {
  let iframeViewModule: IframeViewModule;

  beforeEach(() => {
    iframeViewModule = new IframeViewModule();
  });

  it('should create an instance', () => {
    expect(iframeViewModule).toBeTruthy();
  });
});
