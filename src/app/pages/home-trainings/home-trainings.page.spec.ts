import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeTrainingsPage } from './home-trainings.page';

describe('HomeTrainingsPage', () => {
  let component: HomeTrainingsPage;
  let fixture: ComponentFixture<HomeTrainingsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomeTrainingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
