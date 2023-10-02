import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { combineLatest, map } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AvatarService } from 'src/app/services/avatar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  searchTerm: string = '';
  resultUsers: User[] = [];
  imageURL!: DocumentData;
  results: { imageUrl: string, username: string }[] = [{imageUrl: '', username: ''}];

  constructor(
    private userService: UserService,
    private avatarService: AvatarService
  ) { }
  

  ngOnInit() {
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
            username: this.resultUsers[index].username
          }));
          console.log(this.results);
        });
    });
  }
  

  //Function for ion-searchbar's onClear action
  clearSearchTerm(){
    this.searchTerm='';
    this.searchUser(this.searchTerm);
  }

}
