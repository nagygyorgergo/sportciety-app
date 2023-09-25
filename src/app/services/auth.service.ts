import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { getAuth, AuthError } from 'firebase/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  async register(email: string, password: string) {
    try { 
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return user;
    } catch (error) {
      const errorCode = (error as AuthError).code;
      if (errorCode === 'auth/weak-password') {
        // Handle weak password error
        console.log('Weak password');
      } else if (errorCode === 'auth/email-already-in-use') {
        // Handle email already in use error
        console.log('Email already in use');
      } else {
        // Handle other errors
        console.log('Error:', errorCode);
      }
      return null;
    }
  }
   
  async login({ email, password }: { email: string; password: string }) {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return user;
    } catch (error) {
      const errorCode = (error as AuthError).code;
      if (errorCode === 'auth/wrong-password') {
        // Handle wrong password error
        console.log('Wrong password');
      } else {
        // Handle other errors
        console.log('Error:', errorCode);
      }
      return null;
    }
  }
  
  logout(){
    return signOut(this.auth);
  }
}
