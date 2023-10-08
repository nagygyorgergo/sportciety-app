import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DocumentData } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { combineLatest } from 'rxjs';
import { FriendRequest } from 'src/app/models/friend-request.model';
import { User } from 'src/app/models/user.model';
import { AvatarService } from 'src/app/services/avatar.service';
import { FriendRequestService } from 'src/app/services/friend-request.service';
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
  resultUsers: User[] = [];
  imageURL!: DocumentData;
  results!: { imageUrl: string, username: string, uid: string }[];

  //Variables for friend request listing
  currentUserUid!: string;
  currentUserUsername!: string;
  friendRequests: FriendRequest[] = [];
  //current user's image Url
  currentUserImageUrl!: string;

  // Array to hold the friends' user data and listing friend users
  friends: User[] = []; 

  constructor(
    private userService: UserService,
    private avatarService: AvatarService,
    private friendRequestService: FriendRequestService,
    private afAuth: AngularFireAuth,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    //set currently logged in user's uid
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUserUid = user.uid;

        this.userService.getUserById(this.currentUserUid).subscribe(user => {
          this.currentUserUsername = user.username;
        });

        // Call listFriendRequests only after currentUserUid is set
        this.listFriendRequests();

        // List friends initially
        this.listFriends();
      }

      this.avatarService.getUserProfile()?.subscribe((data)=>{
        this.currentUserImageUrl = data['imageUrl'] || '../../assets/default-profile-picture.png';
        //console.log(this.profile);
      });
    });
  }

  searchUser(searchTerm: string) {
    if (!searchTerm) {
      this.resultUsers = [];
      this.results = []; // Clear the results array
      console.log(this.searchTerm);
      return;
    } 
  
    searchTerm = searchTerm.toLowerCase();
  
    this.userService.getUserByUsername(searchTerm).subscribe((users: User[]) => {
      this.resultUsers = users;
  
      // Create an array of observables to fetch image URLs
      const observables = this.resultUsers.map((user: User) =>
        this.avatarService.getImageURL(user.uid)
      );
  
      combineLatest(observables).
        subscribe((data: any[]) => {
          this.results = data.map((item, index) => ({
            imageUrl: item['imageUrl'] || '../../assets/default-profile-picture.png',
            username: this.resultUsers[index].username,
            uid: this.resultUsers[index].uid
          }));
        });
    });
  }
  
  //Function for ion-searchbar's onClear action
  clearSearchTerm(){
    this.searchTerm='';
    this.searchUser(this.searchTerm);
  }

  //Send friend request to user, gets parameter in friends.page.html
  async sendFriendRequest(receiverUserUid: string) {
    try {
      // Check if a friend request with the same sender and receiver already exists
      const existingRequest = await this.friendRequestService.checkExistingRequest(
        this.currentUserUid,
        receiverUserUid
        );

      console.log(existingRequest);

      if (existingRequest) {
        // If an existing friend request is found, notify the user
        const alert = await this.alertController.create({
          header: 'Friend Request Exists',
          message: 'You have already sent a friend request to this user.',
          buttons: ['OK'],
        });
        await alert.present();
      } else {
        
        // If no existing request is found, proceed to send the friend request
       await this.friendRequestService.addFriendRequest(
          this.currentUserUid,
          this.currentUserUsername,
          receiverUserUid,
          this.currentUserImageUrl
        );

        // Show a success alert
        const alert = await this.alertController.create({
          header: 'Friend Request Sent',
          message: 'Your friend request has been sent successfully!',
          buttons: ['OK'],
        });
        await alert.present();
      }
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Friend Request Error',
        message: 'Your friend request could not be sent. An error occurred.',
        buttons: ['OK'],
      });
      await alert.present();
      console.error('Error sending friend request:', error);
    }
  }

  //list current user's friend requests
  listFriendRequests(){
    this.friendRequestService.listFriendRequests(this.currentUserUid)
      .subscribe((friendRequests: FriendRequest[]) => {
        this.friendRequests = friendRequests;
      });
  }
  
  //Accept or reject firned request: 0-->reject, 1-->accept
  async changeFriendRequestStatus(value: number, senderUserUid: string){
    if(value === 0){
      const alert = await this.alertController.create({
        header: 'Friend Request rejected',
        message: 'You rejcted the friend request',
        buttons: ['OK'],
      });
      this.friendRequestService.deleteFriendRequest(this.currentUserUid, senderUserUid);
      await alert.present();
    }
    else{
      const alert = await this.alertController.create({
        header: 'Friend Request accepted',
        message: 'You are now friends',
        buttons: ['OK'],
      });
      this.friendRequestService.addFriendToUser(this.currentUserUid, senderUserUid);
      this.friendRequestService.deleteFriendRequest(this.currentUserUid, senderUserUid);
      await alert.present();
    }
  }

  //list users that are already friends
  listFriends(){
    this.friendRequestService.listFriends(this.currentUserUid).subscribe((friendsData: User[]) => {
      // Populate the friends array with the retrieved data
      this.friends = friendsData;
    });
  }

  /*returns true if the uid parameter is already inside the friends array.
  Used to prevent adding a fiend several times.*/
  isFriend(uid: string): boolean {
    return this.friends.some(friend => friend.uid === uid);
  }

  async deleteFriend(friendUid: string){
    const alert = await this.alertController.create({
      header: 'Delete friend',
      message: 'Friend deleted successfully',
      buttons: ['OK'],
    });
    console.log('Deleted: ' + friendUid);
    this.friendRequestService.deleteFriend(this.currentUserUid, friendUid);
    await alert.present();
  }
  

}
