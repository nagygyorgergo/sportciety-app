import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, doc, getDocs, limit, setDoc, startAfter, where } from '@angular/fire/firestore';
import { Storage, getDownloadURL, listAll, ref, uploadString } from '@angular/fire/storage/'
import { Photo } from '@capacitor/camera';
import { Post } from '../models/post.model';
import { DocumentData, Firestore} from '@angular/fire/firestore';
import { privateDecrypt } from 'crypto';
import { query, orderBy, startAt } from "firebase/firestore";  

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

  async createPost(text: string) {
    const user = this.auth.currentUser;
    if (user) {
      const trainingCollection = this.angularFirestore.collection('posts');
      const newPost = {
        uid: user.uid,
        text: text,
        createdAt: new Date().getTime(),
      };
  
      try {
        const docRef = await trainingCollection.add(newPost);
        await docRef.update({ id: docRef.id });
        return docRef.id;
      } catch (error) {
        console.error('Error creating post:', error);
        return null;
      }
    } else {
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
          return true;
        } catch (e) {
          console.error(e);
          return null;
        }
      }
      return null;
    }
    return null;
  }
  
  async getUserPosts(startIndex: number, endIndex: number, uid: string): Promise<Post[]> {
    if (uid) {
      const postsCollection = collection(this.firestore, 'posts');
      const q = query(
        postsCollection,
        where('uid', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(endIndex)
      );

      try {
        const querySnapshot = await getDocs(q);
        const userPosts: Post[] = [];

        // Collect all the documents in the query snapshot
        querySnapshot.forEach((doc) => {
          userPosts.push(doc.data() as Post);
        });

        // Filter the posts between the specified indexes
        const startIndexAdjusted = startIndex < userPosts.length ? startIndex : 0;
        const endIndexAdjusted = endIndex < userPosts.length ? endIndex : userPosts.length;

        const postsBetweenIndexes = userPosts.slice(startIndexAdjusted, endIndexAdjusted);

        return postsBetweenIndexes;
      } catch (error) {
        console.error('Error fetching user posts:', error);
        return [];
      }
    } else {
      throw new Error('User is not defined');
    }
  }
  

  /* async getUserPosts(startIndex: number, itemsPerPage: number, uid: string): Promise<Post[]> {
    if (uid) {
      const postsCollection = collection(this.firestore, 'posts');
      const orderByField = 'createdAt'; // Change this to the actual field name used for ordering
  
      let query = query(
        postsCollection,
        where('uid', '==', uid),
        orderBy(orderByField, 'desc')
      );
  
      if (startIndex > 0) {
        const lastVisibleDoc = await this.getLastVisibleDoc(uid, startIndex);
        query = query(query, startAfter(lastVisibleDoc));
      }
  
      query = query(query, limit(itemsPerPage));
  
      const querySnapshot = await getDocs(query);
  
      const userPosts: Post[] = [];
  
      querySnapshot.forEach((doc) => {
        userPosts.push(doc.data() as Post);
      });
  
      console.log('Service userposts ' + userPosts);
      console.log('service uid ' + uid);
      console.log(startIndex);
      console.log(itemsPerPage);
  
      return userPosts;
    } else {
      throw new Error('User is not defined');
    }
  }
  
  async getLastVisibleDoc(uid: string, startIndex: number) {
    const postsCollection = collection(this.firestore, 'posts');
    const orderByField = 'createdAt'; // Change this to the actual field name used for ordering
  
    const query = query(
      postsCollection,
      where('uid', '==', uid),
      orderBy(orderByField, 'desc'),
      limit(startIndex)
    );
  
    const querySnapshot = await getDocs(query);
    if (querySnapshot.docs.length > 0) {
      return querySnapshot.docs[querySnapshot.docs.length - 1];
    } else {
      return null;
    }
  }
   */

  async getPostImages(postId: string): Promise<string[]> {
    const user = this.auth.currentUser;
    if (user) {
      const path = `uploads/${user.uid}`;
      const storageRef = ref(this.storage as Storage, path);

      const images: string[] = [];

      try {
        const imagesList = await listAll(storageRef);

        for (const imageRef of imagesList.items) {
          if (imageRef.name.includes(postId)) {
            const imageUrl = await getDownloadURL(imageRef);
            images.push(imageUrl);
          }
        }

        return images;
      } catch (e) {
        console.error(e);
        return [];
      }
    } else {
      throw new Error('User is not authenticated');
    }
  }

}
