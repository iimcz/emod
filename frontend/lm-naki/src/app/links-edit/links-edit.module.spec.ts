import { LinksEditModule } from './links-edit.module';

describe('LinksEditModule', () => {
  let linksEditModule: LinksEditModule;

  beforeEach(() => {
    linksEditModule = new LinksEditModule();
  });

  it('should create an instance', () => {
    expect(linksEditModule).toBeTruthy();
  });
});
