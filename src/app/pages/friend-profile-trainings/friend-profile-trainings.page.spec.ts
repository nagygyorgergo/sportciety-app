import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FriendProfileTrainingsPage } from './friend-profile-trainings.page';

describe('FriendProfileTrainingsPage', () => {
  let component: FriendProfileTrainingsPage;
  let fixture: ComponentFixture<FriendProfileTrainingsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FriendProfileTrainingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
