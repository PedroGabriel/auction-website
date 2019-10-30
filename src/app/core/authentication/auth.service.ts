import { Injectable } from '@angular/core';
import 'rxjs';
import { first } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  constructor(public afAuth: AngularFireAuth) { }

  async isLogged() {
    return new Promise<any>((resolve, reject) => {
      const user = this.afAuth.authState
        .pipe(first())
        .toPromise()
        .then(
          res => {
            if (res) {
              resolve(res);
            }
            reject(res);
          },
          err => {
            reject(err);
          }
        );
    });
  }

  doLogin(value: any) {
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            this.setToken()
              .then((idToken) => {
                console.log(idToken);
                localStorage.setItem('_token', idToken);
              })
              .catch((error) => { });
            resolve(res);
          },
          err => reject(err)
        );
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signOut();
    });
  }

  setToken() {
    return firebase
      .auth()
      .currentUser.getIdToken(true);
  }

  recoverPassword(email: string) {
    return firebase
      .auth()
      .sendPasswordResetEmail(email);
  }
}
