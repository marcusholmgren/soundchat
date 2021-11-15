import { createContext } from 'react';
import type {UserInfo} from 'firebase/auth';

type AuthenticationContext = {
  user: UserInfo | undefined;
};

export const FirebaseContext = createContext<AuthenticationContext>({
  user: undefined,
});
