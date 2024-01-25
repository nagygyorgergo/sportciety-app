import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PersonalBest } from '../models/personal-best.model';

@Injectable({
  providedIn: 'root'
})
export class PersonalBestsService {

  constructor(private firestore: AngularFirestore) { }

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
}
