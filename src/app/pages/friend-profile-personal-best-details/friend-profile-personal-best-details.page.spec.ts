import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FriendProfilePersonalBestDetailsPage } from './friend-profile-personal-best-details.page';

describe('FriendProfilePersonalBestDetailsPage', () => {
  let component: FriendProfilePersonalBestDetailsPage;
  let fixture: ComponentFixture<FriendProfilePersonalBestDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FriendProfilePersonalBestDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
