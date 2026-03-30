import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttChart} from './diagramme-grantt';

describe('DiagrammeGrantt', () => {
  let component: GanttChart;
  let fixture: ComponentFixture<GanttChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GanttChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GanttChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
