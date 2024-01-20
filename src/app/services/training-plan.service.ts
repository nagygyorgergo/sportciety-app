import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Training } from '../models/training.model';
import { map } from 'rxjs';
import { Firestore, collection, doc, getDoc, getDocs, limit, orderBy, query, where } from '@angular/fire/firestore';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  constructor(
    private angularFirestore: AngularFirestore,
    private firestore: Firestore,
    ) {}

  async addTraining(training: Training): Promise<DocumentReference<Training>> {
    const trainingCollection = this.angularFirestore.collection<Training>('trainings');
  
    // Generate a new ID for the training document
    const trainingId = this.angularFirestore.createId();
  
    // Create a new document reference with the generated ID
    const trainingRef = trainingCollection.doc(trainingId).ref;
  
    // Set the training data along with the ID
    await trainingRef.set({
      ...training,
      id: trainingId // Assuming 'id' is the field name to store the ID
    });
  
    // Add the exercises as subcollections
    for (const exercise of training.exercises) {
      await trainingRef.collection('exercises').add(exercise);
    }
  
    return trainingRef;
  }
  
  async deleteTraining(training: Training): Promise<void> {
    const trainingDocRef = this.angularFirestore.collection<Training>('trainings').doc(training.id);
  
    // Delete the training document
    await trainingDocRef.delete();
  
    // Delete the subcollection 'exercises' if needed
    const exercisesCollectionRef = trainingDocRef.collection('exercises');
    const exercisesDocs = await exercisesCollectionRef.get().toPromise();
    if (exercisesDocs && !exercisesDocs.empty) {
      const batch = this.angularFirestore.firestore.batch();
      exercisesDocs.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    }
  }

  //Get logged in user's own trainings on displa-my-trainings page
  getMyTrainings(uid: string) {
    return this.angularFirestore.collection<Training>('trainings', ref =>
      ref.where('uid', '==', uid)
         .orderBy('createdAt', 'desc')
    )
    .snapshotChanges()
    .pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Training;
          const docid = a.payload.doc.id;
          return { docid, ...data };
        })
      )
    );
  }

  //Get current user's friend's trainings for friend-profile-trainings
  getFriendTrainings(uid: string) {
    return this.angularFirestore.collection<Training>('trainings', ref =>
      ref.where('uid', '==', uid)
         .where('isShared', '==', true)
         .orderBy('createdAt', 'desc')
    )
    .snapshotChanges()
    .pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Training;
          const docid = a.payload.doc.id;
          return { docid, ...data };
        })
      )
    );
  }

  async shareTraining(trainingId: string): Promise<void> {
    try {
      const trainingRef = this.angularFirestore.collection<Training>('trainings').doc(trainingId).ref;
      // Update the training document to set isShared to true
      await trainingRef.update({
        isShared: true,
        sharingDate: new Date().getTime()
      });
    } catch (error) {
      // Handle the error appropriately
      console.error('Error sharing training:', error);
      throw error;
    }
  }

  //Get user's friends' posts
  async getFriendsTrainingplans(startIndex: number, endIndex: number, uid: string): Promise<Training[]> {
    if (uid) {
      try {
        // Fetch the user's friend UIDs from their collection
        const userCollection = collection(this.firestore, 'users');
        const userDoc = await getDoc(doc(userCollection, uid));
        const user = userDoc.data();

        if (user && user['friendUids'] && user['friendUids'].length > 0) {
          const friendUids = user['friendUids'];

          // Query posts where the 'uid' is in the list of friendUids
          const trainingsCollection = collection(this.firestore, 'trainings');
          const q = query(
            trainingsCollection,
            where('uid', 'in', friendUids),
            where('isShared', '==', true),
            orderBy('sharingDate', 'desc'),
            limit(endIndex)
          );

          const querySnapshot = await getDocs(q);
          const friendTrainings: Training[] = [];

          querySnapshot.forEach((doc) => {
            friendTrainings.push(doc.data() as Training);
          });

          const startIndexAdjusted = startIndex < friendTrainings.length ? startIndex : 0;
          const endIndexAdjusted = endIndex < friendTrainings.length ? endIndex : friendTrainings.length;

          const trainingsBetweenIndexes = friendTrainings.slice(startIndexAdjusted, endIndexAdjusted);

          return trainingsBetweenIndexes;
        } else {
          return []; // No friends or empty friendUids
        }
      } catch (error) {
        console.error('Error fetching user trainings:', error);
        return [];
      }
    } else {
      throw new Error('User is not defined');
    }
  }

}
