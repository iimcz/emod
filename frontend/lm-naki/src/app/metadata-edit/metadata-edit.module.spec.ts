import { MetadataEditModule } from './metadata-edit.module';

describe('MetadataEditModule', () => {
  let metadataEditModule: MetadataEditModule;

  beforeEach(() => {
    metadataEditModule = new MetadataEditModule();
  });

  it('should create an instance', () => {
    expect(metadataEditModule).toBeTruthy();
  });
});
