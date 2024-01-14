import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DocumentData } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription, combineLatest } from 'rxjs';
import { FriendRequest } from 'src/app/models/friend-request.model';
import { Userdata } from 'src/app/models/user.model';
import { AvatarService } from 'src/app/services/avatar.service';
import { FriendService } from 'src/app/services/friend.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
  providers: [DatePipe]
})
export class FriendsPage implements OnInit {

  //Variables for search
  searchTerm: string = '';
  resultUsers: Userdata[] = [];
  imageURL!: DocumentData;
  results!: { imageUrl: string, username: string, uid: string }[];

  //Variables for friend request listing
  currentUserUid!: string;
  currentUserUsername!: string;
  friendRequests: FriendRequest[] = [];
  //current user's image Url
  currentUserImageUrl!: string;

  // Array to hold the friends' user data and listing friend users
  friends: Userdata[] = []; 

  //subscribtion variable
  private afAuthSubscribtion: Subscription | null = null;
  private avatarServiceSubscribtion: Subscription | null | undefined = null;
  private userServiceSubscribtion: Subscription | null = null;
  private friendRequestSubscribtion: Subscription | null = null;
  private friendsSubscribtion: Subscription | null = null;
  private combineLatestSubscription: Subscription | null = null;
  

  constructor(
    private userService: UserService,
    private avatarService: AvatarService,
    private friendService: FriendService,
    private afAuth: AngularFireAuth,
    private alertController: AlertController,
    private router: Router,
  ) { }

  ngOnInit() {
    //set currently logged in user's uid
    this.afAuthSubscribtion = this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUserUid = user.uid;

        this.userServiceSubscribtion = this.userService.getUserById(this.currentUserUid).subscribe(user => {
          this.currentUserUsername = user.username;
        });

        // Call listFriendRequests only after currentUserUid is set
        this.listFriendRequests();

        // List friends initially
        this.listFriends();

        this.avatarServiceSubscribtion = this.avatarService.getUserProfile()?.subscribe((data)=>{
          this.currentUserImageUrl = data['imageUrl'] || '../../assets/default-profile-picture.png';
          //console.log(this.profile);
        });
      }
    });
  }

  //Free memory
  ngOnDestroy(): void{
    if(this.afAuthSubscribtion){
      this.afAuthSubscribtion.unsubscribe();
    }
    if(this.avatarServiceSubscribtion){
      this.avatarServiceSubscribtion.unsubscribe();
    }
    if(this.userServiceSubscribtion){
      this.userServiceSubscribtion.unsubscribe();
    }
    if(this.friendRequestSubscribtion){
      this.friendRequestSubscribtion.unsubscribe();
    }
    if(this.friendsSubscribtion){
      this.friendsSubscribtion?.unsubscribe();
    }
    if(this.combineLatestSubscription){
      this.combineLatestSubscription.unsubscribe();
    }
  }

  searchUser(searchTerm: string) {
    if (!searchTerm ||searchTerm === '') {
      this.resultUsers = [];
      this.results = []; // Clear the results array
      console.log(this.searchTerm);
      return;
    }
  
    this.userServiceSubscribtion = this.userService.getUserByUsername(searchTerm).subscribe((users: Userdata[]) => {
      this.resultUsers = users;
  
      console.log(this.resultUsers);
  
      // Create an array of observables to fetch image URLs
      const observables = this.resultUsers.map((user: Userdata) =>
        this.avatarService.getImageURL(user.uid)
      );
  
      this.combineLatestSubscription = combineLatest(observables)
        .subscribe((data: any[]) => {
          // Check if this.resultUsers is an array before mapping
          if (Array.isArray(this.resultUsers)) {
            this.results = data.map((item, index) => ({
              imageUrl: item['imageUrl'] || '../../assets/default-profile-picture.png',
              username: this.resultUsers[index]?.username || 'Unknown', // Use a default value if username is undefined
              uid: this.resultUsers[index]?.uid || 'Unknown' // Use a default value if uid is undefined
            }));
          }
        });
    });
  }
  
  //Function for ion-searchbar's onClear action
  clearSearchTerm(){
    this.searchTerm='';
    this.searchUser(this.searchTerm);
  }

  //Alert window
  async alertPopup(header: string, message: string){
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  //Send friend request to user, gets parameter in friends.page.html
  async sendFriendRequest(receiverUserUid: string) {
    try {
      // Check if a friend request with the same sender and receiver already exists
      const existingRequest = await this.friendService.checkExistingRequest(
        this.currentUserUid,
        receiverUserUid
        );

      console.log(existingRequest);

      if (existingRequest) {
        // If an existing friend request is found, notify the user
        this.alertPopup('Friend Request Exists', 'You have already sent a friend request to this user.');
      } else {
        
        // If no existing request is found, proceed to send the friend request
       await this.friendService.addFriendRequest(
          this.currentUserUid,
          this.currentUserUsername,
          receiverUserUid,
          this.currentUserImageUrl
        );

        // Show a success alert
        this.alertPopup('Friend Request Sent', 'Your friend request has been sent successfully!');
      }
    } catch (error) {
      this.alertPopup('Friend Request Error', 'Your friend request could not be sent. An error occurred.');
      console.error('Error sending friend request:', error);
    }
  }

  //list current user's friend requests
  listFriendRequests(){
    this.friendRequestSubscribtion = this.friendService.listFriendRequests(this.currentUserUid)
      .subscribe((friendRequests: FriendRequest[]) => {
        this.friendRequests = friendRequests;
      });
  }
  
  //Accept or reject firned request: 0-->reject, 1-->accept
  async changeFriendRequestStatus(value: number, senderUserUid: string){
    if(value === 0){
      this.alertPopup('Friend Request rejected', 'You rejcted the friend request');
      this.friendService.deleteFriendRequest(this.currentUserUid, senderUserUid);
    }
    else{
      this.alertPopup('Friend Request accepted', 'You are now friends');
      this.friendService.addFriendToUser(this.currentUserUid, senderUserUid);
      this.friendService.deleteFriendRequest(this.currentUserUid, senderUserUid);
    }
  }

  //list users that are already friends
  listFriends(){
    this.friendsSubscribtion =  this.friendService.listFriends(this.currentUserUid).subscribe((friendsData: Userdata[]) => {
      // Populate the friends array with the retrieved data
      this.friends = friendsData;
    });
  }

  /*returns true if the uid parameter is already inside the friends array.
  Used to prevent adding a fiend several times.*/
  isFriend(uid: string): boolean {
    return this.friends.some(friend => friend.uid === uid);
  }

  //Redirect user to the selected friend's profile
  redirectToFriendProfile(friendUid: string) {
    this.router.navigate(['/friend-profile', friendUid]);
  }

  //Delete friend dialog
  async deleteFriend(friendUid: string) {
    const alert = await this.alertController.create({
    header: 'Confirm Deletion',
    message: `Are you sure you want to delete post?`,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Delete',
        handler: async () => {
          try {
            const isDeleted = await this.friendService.deleteFriend(this.currentUserUid, friendUid);

            if (isDeleted) {
              // Remove the deleted post from the userPosts array
              this.alertPopup('Delete finished', 'Deleted successfully')
              //Back to beginning of posts
            }
            
          } catch (error) {
            console.error('Error deleting post:', error);
            this.alertPopup('Something went wrond', 'Delete failed')
          }
        }
      }
    ] 
    });
    await alert.present();
  }

}
