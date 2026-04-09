import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBar } from './filter-bar';

describe('FilterBar', () => {
  let component: FilterBar;
  let fixture: ComponentFixture<FilterBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
