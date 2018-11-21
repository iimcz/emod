import { GenericViewModule } from './generic-view.module';

describe('GenericViewModule', () => {
  let genericViewModule: GenericViewModule;

  beforeEach(() => {
    genericViewModule = new GenericViewModule();
  });

  it('should create an instance', () => {
    expect(genericViewModule).toBeTruthy();
  });
});
