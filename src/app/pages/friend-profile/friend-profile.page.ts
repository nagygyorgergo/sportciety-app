import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FriendService } from 'src/app/services/friend.service';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.page.html',
  styleUrls: ['./friend-profile.page.scss'],
})
export class FriendProfilePage implements OnInit {

  friendUid: string | null;
  friendUsername: string;
  friendEmail: string;
  friendDateOfBirth: number;

  constructor(
    private route: ActivatedRoute,
    private friendService: FriendService,
    ) {
    this.friendUid = '';
    this.friendUsername = '';
    this.friendEmail = '';
    this.friendDateOfBirth = 0;
  }

  ngOnInit() {
    this.friendUid = this.getFriendUidFromUrl();
    console.log(this.friendUid);
    
    if(this.friendUid){
      this.friendService.getFriendByUid(this.friendUid).subscribe(user => {
        this.friendUsername = user.username;
        this.friendEmail = user.email;
        this.friendDateOfBirth = user.dateOfBirth;
      });
    }
    
  }

  getFriendUidFromUrl(): string | null {
    // Use paramMap to access route parameters
    const friendUid = this.route.snapshot.paramMap.get('friendUid');
  
    // If the friendUid is not found, you can handle it appropriately (return null, throw an error, etc.)
    return friendUid;
  }

}
