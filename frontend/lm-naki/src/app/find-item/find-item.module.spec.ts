import { FindItemModule } from './find-item.module';

describe('FindItemModule', () => {
  let findItemModule: FindItemModule;

  beforeEach(() => {
    findItemModule = new FindItemModule();
  });

  it('should create an instance', () => {
    expect(findItemModule).toBeTruthy();
  });
});
