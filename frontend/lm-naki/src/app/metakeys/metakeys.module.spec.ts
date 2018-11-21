import { MetakeysModule } from './metakeys.module';

describe('MetakeysModule', () => {
  let metakeysModule: MetakeysModule;

  beforeEach(() => {
    metakeysModule = new MetakeysModule();
  });

  it('should create an instance', () => {
    expect(metakeysModule).toBeTruthy();
  });
});
