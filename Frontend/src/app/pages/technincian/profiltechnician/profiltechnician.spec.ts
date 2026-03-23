import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profiltechnician } from './profiltechnician';

describe('Profiltechnician', () => {
  let component: Profiltechnician;
  let fixture: ComponentFixture<Profiltechnician>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profiltechnician]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Profiltechnician);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
