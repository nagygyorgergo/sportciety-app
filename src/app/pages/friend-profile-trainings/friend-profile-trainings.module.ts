import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendProfileTrainingsPageRoutingModule } from './friend-profile-trainings-routing.module';

import { FriendProfileTrainingsPage } from './friend-profile-trainings.page';
import { FriendPersonalBestChartPopoverComponent } from 'src/app/components/friend-personal-best-chart-popover/friend-personal-best-chart-popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendProfileTrainingsPageRoutingModule
  ],
  declarations: [FriendProfileTrainingsPage, FriendPersonalBestChartPopoverComponent]
})
export class FriendProfileTrainingsPageModule {}
