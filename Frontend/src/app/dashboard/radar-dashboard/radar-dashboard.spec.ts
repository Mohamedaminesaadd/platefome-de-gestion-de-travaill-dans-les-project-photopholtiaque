import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadarDashboard } from './radar-dashboard';

describe('RadarDashboard', () => {
  let component: RadarDashboard;
  let fixture: ComponentFixture<RadarDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadarDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadarDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
