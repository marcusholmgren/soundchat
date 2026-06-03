import React from 'react';
import './App.css';

type SessionUser = {
  email: string;
  status: 'invited' | 'active' | 'revoked';
};

const SESSION_STORAGE_KEY = 'soundchat-session-token';
const apiBaseUrl =
  import.meta.env.SNOWPACK_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const googleClientId = import.meta.env.SNOWPACK_PUBLIC_GOOGLE_CLIENT_ID;

function App() {
  const googleButtonRef = React.useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(
    null,
  );

  const applySession = React.useCallback((token: string, user: SessionUser) => {
    localStorage.setItem(SESSION_STORAGE_KEY, token);
    setCurrentUser(user);
    setErrorMessage('');
  }, []);

  const clearSession = React.useCallback(() => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setCurrentUser(null);
  }, []);

  const authenticateWithBackend = React.useCallback(
    async (idToken: string) => {
      const response = await fetch(`${apiBaseUrl}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Authentication failed.');
      }

      applySession(payload.token, payload.user);
    },
    [applySession],
  );

  React.useEffect(() => {
    const existingToken = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!existingToken) {
      setLoading(false);
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/me`, {
          headers: {
            Authorization: 'Bearer ' + existingToken,
          },
        });

        if (!response.ok) {
          throw new Error('Session expired');
        }

        const payload = await response.json();
        setCurrentUser(payload);
      } catch (error) {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [clearSession]);

  React.useEffect(() => {
    if (currentUser) {
      return;
    }
    if (!googleClientId) {
      setErrorMessage(
        'Missing SNOWPACK_PUBLIC_GOOGLE_CLIENT_ID environment variable.',
      );
      return;
    }

    const renderGoogleButton = () => {
      if (!window.google || !googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response: { credential: string }) => {
          if (!response.credential) {
            setErrorMessage('No Google credential returned.');
            return;
          }

          try {
            await authenticateWithBackend(response.credential);
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Authentication failed.';
            setErrorMessage(message);
          }
        },
      });

      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
      });
    };

    if (window.google) {
      renderGoogleButton();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-google-identity]',
    );
    if (existingScript) {
      existingScript.addEventListener('load', renderGoogleButton);
      return () =>
        existingScript.removeEventListener('load', renderGoogleButton);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = 'true';
    script.onload = renderGoogleButton;
    document.body.appendChild(script);

    return () => script.removeEventListener('load', renderGoogleButton);
  }, [authenticateWithBackend, currentUser]);

  if (loading) {
    return (
      <div className="App">
        <main className="App-main">
          <p>Loading session…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <main className="App-main">
        <h1>Soundchat</h1>
        {currentUser ? (
          <>
            <p>Signed in as {currentUser.email}</p>
            <p>Access status: {currentUser.status}</p>
            <button className="App-button" type="button" onClick={clearSession}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <p>Sign in with Google to continue.</p>
            <div ref={googleButtonRef} />
          </>
        )}
        {errorMessage ? <p className="App-error">{errorMessage}</p> : null}
      </main>
    </div>
  );
}

export default App;
