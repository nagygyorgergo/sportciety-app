import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Userdata } from '../models/user.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private angularFirestore: AngularFirestore) { }
  
  createUser(user: Userdata): Promise<void> {
    return this.angularFirestore.collection('users').doc(user.uid).set(user);
  }

  getUsernameById(uid: string): Observable<string> {
    return this.angularFirestore
      .collection<Userdata>('users', ref => ref.where('uid', '==', uid))
      .valueChanges({ idField: 'uid' })
      .pipe(
        map(users => users[0].username)
      );
  }

  getUserById(uid: string){
    return this.angularFirestore
      .collection<Userdata>('users', ref => ref.where('uid', '==', uid))
      .valueChanges({ idField: 'uid' })
      .pipe(
        map(users => users[0])
      );
  }
  
  getUserByUsername(partialUsername: string) {
    return this.angularFirestore.collection<Userdata>('users').snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Userdata;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      }),
      map(users => {
        return users.filter(user =>
          user.username.toLowerCase().includes(partialUsername.toLowerCase())
        );
      })
    );
  }
}
