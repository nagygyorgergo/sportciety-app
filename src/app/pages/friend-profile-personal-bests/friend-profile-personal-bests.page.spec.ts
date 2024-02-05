import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FriendProfilePersonalBestsPage } from './friend-profile-personal-bests.page';

describe('FriendProfilePersonalBestsPage', () => {
  let component: FriendProfilePersonalBestsPage;
  let fixture: ComponentFixture<FriendProfilePersonalBestsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FriendProfilePersonalBestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
