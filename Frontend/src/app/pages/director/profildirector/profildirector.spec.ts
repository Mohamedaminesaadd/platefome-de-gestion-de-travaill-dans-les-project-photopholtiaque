import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profildirector } from './profildirector';

describe('Profildirector', () => {
  let component: Profildirector;
  let fixture: ComponentFixture<Profildirector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profildirector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Profildirector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
