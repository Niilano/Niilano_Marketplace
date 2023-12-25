import { TestBed } from '@angular/core/testing';

import { ProductsserviceService } from './productsservice.service';

describe('ProductsserviceService', () => {
  let service: ProductsserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
