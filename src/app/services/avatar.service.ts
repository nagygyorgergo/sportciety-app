import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Photo } from '@capacitor/camera'; 

import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { User } from 'firebase/auth';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) { }

  getUserProfile(){
    const user = this.auth.currentUser;
    if(user){
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      return docData(userDocRef);
    }
    else{
      return null;
    }
  }

  getImageURL(uid: string){
    if (uid) {
      const imageDocRef = doc(this.firestore, `users/${uid}`); // Reference to the Firestore document
      return docData(imageDocRef);
    } else {
      return null; // Return a resolved promise that resolves to null
    }
  }

  //upload profile picture
  async uploadImage(cameraFile: Photo) {
    const user: User | null = this.auth.currentUser;
    if (user) {
      const path = `uploads/${user.uid}/profile.png`;
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
          // Handle the error here
          return null;
        }
      }
      return null;
    }
    return null;
  }
  


}
