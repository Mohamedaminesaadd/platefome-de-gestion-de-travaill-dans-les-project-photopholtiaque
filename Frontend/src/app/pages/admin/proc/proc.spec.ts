import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Proc } from './proc';

describe('Proc', () => {
  let component: Proc;
  let fixture: ComponentFixture<Proc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Proc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Proc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
