import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProject } from './list-project';

describe('ListProject', () => {
  let component: ListProject;
  let fixture: ComponentFixture<ListProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListProject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListProject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
