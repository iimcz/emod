import { FindGroupModule } from './find-group.module';

describe('FindGroupModule', () => {
  let findGroupModule: FindGroupModule;

  beforeEach(() => {
    findGroupModule = new FindGroupModule();
  });

  it('should create an instance', () => {
    expect(findGroupModule).toBeTruthy();
  });
});
