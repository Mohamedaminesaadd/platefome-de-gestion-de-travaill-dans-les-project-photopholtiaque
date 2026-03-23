import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profileadmin } from './profileadmin';

describe('Profileadmin', () => {
  let component: Profileadmin;
  let fixture: ComponentFixture<Profileadmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profileadmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Profileadmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
