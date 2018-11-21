import { TestBed } from '@angular/core/testing';

import { NakiDefaultPlayerService } from './naki-default-player.service';

describe('NakiDefaultPlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NakiDefaultPlayerService = TestBed.get(NakiDefaultPlayerService);
    expect(service).toBeTruthy();
  });
});
