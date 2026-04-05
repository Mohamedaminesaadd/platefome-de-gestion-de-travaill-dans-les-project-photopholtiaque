import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianList } from './technician-list';

describe('TechnicianList', () => {
  let component: TechnicianList;
  let fixture: ComponentFixture<TechnicianList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicianList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicianList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
