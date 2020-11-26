import React from 'react';
import { writeSongToFirestore } from './firebase/firebaseRepository';
import { SongForm } from './components';

export function AddTune() {
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const artist = data.get('artist-input') as string;
    const songTitle = data.get('song-title-input') as string;
    const songFile = data.get('song-file') as File;

    writeSongToFirestore(artist, songTitle, songFile);

    event.currentTarget.reset();
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
