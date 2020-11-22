import React from 'react';
import { writeSongToFirestore } from './firebase/firebaseRepository';
import { SongForm } from './components';

interface AddTuneForm {
  'artist-input': HTMLInputElement;
  'song-title-input': HTMLInputElement;
  reset: () => void;
}

export function AddTune() {
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // @ts-ignore
    const form: AddTuneForm = event.target;
    const songArtist: string = form['artist-input'].value;
    const songTitle: string = form['song-title-input'].value;

    writeSongToFirestore(songArtist, songTitle);

    form.reset();
  }

  return (
    <>
      <div className="pb-5 border-b border-gray-200">
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          Add new songs
        </h2>
      </div>
      <SongForm onSubmit={onSubmit} />
    </>
  );
}
