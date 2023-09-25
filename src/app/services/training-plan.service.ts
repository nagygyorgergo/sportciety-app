import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Training, Exercise } from '../models/training.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  constructor(private firestore: AngularFirestore) {}

  async addTraining(training: Training): Promise<DocumentReference<Training>> {
    const trainingCollection = this.firestore.collection<Training>('trainings');
  
    // Generate a new ID for the training document
    const trainingId = this.firestore.createId();
  
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
    const trainingDocRef = this.firestore.collection<Training>('trainings').doc(training.id);
  
    // Delete the training document
    await trainingDocRef.delete();
  
    // Delete the subcollection 'exercises' if needed
    const exercisesCollectionRef = trainingDocRef.collection('exercises');
    const exercisesDocs = await exercisesCollectionRef.get().toPromise();
    if (exercisesDocs && !exercisesDocs.empty) {
      const batch = this.firestore.firestore.batch();
      exercisesDocs.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    }
  }

  getMyTrainings(uid: string) {
    return this.firestore.collection<Training>('trainings', ref =>
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
}
