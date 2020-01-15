import { TestBed } from '@angular/core/testing';

import { BomService } from './bom.service';

describe('BomService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BomService = TestBed.get(BomService);
    expect(service).toBeTruthy();
  });
});
