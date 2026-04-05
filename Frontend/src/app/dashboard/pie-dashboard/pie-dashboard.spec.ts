import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieDashboard } from './pie-dashboard';

describe('PieDashboard', () => {
  let component: PieDashboard;
  let fixture: ComponentFixture<PieDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
