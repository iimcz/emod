import { FindUserModule } from './find-user.module';

describe('FindUserModule', () => {
  let findUserModule: FindUserModule;

  beforeEach(() => {
    findUserModule = new FindUserModule();
  });

  it('should create an instance', () => {
    expect(findUserModule).toBeTruthy();
  });
});
