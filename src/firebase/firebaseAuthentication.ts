import * as firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
//import "firebase/database";
import firebaseConfig from './config';
import { useEffect, useState } from 'react';

/*
export class Firebase {
    auth: firebase.auth.Auth
    constructor() {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        //app.analytics();
        debugger;
        this.auth = firebase.auth();
        //this.db = app.firestore();
    }

    googleSignin() {
        debugger;
        const provider = new firebase.auth.GoogleAuthProvider();
        this.auth.signInWithPopup(provider)
            .then((result) => console.log("successfully logged in", result.user?.displayName))
            .catch((error) => console.error(error))
    }
}

const firebaseInstance = new Firebase();

export {firebaseInstance};
*/

let firebaseApp: firebase.app.App | null = null;

if (!firebaseApp) {
  // (!firebase.apps.length) {
  //@ts-ignore
  firebaseApp = firebase.default.initializeApp(firebaseConfig);
  //app.initializeApp(firebaseConfig);
}

//export const auth = firebase.default.auth();
//export const db = firebase.database();
//@ts-ignore
export const auth = firebaseApp.auth();

//@ts-ignore
export const provider = new firebase.default.auth.GoogleAuthProvider();

//@ts-ignore
export const firestoreDb = firebaseApp.firestore();

// auth.onAuthStateChanged((user) => {
//   if (user) {
//     console.log('User logged in', user.displayName);
//   } else {
//     console.log('User logged out');
//   }
// });

// auth
//   .signOut()
//   .then(function () {
//     // Sign-out successful.
//   })
//   .catch(function (error) {
//     // An error happened.
//   });

export function useAuth() {
  const [authUser, setAuthUser] = useState<firebase.User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user: firebase.User | null) => {
        if (user) {
          console.log('User logged in', user.displayName);
          setAuthUser(user);
        } else {
          setAuthUser(undefined);
          console.log('User logged out');
        }
      },
    );

    return () => unsubscribe();
  }, []);

  return authUser;
}
