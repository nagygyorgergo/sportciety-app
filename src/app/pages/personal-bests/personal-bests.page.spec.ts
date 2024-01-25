import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalBestsPage } from './personal-bests.page';

describe('PersonalBestsPage', () => {
  let component: PersonalBestsPage;
  let fixture: ComponentFixture<PersonalBestsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PersonalBestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
