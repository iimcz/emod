import { FindSetModule } from './find-set.module';

describe('FindSetModule', () => {
  let findSetModule: FindSetModule;

  beforeEach(() => {
    findSetModule = new FindSetModule();
  });

  it('should create an instance', () => {
    expect(findSetModule).toBeTruthy();
  });
});
