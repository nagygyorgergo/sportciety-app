import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FriendProfilePostsPage } from './friend-profile-posts.page';

describe('FriendProfilePostsPage', () => {
  let component: FriendProfilePostsPage;
  let fixture: ComponentFixture<FriendProfilePostsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FriendProfilePostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
