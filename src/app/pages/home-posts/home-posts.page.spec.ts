import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePostsPage } from './home-posts.page';

describe('HomePostsPage', () => {
  let component: HomePostsPage;
  let fixture: ComponentFixture<HomePostsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomePostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
