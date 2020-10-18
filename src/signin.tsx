import React from 'react';
import { auth, provider } from './firebase/firebaseAuthentication';

export function Signin() {
  function signinGoogle() {
    console.log('Signin with Google');
    //auth.signInWithPopup()
    //const provider = new auth..GoogleAuthProvider();
    //provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    auth
      .signInWithPopup(provider)
      .then((result) =>
        console.log('successfully logged in', result.user?.displayName),
      )
      .catch((error) => console.error(error));

    //const fire = new Firebase();
    //fire.googleSignin();
  }

  return (
    <div>
      <h2>Sign In</h2>
      <button
        id="signin-google"
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
        onClick={signinGoogle}
      >
        Sign in with Google
      </button>
    </div>
  );
}
