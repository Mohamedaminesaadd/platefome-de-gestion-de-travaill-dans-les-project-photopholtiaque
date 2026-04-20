import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TachesListRecherche } from './taches-list-recherche';

describe('TachesListRecherche', () => {
  let component: TachesListRecherche;
  let fixture: ComponentFixture<TachesListRecherche>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TachesListRecherche]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TachesListRecherche);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
