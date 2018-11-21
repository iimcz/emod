import { FindViewModule } from './find-view.module';

describe('FindViewModule', () => {
  let findViewModule: FindViewModule;

  beforeEach(() => {
    findViewModule = new FindViewModule();
  });

  it('should create an instance', () => {
    expect(findViewModule).toBeTruthy();
  });
});
