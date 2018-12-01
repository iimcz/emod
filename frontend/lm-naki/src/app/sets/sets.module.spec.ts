import { SetsModule } from './sets.module';

describe('SetsModule', () => {
  let setsModule: SetsModule;

  beforeEach(() => {
    setsModule = new SetsModule();
  });

  it('should create an instance', () => {
    expect(setsModule).toBeTruthy();
  });
});
