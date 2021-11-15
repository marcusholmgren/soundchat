import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from 'firebase/storage'
import firebaseConfig from './config';
import {useEffect, useState} from 'react';
import type {UserInfo} from "firebase/auth";


const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export const provider = new GoogleAuthProvider();

export const firestoreDb = getFirestore(firebaseApp);

export const cloudStorage = getStorage(firebaseApp);


export function useAuth() {
    const [authUser, setAuthUser] = useState<UserInfo>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(
            (user) => {
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
