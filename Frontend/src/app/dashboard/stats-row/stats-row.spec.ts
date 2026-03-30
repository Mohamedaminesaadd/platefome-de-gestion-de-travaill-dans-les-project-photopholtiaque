import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsRow } from './stats-row';

describe('StatsRow', () => {
  let component: StatsRow;
  let fixture: ComponentFixture<StatsRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
