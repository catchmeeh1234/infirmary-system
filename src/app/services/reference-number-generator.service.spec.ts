import { TestBed } from '@angular/core/testing';

import { ReferenceNumberGeneratorService } from './reference-number-generator.service';

describe('ReferenceNumberGeneratorService', () => {
  let service: ReferenceNumberGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferenceNumberGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
