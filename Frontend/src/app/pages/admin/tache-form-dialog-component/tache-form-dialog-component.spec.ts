import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacheFormDialogComponent } from './tache-form-dialog-component';

describe('TacheFormDialogComponent', () => {
  let component: TacheFormDialogComponent;
  let fixture: ComponentFixture<TacheFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TacheFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TacheFormDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
