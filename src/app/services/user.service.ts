import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private angularFirestore: AngularFirestore) { }
  
  createUser(user: User): Promise<void> {
    return this.angularFirestore.collection('users').doc(user.uid).set(user);
  }

  getUsernameById(uid: string): Observable<string> {
    return this.angularFirestore
      .collection<User>('users', ref => ref.where('uid', '==', uid))
      .valueChanges({ idField: 'uid' })
      .pipe(
        map(users => users[0].username)
      );
  }

  getUserById(uid: string){
    return this.angularFirestore
      .collection<User>('users', ref => ref.where('uid', '==', uid))
      .valueChanges({ idField: 'uid' })
      .pipe(
        map(users => users[0])
      );
  }
}
