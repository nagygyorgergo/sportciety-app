import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayMyTrainingsPage } from './display-my-trainings.page';

describe('DisplayMyTrainingsPage', () => {
  let component: DisplayMyTrainingsPage;
  let fixture: ComponentFixture<DisplayMyTrainingsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DisplayMyTrainingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
