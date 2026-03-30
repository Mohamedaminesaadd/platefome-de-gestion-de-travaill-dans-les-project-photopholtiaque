import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sidbar } from './sidbar';

describe('Sidbar', () => {
  let component: Sidbar;
  let fixture: ComponentFixture<Sidbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sidbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
