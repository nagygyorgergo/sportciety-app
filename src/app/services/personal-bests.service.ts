import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { PersonalBest } from '../models/personal-best.model';
import { Observable, catchError, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalBestsService {

  constructor(private firestore: AngularFirestore) { }

  //Add new exercise to personal bests
  createPersonalBestExercise(uid: string, exerciseName: string, type: string): Promise<void> {
    const newPersonalBest: PersonalBest = {
      id: this.firestore.createId(),
      uid: uid,
      exerciseName: exerciseName,
      type: type,
      records: []  // Initialize record as an empty array
    };
    return this.firestore.collection('personal-bests').doc(newPersonalBest.id).set(newPersonalBest);
  }

  //Fetch user's personal bests
  getPersonalBestsByUid(uid: string): Observable<PersonalBest[]> {
    return this.firestore.collection<PersonalBest>('personal-bests', ref => ref.where('uid', '==', uid))
      .valueChanges();
  }

  //Delete personal best exercise
  deletePersonalBestById(id: string): Promise<void> {
    return this.firestore.collection('personal-bests').doc(id).delete();
  }

  //Get personal best by id.
  getPersonalBestById(personalBestId: string): Observable<PersonalBest | null> {
    return this.firestore
      .doc<PersonalBest>(`personal-bests/${personalBestId}`)
      .valueChanges()
      .pipe(
        switchMap((personalBest) => personalBest ? of(personalBest) : of(null)),
        catchError(() => of(null))
      );
  }

  /* addRecordElement(personalBestId: string, newRecordElement: any): Promise<void> {
    const personalBestRef: AngularFirestoreDocument<PersonalBest> = this.firestore.collection('personal-bests').doc(personalBestId);

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const personalBestDoc = await transaction.get(personalBestRef.ref);

      if (!personalBestDoc.exists) {
        throw new Error('Personal Best document does not exist!');
      }

      // Ensure that 'record' is not undefined
      const currentRecord: any[] = personalBestDoc.data()?.records || [];

      const updatedRecord = [...currentRecord, newRecordElement];

      transaction.update(personalBestRef.ref, { records: updatedRecord });
    });
  } */

  addRecordElement(personalBestId: string, newRecordElement: any): Promise<void> {
    const personalBestRef: AngularFirestoreDocument<PersonalBest> = this.firestore.collection('personal-bests').doc(personalBestId);

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const personalBestDoc = await transaction.get(personalBestRef.ref);

      if (!personalBestDoc.exists) {
        throw new Error('Personal Best document does not exist!');
      }

      // Ensure that 'record' is not undefined
      const currentRecord: any[] = personalBestDoc.data()?.records || [];

      // Add a generated ID to the newRecordElement
      const recordWithId = { id: this.firestore.createId(), ...newRecordElement };

      const updatedRecord = [...currentRecord, recordWithId];

      transaction.update(personalBestRef.ref, { records: updatedRecord });
    });
  }

  removeRecordById(personalBestId: string, recordIdToRemove: string): Promise<void> {
    const personalBestRef: AngularFirestoreDocument<PersonalBest> = this.firestore.collection('personal-bests').doc(personalBestId);
  
    return this.firestore.firestore.runTransaction(async (transaction) => {
      const personalBestDoc = await transaction.get(personalBestRef.ref);
  
      if (!personalBestDoc.exists) {
        throw new Error('Personal Best document does not exist!');
      }
  
      const currentRecord: any[] = personalBestDoc.data()?.records || [];
  
      // Find the index of the record to remove
      const recordIndexToRemove = currentRecord.findIndex(record => record.id === recordIdToRemove);
  
      if (recordIndexToRemove === -1) {
        throw new Error('Record with the specified ID not found!');
      }
  
      // Remove the record from the array
      const updatedRecord = [...currentRecord.slice(0, recordIndexToRemove), ...currentRecord.slice(recordIndexToRemove + 1)];
  
      transaction.update(personalBestRef.ref, { records: updatedRecord });
    });
  }  


}
