import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordFroget } from './password-froget';

describe('PasswordFroget', () => {
  let component: PasswordFroget;
  let fixture: ComponentFixture<PasswordFroget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordFroget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordFroget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
