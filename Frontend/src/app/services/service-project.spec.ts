import { TestBed } from '@angular/core/testing';

import { ServiceProject } from './service-project';

describe('ServiceProject', () => {
  let service: ServiceProject;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceProject);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
