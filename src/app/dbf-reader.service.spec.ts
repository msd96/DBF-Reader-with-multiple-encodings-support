import { TestBed } from '@angular/core/testing';

import { DbfReaderService } from './dbf-reader.service';

describe('DbfReaderService', () => {
  let service: DbfReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbfReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
