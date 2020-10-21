import { createContext } from 'react';
import type firebase from 'firebase';

type AuthenticationContext = {
  user: firebase.User | null;
}

export const FirebaseContext = createContext<AuthenticationContext>({
  user: null,
});
