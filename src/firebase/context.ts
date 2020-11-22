import { createContext } from 'react';
import type firebase from 'firebase';

type AuthenticationContext = {
  user: firebase.User | undefined;
};

export const FirebaseContext = createContext<AuthenticationContext>({
  user: undefined,
});
