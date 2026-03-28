import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManager } from './project-manager';

describe('ProjectManager', () => {
  let component: ProjectManager;
  let fixture: ComponentFixture<ProjectManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
