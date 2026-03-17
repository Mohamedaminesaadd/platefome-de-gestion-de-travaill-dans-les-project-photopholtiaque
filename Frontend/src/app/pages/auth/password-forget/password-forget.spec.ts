import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordForget } from './password-forget';

describe('PasswordFroget', () => {
  let component: PasswordForget;
  let fixture: ComponentFixture<PasswordForget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordForget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordForget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
