import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditSongForm } from './components/SongForm';
import {
  getSongFromFirestore,
  updateSongInFirebase,
  Song,
} from './firebase/firebaseRepository';
import { useEffect, useState } from 'react';

interface EditTuneForm {
  'song-id': HTMLInputElement;
  'artist-input': HTMLInputElement;
  'song-title-input': HTMLInputElement;
  reset: () => void;
}

export function EditTune() {
  const { songId } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState<Song>();

  useEffect(() => {
    getSongFromFirestore(songId).then(setSong);
  }, []);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // @ts-ignore
    const form: EditTuneForm = event.target;
    const songId: string = form['song-id'].value;
    const songArtist: string = form['artist-input'].value;
    const songTitle: string = form['song-title-input'].value;

    updateSongInFirebase({ id: songId, songArtist, songTitle });
    navigate('/my-songs');
  }

  return (
    <>
      <div className="pb-5 border-b border-gray-200">
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          Edit song
        </h2>
      </div>
      {song ? <EditSongForm onSubmit={onSubmit} song={song} /> : null}
    </>
  );
}
