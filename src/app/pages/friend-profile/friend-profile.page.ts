import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonInfiniteScroll, LoadingController, NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { Userdata } from 'src/app/models/user.model';
import { FriendService } from 'src/app/services/friend.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.page.html',
  styleUrls: ['./friend-profile.page.scss'],
})
export class FriendProfilePage implements OnInit {
  
  friendUid: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController
    ) {}

  ngOnInit() {
    this.friendUid = this.route.snapshot.firstChild?.params['friendUid'];
    console.log('friendUid: ' + this.friendUid)
  }

  /* loadFriendTrainingsPage(friendUid: string) {
    //this.router.navigate(['/friend-profile/friend-profile-trainings', friendUid]);
    //this.navCtrl.navigateForward('/friend-profile/friend-profile-trainings/FHEYWpkh86WPct7PaiReTh1JGu33');
    this.navCtrl.navigateForward(['friend-profile/friend-profile-trainings', friendUid]);
  }


  selectedTab: string = 'home-posts'; // Default selected tab

  navigateTo(tab: string): void {
    this.selectedTab = tab; // Update selected tab
    this.router.navigate(['/friend-profile', { outlets: { primary: [tab, this.friendUid] } }]);
  } */
  
}
