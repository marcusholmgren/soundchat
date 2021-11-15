import {
    doc,
    deleteDoc,
    updateDoc,
    addDoc,
    collection,
    query,
    getDoc,
    getDocs
} from "firebase/firestore";
import {getDownloadURL, uploadBytes, ref} from "firebase/storage";
import {cloudStorage, firestoreDb, auth} from './firebaseAuthentication';

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
            const songsCollection = collection(firestoreDb, `users/${user.uid}/songs`);

            addDoc(songsCollection, song)
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
    const fileRef = ref(cloudStorage, `songs/${userId}/${docRefId}-${file.name}`);

    uploadBytes(fileRef, file)
        .then((snapshot) => {
            console.log('Size:', snapshot.metadata.size);
            console.log('Name:', snapshot.ref.name);
            console.log('Uploaded a blob or file!');
        })
        .catch((error) => {
            console.error('There was an error when saving to Cloud Storage', error);
        });
}

export function readSongsFromFirestore(): Promise<Song[]> {
    return new Promise<Song[]>(async (resolve) => {
        const songs: Song[] = [];
        const user = auth.currentUser;
        if (user) {
            const songsCollection = collection(firestoreDb,
                `users/${user.uid}/songs`,
            );

            const q = query(songsCollection);
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                songs.push({id: doc.id, ...(<NewSong>doc.data())});
            });
            resolve(songs);
        }
    });
}

export function deleteSongFromFirestore(songId: string): Promise<boolean> {
    return new Promise((resolve) => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const songDocument = doc(firestoreDb,
                    `users/${user.uid}/songs/${songId}`,
                );

                await deleteDoc(songDocument);
                console.log('Successfully deleted document id: ', songDocument.id);
            }
        });
    });
}

export function getSongFromFirestore(songId: string): Promise<Song> {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const songDocument = doc(firestoreDb,
                    `users/${user.uid}/songs/${songId}`,
                );

                const song = await getDoc(songDocument);
                if (song.exists()) {
                    resolve({id: song.id, ...(<NewSong>song.data())});
                } else {
                    reject('Song does not exists');
                }
            }
        });
    });
}

export function updateSongInFirebase(song: Song) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            const songDocument = doc(firestoreDb,
                `users/${user.uid}/songs/${song.id}`,
            );

            return updateDoc(songDocument, {
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
                const fileRef = ref(cloudStorage, `songs/${user.uid}/${fileName}`);

                getDownloadURL(fileRef)
                    .then((url) => {
                        resolve(url);
                    })
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
