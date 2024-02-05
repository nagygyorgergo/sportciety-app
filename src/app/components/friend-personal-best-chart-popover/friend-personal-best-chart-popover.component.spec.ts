import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FriendPersonalBestChartPopoverComponent } from './friend-personal-best-chart-popover.component';

describe('FriendPersonalBestChartPopoverComponent', () => {
  let component: FriendPersonalBestChartPopoverComponent;
  let fixture: ComponentFixture<FriendPersonalBestChartPopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendPersonalBestChartPopoverComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FriendPersonalBestChartPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
