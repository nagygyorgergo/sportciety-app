import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PersonalBest } from '../models/personal-best.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalBestsService {

  constructor(private firestore: AngularFirestore) { }

  //Add new exercise to personal bests
  createPersonalBestStrenghtExercise(uid: string, exerciseName: string, type: string): Promise<void> {
    const newPersonalBest: PersonalBest = {
      id: this.firestore.createId(),
      uid: uid,
      exerciseName: exerciseName,
      type: type,
      record: []  // Initialize record as an empty array
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


}
