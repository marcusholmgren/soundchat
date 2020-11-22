import React from 'react';
import type { Song } from '@app/firebase/firebaseRepository';

interface SongFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function SongForm({ onSubmit }: SongFormProps) {
  return (
    <form className="grid gap-4 grid-cols-1 max-w-md" onSubmit={onSubmit}>
      <div>
        <label
          htmlFor="artist-input"
          className="block text-sm font-medium leading-5 text-gray-700"
        >
          Artist
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            id="artist-input"
            name="artist-input"
            className="form-input block w-full sm:text-sm sm:leading-5"
            placeholder="Artist"
            autoComplete="off"
            required
            aria-required="true"
            autoFocus
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="song-title-input"
          className="block text-sm font-medium leading-5 text-gray-700"
        >
          Song title
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            id="song-title-input"
            name="song-title-input"
            className="form-input block w-full sm:text-sm sm:leading-5"
            placeholder="Song title"
            autoComplete="off"
            required
            aria-required="true"
          />
        </div>
      </div>

      <span className="inline-flex rounded-md shadow-sm">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
        >
          Save
        </button>
      </span>
    </form>
  );
}

interface EditSongFormProps {
  song: Song;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function EditSongForm({ song, onSubmit }: EditSongFormProps) {
  return (
    <form className="grid gap-4 grid-cols-1 max-w-md" onSubmit={onSubmit}>
      <input name="song-id" type="hidden" value={song.id} />
      <div>
        <label
          htmlFor="artist-input"
          className="block text-sm font-medium leading-5 text-gray-700"
        >
          Artist
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            id="artist-input"
            name="artist-input"
            className="form-input block w-full sm:text-sm sm:leading-5"
            placeholder="Artist"
            autoComplete="off"
            required
            aria-required="true"
            defaultValue={song.songArtist}
            autoFocus
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="song-title-input"
          className="block text-sm font-medium leading-5 text-gray-700"
        >
          Song title
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            id="song-title-input"
            name="song-title-input"
            className="form-input block w-full sm:text-sm sm:leading-5"
            placeholder="Song title"
            autoComplete="off"
            required
            aria-required="true"
            defaultValue={song.songTitle}
          />
        </div>
      </div>

      <span className="inline-flex rounded-md shadow-sm">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
        >
          Save changes
        </button>
      </span>
    </form>
  );
}
