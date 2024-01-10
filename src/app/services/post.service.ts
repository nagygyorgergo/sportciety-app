import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getDocs, limit, where } from '@angular/fire/firestore';
import { Storage, getDownloadURL, listAll, ref, uploadString } from '@angular/fire/storage/'
import { Photo } from '@capacitor/camera';
import { Post } from '../models/post.model';
import { Firestore} from '@angular/fire/firestore';
import { query, orderBy, getDoc, doc } from "firebase/firestore";  
import { deleteObject } from 'firebase/storage';
import { Observable } from 'rxjs';
import { Userdata } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  
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
        likeCount: 0,
        likerUids: []
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


  async deletePost(postId: string, creatorUid: string) {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User is not authenticated');
    }
  
    const postDocRef = this.angularFirestore.collection('posts').doc(postId);
  
    try {
      const post = await postDocRef.get().toPromise();
      if (!post) {
        throw new Error('Post does not exist.');
      }
  
      // Delete the post document
      await postDocRef.delete();
  
      // Delete the corresponding images in Firebase Storage
      await this.deleteImageForPost(postId, creatorUid);
  
      return true; // Post deleted successfully.
    } catch (error) {
      console.error('Error deleting post:', error);
      return false; // Post deletion failed.
    }
  }

  //used inside deletePost
  async deleteImageForPost(postId: string, uid: string) {
    if (uid) {
      const path = `uploads/${uid}`;
      const storageRef = ref(this.storage as Storage, path);
  
      try {
        const imagesList = await listAll(storageRef);
  
        for (const imageRef of imagesList.items) {
          if (imageRef.name.includes(postId)) {
            // Delete the image from storage
            await deleteObject(imageRef);
          }
        }
      } catch (e) {
        console.error('Error deleting images for post:', e);
      }
    }
  }
  
  //image upload for posts
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
  
  //Get user's own posts
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


  //retrieve appropriate images for post by postId and uid
  async getPostImages(postId: string, uid: String): Promise<string[]> {
    if (uid) {
      const path = `uploads/${uid}`;
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

  //Get user's friends' posts
  async getFriendsPosts(startIndex: number, endIndex: number, uid: string): Promise<Post[]> {
    if (uid) {
      try {
        // Fetch the user's friend UIDs from their collection
        const userCollection = collection(this.firestore, 'users');
        const userDoc = await getDoc(doc(userCollection, uid));
        const user = userDoc.data();

        if (user && user['friendUids'] && user['friendUids'].length > 0) {
          const friendUids = user['friendUids'];

          // Query posts where the 'uid' is in the list of friendUids
          const postsCollection = collection(this.firestore, 'posts');
          const q = query(
            postsCollection,
            where('uid', 'in', friendUids),
            orderBy('createdAt', 'desc'),
            limit(endIndex)
          );

          const querySnapshot = await getDocs(q);
          const userPosts: Post[] = [];

          querySnapshot.forEach((doc) => {
            userPosts.push(doc.data() as Post);
          });

          const startIndexAdjusted = startIndex < userPosts.length ? startIndex : 0;
          const endIndexAdjusted = endIndex < userPosts.length ? endIndex : userPosts.length;

          const postsBetweenIndexes = userPosts.slice(startIndexAdjusted, endIndexAdjusted);

          return postsBetweenIndexes;
        } else {
          return []; // No friends or empty friendUids
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
        return [];
      }
    } else {
      throw new Error('User is not defined');
    }
  }

  //Like post
  async likePost(postId: string, likerUid: string): Promise<void> {
    try {
      const postRef = this.angularFirestore.collection('posts').doc(postId);
  
      // Use get() to retrieve the document once
      const postSnapshot = await postRef.get().toPromise();
  
      if (postSnapshot) {
        const postData = postSnapshot.data() as Post;
  
        if (!postData.likerUids.includes(likerUid)) {
          const updatedPostData = {
            likeCount: postData.likeCount + 1,
            likerUids: [...postData.likerUids, likerUid],
            /* likerNames: [...postData.likerNames, likerName] */
          };
  
          await postRef.update(updatedPostData);
        } else {
          console.warn('User has already liked this post.');
        }
      } else {
        console.error('Post not found.');
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  }
  

  //Get liker users' names
  async getLikerNamesByPostId(postId: string): Promise<string[] | null> {
    try {
      const postDoc = await this.angularFirestore.collection('posts').doc(postId).get().toPromise();

      if (postDoc) {
        const post = postDoc.data() as Post;
        const likerUids = post?.likerUids || [];

        // Fetch user details for liker UIDs
        const likerNamesPromises = likerUids.map(async (likerUid) => {
          const likerDoc = await this.angularFirestore.collection('users').doc(likerUid).get().toPromise();

          if (likerDoc) {
            const likerData = likerDoc.data() as Userdata;
            return likerData?.username || 'Unknown User';
          } else {
            console.error(`User with UID ${likerUid} not found`);
            return 'Unknown User';
          }
        });

        // Resolve all promises to get the liker names
        const likerNames = await Promise.all(likerNamesPromises);
        if(likerNames.length !== 0){
          return likerNames;
        }
        else{
          return null;
        }
      } else {
        console.error('Post not found');
        return null;
      }
    } catch (error) {
      console.error('Error getting liker names:', error);
      return null;
    }
  }
  
}
