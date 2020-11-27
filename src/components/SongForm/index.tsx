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
            name="song-title-input"
            className="form-input block w-full sm:text-sm sm:leading-5"
            placeholder="Song title"
            autoComplete="off"
            required
            aria-required="true"
          />
        </div>

        <div className="sm:col-span-6">
          <label
            htmlFor="cover_photo"
            className="block text-sm font-medium text-gray-700"
          >
            Cover photo
          </label>
          <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm text-gray-600">
                <label className="bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Upload a file
                  <input
                    name="song-file"
                    type="file"
                    title="Upload a file"
                    className="hidden"
                  />
                </label>
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
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
