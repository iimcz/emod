import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { NakiService } from './naki.service';

describe('NakiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NakiService]
    });
  });

  it('should be created', inject([NakiService], (service: NakiService) => {
    expect(service).toBeTruthy();
  }));
});
