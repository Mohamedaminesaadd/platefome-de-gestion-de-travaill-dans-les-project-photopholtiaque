import { TestBed } from '@angular/core/testing';

import { SidebarState } from './sidebar-state';

describe('SidebarState', () => {
  let service: SidebarState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
