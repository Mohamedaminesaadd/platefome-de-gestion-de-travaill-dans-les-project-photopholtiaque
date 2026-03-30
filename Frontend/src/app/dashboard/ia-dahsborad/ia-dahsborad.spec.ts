import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IaDahsborad } from './ia-dahsborad';

describe('IaDahsborad', () => {
  let component: IaDahsborad;
  let fixture: ComponentFixture<IaDahsborad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IaDahsborad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IaDahsborad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
