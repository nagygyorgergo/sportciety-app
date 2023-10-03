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
  async sendFriendRequest(otherUserUid: string) {
    try {
      await this.friendRequestService.addFriendRequest(this.currentUserUid, this.currentUserUsername, otherUserUid, this.currentUserImageUrl);

      // Show a success alert
      const alert = await this.alertController.create({
        header: 'Friend Request Sent',
        message: 'Your friend request has been sent successfully!',
        buttons: ['OK'],
      });

      await alert.present();
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  }

  //Delete friend request
  deleteFriendRequest(otherUserUid: string){
    this.friendRequestService.deleteFriendRequest(this.currentUserUid, otherUserUid);
  }

  //list current user's friend requests
  listFriendRequests(){
    this.friendRequestService.listFriendRequests(this.currentUserUid)
      .subscribe((friendRequests: FriendRequest[]) => {
        this.friendRequests = friendRequests;
      });
  }

  
  
  changeFriendRequestStatus(value: number){

  }

}
