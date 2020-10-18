import {createContext} from 'react';
import firebase from "firebase";

interface AuthenticationContext  {
    user: firebase.User | null;
}

export const FirebaseContext = createContext<AuthenticationContext>({user: null});

