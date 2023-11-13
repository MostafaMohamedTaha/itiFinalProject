import { TestBed } from '@angular/core/testing';

import { BasketService } from '../backet.service';

describe('BacketService', () => {
  let service: BasketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
