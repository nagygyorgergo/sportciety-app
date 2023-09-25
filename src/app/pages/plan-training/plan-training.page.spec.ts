import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanTrainingPage } from './plan-training.page';

describe('PlanTrainingPage', () => {
  let component: PlanTrainingPage;
  let fixture: ComponentFixture<PlanTrainingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PlanTrainingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
