import 'firebase/auth';
import 'firebase/firestore';
import { firestoreDb, auth } from './firebaseAuthentication';

export type NewSong = {
  songArtist: string;
  songTitle: string;
};

export type Song = {
  id: string;
  songArtist: string;
  songTitle: string;
};

export function writeSongToFirestore(songArtist: string, songTitle: string) {
  const song: NewSong = {
    songArtist,
    songTitle,
  };

  auth.onAuthStateChanged((user) => {
    if (user) {
      const songsCollection = firestoreDb.collection(`users/${user.uid}/songs`);

      songsCollection
        .add(song)
        .then((docRef) => {
          console.log('Song id:', docRef.id);
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  });
}

export function readSongsFromFirestore(): Promise<Song[]> {
  return new Promise<Song[]>((resolve) => {
    const songs: Song[] = [];

    auth.onAuthStateChanged((user) => {
      if (user) {
        const songsCollection = firestoreDb.collection(
          `users/${user.uid}/songs`,
        );

        songsCollection.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            songs.push({ id: doc.id, ...(<NewSong>doc.data()) });
          });
          resolve(songs);
        });
      }
    });
  });
}

export function deleteSongFromFirestore(songId: string) {
  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const songDocument = firestoreDb.doc(
          `users/${user.uid}/songs/${songId}`,
        );

        songDocument
          .delete()
          .then(() => {
            console.log('Successfully deleted document id: ', songDocument.id);
            resolve();
          })
          .catch((error: any) => console.error(error));
      }
    });
  });
}

export function getSongFromFirestore(songId: string): Promise<Song> {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const songDocument = firestoreDb.doc(
          `users/${user.uid}/songs/${songId}`,
        );

        songDocument.get().then((song) => {
          if (song.exists) {
            resolve({ id: song.id, ...(<NewSong>song.data()) });
          } else {
            reject('Song does not exists');
          }
        });
      }
    });
  });
}

export function updateSongInFirebase(song: Song) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      const songDocument = firestoreDb.doc(
        `users/${user.uid}/songs/${song.id}`,
      );

      return songDocument.update({
        songArtist: song.songArtist,
        songTitle: song.songTitle,
      });
    } else {
    }
  });
}
