import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc, setDoc } from '@angular/fire/firestore';
import { Storage, getDownloadURL, ref, uploadString } from '@angular/fire/storage/'
import { Photo } from '@capacitor/camera';
import { Post } from '../models/post.model';
import { DocumentData, Firestore} from '@angular/fire/firestore';
import { privateDecrypt } from 'crypto';
@Injectable({
  providedIn: 'root'
})
export class CreatePostService {
  
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage,
    private angularFirestore: AngularFirestore
    
  ) { }

  createPost(text: string) {
    const user = this.auth.currentUser;
    if (user) {
      const trainingCollection = this.angularFirestore.collection('posts');
      return trainingCollection.add({
        uid: user.uid,
        text: text,
        createdAt: new Date().getTime(),
      });
    }
    else {
      throw new Error('User is not authenticated');
    }
  }

  async uploadImage(cameraFile: Photo, postId: string) {
    const user: User | null = this.auth.currentUser;
    if (user) {
      const path = `uploads/${user.uid}/${postId}.png`;
      const storageRef = ref(this.storage as Storage, path);
      if (cameraFile.base64String) {
        try {
          await uploadString(storageRef, cameraFile.base64String, 'base64');
  
          const imageUrl = await getDownloadURL(storageRef);
          const userDocRef = doc(this.firestore, `users/${user.uid}`);
          await setDoc(userDocRef, {
            imageUrl,
          }, { merge: true }); // Use merge option to only update imageUrl field
  
          return true;
        } catch (e) {
          console.log(e);
          return null;
        }
      }
      return null;
    }
    return null;
  }

}
