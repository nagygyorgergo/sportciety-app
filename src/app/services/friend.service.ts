import { Injectable } from '@angular/core';
import { FriendRequest } from '../models/friend-request.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { Userdata } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  addFriendRequest(senderUserUid: string, senderUserUsername:string, recieverUserUid: string, senderImageUrl: string) {
    const friendRequest: FriendRequest = {
      imageUrl: senderImageUrl,
      senderUserUid: senderUserUid,
      senderUserUsername: senderUserUsername,
      recieverUserUid: recieverUserUid,
      date: new Date().getTime(),
      status: 2,
    };
    return this.firestore.collection('friend-requests').add(friendRequest);
  }

  //checks if ths same request alredy exists to prevent from sending request several times
  async checkExistingRequest(senderUserUid: string, receiverUserUid: string): Promise<boolean> {
    try {
      console.log('Sender UID:', senderUserUid);
      console.log('Receiver UID:', receiverUserUid);

      const querySnapshot = await this.firestore
        .collection<FriendRequest>('friend-requests', (ref) =>
          ref
            .where('senderUserUid', '==', senderUserUid)
            .where('recieverUserUid', '==', receiverUserUid)
            .limit(1) // Limit the query to 1 result
        )
        .get()
        .toPromise();

      if (!querySnapshot?.empty) {
        return true; // An existing request was found
      } else {
        return false; // No existing request found
      }
    } catch (error) {
      console.error('Error checking existing request:', error);
      return false; // Return false in case of an error
    }
  }

  //get friend data by their uid
  getFriendByUid(uid: string){
    return this.firestore
      .collection<Userdata>('users', ref => ref.where('uid', '==', uid))
      .valueChanges({ idField: 'uid' })
      .pipe(
        map(users => users[0])
      );
  }

  //Delete friend request where reciever is the logged in user and sender is the one that sent the request
  deleteFriendRequest(currentUserUid: string, otherUserUid: string) {
    const friendRequestsCollection = this.firestore.collection<FriendRequest>('friend-requests', (ref) =>
      ref.where('recieverUserUid', '==', currentUserUid).where('senderUserUid', '==', otherUserUid)
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

  /*accept friend request: add currentUserUid(reciever's uid) to
  the friend request sender and add friendUid(sender's uid) to reciever user*/
  async addFriendToUser(currentUserUid: string, friendUid: string): Promise<void> {
    const userRef = this.firestore.collection<Userdata>('users').doc(currentUserUid).ref;
    const friendRef = this.firestore.collection<Userdata>('users').doc(friendUid).ref;

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const friendDoc = await transaction.get(friendRef);

      if (!userDoc.exists || !friendDoc.exists) {
        throw new Error('User or friend document does not exist.');
      }

      const userData = userDoc.data() as Userdata;
      const friendData = friendDoc.data() as Userdata;

      // Initialize friendUids arrays if they're undefined
      userData.friendUids = userData.friendUids || [];
      friendData.friendUids = friendData.friendUids || [];

      // Check if friendUid is already in the friendUids array
      if (!userData.friendUids.includes(friendUid)) {
        // Add friendUid to the currentUser's friendUids array
        userData.friendUids.push(friendUid);

        // Add currentUserUid to the friend's friendUids array
        friendData.friendUids.push(currentUserUid);

        // Update both user documents with the new friendUids arrays
        transaction.update(userRef, { friendUids: userData.friendUids });
        transaction.update(friendRef, { friendUids: friendData.friendUids });
      }
    });
  }

  //List friend request
  listFriendRequests(currentUserUid: string): Observable<FriendRequest[]> {
    return this.firestore.collection<FriendRequest>('friend-requests', (ref) =>
      ref.where('recieverUserUid', '==', currentUserUid)
    ).valueChanges();
  }

  listFriends(currentUserUid: string): Observable<Userdata[]> {
    // Query the users collection to get friends based on friendUids array
    return this.firestore
      .collection<Userdata>('users', (ref) =>
        ref.where('friendUids', 'array-contains', currentUserUid)
      )
      .valueChanges();
  }

  //Delete friend
  deleteFriend(currentUserUid: string, friendUid: string): Promise<void> {
    const userRef = this.firestore.collection<Userdata>('users').doc(currentUserUid).ref;
    const friendRef = this.firestore.collection<Userdata>('users').doc(friendUid).ref;

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const friendDoc = await transaction.get(friendRef);

      if (!userDoc.exists || !friendDoc.exists) {
        throw new Error('User or friend document does not exist.');
      }

      const userData = userDoc.data() as Userdata;
      const friendData = friendDoc.data() as Userdata;

      // Remove friendUid from the currentUser's friendUids array
      if (userData.friendUids && userData.friendUids.includes(friendUid)) {
        userData.friendUids = userData.friendUids.filter((uid) => uid !== friendUid);
      }

      // Remove currentUserUid from the friend's friendUids array
      if (friendData.friendUids && friendData.friendUids.includes(currentUserUid)) {
        friendData.friendUids = friendData.friendUids.filter((uid) => uid !== currentUserUid);
      }

      // Update both user documents with the modified friendUids arrays
      transaction.update(userRef, { friendUids: userData.friendUids });
      transaction.update(friendRef, { friendUids: friendData.friendUids });
    });
  }

  
}
