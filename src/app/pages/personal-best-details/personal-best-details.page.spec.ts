import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalBestDetailsPage } from './personal-best-details.page';

describe('PersonalBestDetailsPage', () => {
  let component: PersonalBestDetailsPage;
  let fixture: ComponentFixture<PersonalBestDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PersonalBestDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
