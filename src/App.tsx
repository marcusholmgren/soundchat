import React from 'react';

type SessionUser = {
  email: string;
  status: 'invited' | 'active' | 'revoked';
};

const SESSION_TOKEN_STORAGE_KEY = 'soundchat-session-token';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  const googleButtonRef = React.useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(
    null,
  );

  const applySession = React.useCallback((token: string, user: SessionUser) => {
    localStorage.setItem(SESSION_TOKEN_STORAGE_KEY, token);
    setCurrentUser(user);
    setErrorMessage('');
  }, []);

  const clearSession = React.useCallback(() => {
    localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
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
    const existingToken = localStorage.getItem(SESSION_TOKEN_STORAGE_KEY);
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
      setErrorMessage('Missing VITE_GOOGLE_CLIENT_ID environment variable.');
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
    script.addEventListener('load', renderGoogleButton);
    document.body.appendChild(script);

    return () => script.removeEventListener('load', renderGoogleButton);
  }, [authenticateWithBackend, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          {/* Pulsing loading animation */}
          <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin"></div>
          <p className="text-slate-400 font-medium tracking-wide animate-pulse">
            Loading session…
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: SessionUser['status']) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'invited':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'revoked':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans p-6 relative overflow-hidden">
      {/* Decorative blurred background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <main className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl z-10">
        <div className="flex flex-col items-center text-center">
          {/* Logo Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20 mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight font-display bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-2">
            Soundchat
          </h1>
          <p className="text-slate-400 text-sm mb-8 font-medium">
            Listen, share, and connect through tunes
          </p>

          {currentUser ? (
            <div className="w-full space-y-6">
              <div className="bg-slate-950/50 border border-slate-800/50 rounded-xl p-5 text-left space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Signed in as
                  </label>
                  <p className="text-slate-200 font-medium break-all">
                    {currentUser.email}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Access Status
                  </label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(currentUser.status)}`}
                  >
                    {currentUser.status}
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold py-2.5 px-4 rounded-xl border border-slate-700/50 transition duration-200 shadow-sm cursor-pointer"
                type="button"
                onClick={clearSession}
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="w-full space-y-6">
              <p className="text-slate-300 text-sm">
                Sign in with Google to access your dashboard.
              </p>

              <div className="flex justify-center py-2">
                <div
                  ref={googleButtonRef}
                  className="transition duration-150 transform hover:scale-[1.01]"
                />
              </div>
            </div>
          )}

          {errorMessage ? (
            <div className="mt-6 w-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl p-3.5 text-left break-words">
              {errorMessage}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default App;
