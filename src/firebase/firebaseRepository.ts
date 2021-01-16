import firebase from 'firebase/app';
import { cloudStorage, firestoreDb, auth } from './firebaseAuthentication';

export type NewSong = {
  songArtist: string;
  songTitle: string;
  songFile: string;
  fileType: string;
};

export type Song = {
  id: string;
  songArtist: string;
  songTitle: string;
};

export function writeSongToFirestore(
  songArtist: string,
  songTitle: string,
  songFile: File,
) {
  const song: NewSong = {
    songArtist,
    songTitle,
    songFile: songFile.name,
    fileType: songFile.type,
  };

  auth.onAuthStateChanged((user) => {
    if (user) {
      const songsCollection = firestoreDb.collection(`users/${user.uid}/songs`);

      songsCollection
        .add(song)
        .then((docRef) => {
          console.log('Song id:', docRef.id);
          saveSongFile(user.uid, docRef.id, songFile);
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  });
}

function saveSongFile(userId: string, docRefId: string, file: File) {
  const fileRef = cloudStorage.ref(`songs/${userId}/${docRefId}-${file.name}`);
  const uploadTask = fileRef.put(file);

  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED,
    function progress(snapshot) {
      console.log('Bytes transferred:', snapshot.bytesTransferred);
      console.log('Total bytes:', snapshot.totalBytes);
    },
    function error(error) {
      console.error('There was an error when saving to Cloud Storage', error);
    },
    function complete() {
      console.log('The file has been successfully saved to Cloud Storage');
    },
  );
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

export function deleteSongFromFirestore(songId: string): Promise<boolean> {
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
            resolve(true);
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

export function getAudioFromStorage(fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const fileRef = cloudStorage.ref(`songs/${user.uid}/${fileName}`);

        fileRef
          .getDownloadURL()
          .then((url) => resolve(url))
          .catch((error) => {
            console.error(
              'There was an error while retreiving a file from Cloud Storage',
              error,
            );
            reject(error);
          });
      } else {
        reject('User does not exists');
      }
    });
  });
}
