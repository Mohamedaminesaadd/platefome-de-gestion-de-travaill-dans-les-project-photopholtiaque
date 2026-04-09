import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignModal } from './assign-modal';

describe('AssignModal', () => {
  let component: AssignModal;
  let fixture: ComponentFixture<AssignModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
