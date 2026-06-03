interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: { credential: string }) => void;
        }) => void;
        renderButton: (
          parent: HTMLElement,
          options: {
            theme: 'outline' | 'filled_blue' | 'filled_black';
            size: 'small' | 'medium' | 'large';
            text?: 'signin_with' | 'signup_with' | 'continue_with';
          },
        ) => void;
      };
    };
  };
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
}
