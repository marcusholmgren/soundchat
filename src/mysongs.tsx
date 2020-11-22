import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  deleteSongFromFirestore,
  readSongsFromFirestore,
  Song,
} from './firebase/firebaseRepository';

export function MySongs() {
  const [songs, setSongs] = useState<Song[]>();
  const navigate = useNavigate();

  useEffect(() => {
    readSongsFromFirestore().then(setSongs);
  }, []);

  function deleteSong(song: Song) {
    deleteSongFromFirestore(song.id);
    if (songs) {
      setSongs(songs.filter((s) => s.id !== song.id));
    }
  }

  function editSong(song: Song) {
    navigate(`/edit/${song.id}`);
  }

  return (
    <>
      <div className="pb-5 border-b border-gray-200">
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          My Songs
        </h2>
      </div>
      <SongsTable songs={songs} deleteSong={deleteSong} editSong={editSong} />
    </>
  );
}

interface SongsTableProps {
  songs: Song[] | undefined;
  deleteSong: (song: Song) => void;
  editSong: (song: Song) => void;
}

function SongsTable({ songs, deleteSong, editSong }: SongsTableProps) {
  function OddRow({ song }: { song: Song }) {
    return (
      <tr className="bg-white">
        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
          {song.songArtist}
        </td>
        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
          {song.songTitle}
        </td>
        {/*              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                jane.cooper@example.com
              </td>
              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                Admin
              </td>
              */}
        <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
          <a
            onClick={() => editSong(song)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </a>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
          <a
            onClick={() => deleteSong(song)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Delete
          </a>
        </td>
      </tr>
    );
  }

  function EvenRow({ song }: { song: Song }) {
    return (
      <tr className="bg-gray-50">
        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
          {song.songArtist}
        </td>
        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
          {song.songTitle}
        </td>
        {/*              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                cody.fisher@example.com
              </td>
              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                Owner
              </td>
              */}
        <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
          <a
            onClick={() => editSong(song)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </a>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
          <a
            onClick={() => deleteSong(song)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Delete
          </a>
        </td>
      </tr>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Artist
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Song
                  </th>
                  {/*            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>*
              <th className="px-6 py-3 bg-gray-50"></th>
              */}
                  <th className="px-6 py-3 bg-gray-50"></th>
                  <th className="px-6 py-3 bg-gray-50"></th>
                </tr>
              </thead>
              <tbody>
                {songs
                  ? songs.map((song, i) =>
                      i % 2 == 0 ? (
                        <OddRow key={song.id} song={song} />
                      ) : (
                        <EvenRow key={song.id} song={song} />
                      ),
                    )
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
