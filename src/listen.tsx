import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { getAudioFromStorage } from './firebase/firebaseRepository';

export function Listen() {
  const [url, setUrl] = React.useState<string>();
  const q = useLocation();

  React.useEffect(() => {
    const filename = new URLSearchParams(q.search).get('filename');
    console.log('Requested filename:', filename);
    if (filename) {
      getAudioFromStorage(filename).then((link) => setUrl(link));
    }
  }, []);

  return (
    <div>
      Listen
      <audio className="w-full" src={url} controls></audio>
    </div>
  );
}
