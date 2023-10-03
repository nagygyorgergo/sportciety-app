import { Injectable } from '@angular/core';
import { FriendRequest } from '../models/friend-request.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendRequestService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  addFriendRequest(currentUserUid: string, currentUserUsername:string, otherUserUid: string, imageUrl: string) {
    const friendRequest: FriendRequest = {
      imageUrl: imageUrl,
      currentUserUid: currentUserUid,
      currentUserUsername: currentUserUsername,
      otherUserUid: otherUserUid,
      date: new Date().getTime(),
      status: 2,
    };
    return this.firestore.collection('friend-requests').add(friendRequest);
  }

  //Delete friend request
  deleteFriendRequest(currentUserUid: string, otherUserUid: string) {
    const friendRequestsCollection = this.firestore.collection<FriendRequest>('friend-requests', (ref) =>
      ref.where('currentUserUid', '==', currentUserUid).where('otherUserUid', '==', otherUserUid)
    );
    friendRequestsCollection.get().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete().then(() => {
          console.log('Friend request deleted successfully');
        }).catch((error) => {
          console.error('Error deleting friend request:', error);
        });
      });
    });
  }

  listFriendRequests(currentUserUid: string): Observable<FriendRequest[]> {
    return this.firestore.collection<FriendRequest>('friend-requests', (ref) =>
      ref.where('otherUserUid', '==', currentUserUid)
    ).valueChanges();
  }

}
