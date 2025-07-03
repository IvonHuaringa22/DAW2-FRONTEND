import { TestBed } from '@angular/core/testing';

import { CompraService } from './compras.service';

describe('ComprasService', () => {
  let service: CompraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
