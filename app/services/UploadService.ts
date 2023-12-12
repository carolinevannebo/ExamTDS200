import { Post, User } from "../models";
import { auth, db } from "./firebaseconfig";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import DownloadService from "./DownloadService";
import { useState } from "react";
import {  
    ref, 
    listAll, 
    getStorage, 
    getDownloadURL,
    uploadBytesResumable
} from "firebase/storage";
import { 
    doc, 
    setDoc, 
    GeoPoint, 
    collection, 
    DocumentData, 
    serverTimestamp, 
    DocumentReference,
    updateDoc
} from "firebase/firestore/lite";

const UploadService = (
    () => {
      const [imageUrl, setImageUrl] = useState<string>('');
      const [imageName, setImageName] = useState<string>('');
      const [imageLocation, setImageLocation] = useState<GeoPoint | undefined>(undefined);
      //const [post, setPost] = useState<Post>();
      //const [user, setUser] = useState<User>();
      //const [postDocRef, setPostDocRef] = useState<DocumentReference<DocumentData, DocumentData>>();
      //const [userDocRef, setUserDocRef] = useState<DocumentReference<DocumentData, DocumentData>>();
      /*let userDocRef: DocumentReference<DocumentData, DocumentData>;
      let postDocRef: DocumentReference<DocumentData, DocumentData>;
      let post: Post = {
          imageName: '',
          imageUrl: '',
          createdAt: serverTimestamp(),
          location: undefined,
          description: '',
      };
      let user: User = {
        uid: '',
        email: '',
        userName: '',
        displayName: '',
        bio: '',
        profilePicture: '',
        following: [],
        followers: [],
        posts: [],
      };*/

        /*const getUserInfo = async () => {
            const user = auth.currentUser;
            if (!user) {
              throw new Error('No user signed in');
            }
            const userRef = doc(db, `users/${user.uid}`);
            const userSnap = await userRef.get();
          
            if (userSnap.exists()) {
              console.log('User data:', userSnap.data());
              return userSnap.data();
            } else {
              console.log('No such user!');
            }
      }*/

      const getImageName = (fileName: string) => {
          return fileName.slice(0, fileName.lastIndexOf('.'));
      }

      const uploadImage = async (
          uri: string, 
          imageName: string, 
          onProgress: any,
          location?: GeoPoint | undefined ) => {
          //const user = auth.currentUser;
          //console.log('userID', user?.uid);
          
          if (!auth.currentUser) {
            throw new Error('No user signed in');
          }
          
          const response = await fetch(uri);
          const blob = await response.blob();
          
          const imageRef = ref(getStorage(), `images/${auth.currentUser.uid}/${imageName}`);
          const uploadTask = uploadBytesResumable(imageRef, blob);
          
          return new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                );

                onProgress && onProgress(progress);
                console.log(`Upload is ${progress}% done`);
              },
              (error) => {
                console.log(error);
                reject(error);
              },
              async () => {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        
                // Finally, resolve the promise with the download URL
                resolve({ 
                  downloadUrl, 
                  metadata: uploadTask.snapshot.metadata,
                });
          
                setImageUrl(downloadUrl);
                setImageName(imageName);
                setImageLocation(location);

                // TODO: OMG REFAKTORER DET NED, du kan heller sette downloadurl
                // Add image to user, sending to firestore
                //const userImagesCollection = collection(db, `users/${auth.currentUser?.uid}/posts`);
                //setPostDocRef(doc(userImagesCollection, getImageName(imageName)));
                /*setPost({
                  imageName: imageName,
                  imageUrl: downloadUrl,
                  createdAt: serverTimestamp(),
                  location: location,
                  description: "",
                });*/

                // Update user profile picture
                /*const userRef = doc(db, `users/${auth.currentUser?.uid}`);
                setUserDocRef(userRef);
                DownloadService.getCurrentUser()
                .then((user) => {
                  setUser(user);
                })
                .then(() => { // er ikke bra å bruke så mye force unwrap
                  user!.profilePicture = downloadUrl;
                  console.log('user has modified profile picture', user);
                })
                .then(() => {
                  setDoc(userRef, user);
                })
                .catch((error) => {
                  console.error('Error updating user profile picture:', error);
                });*/

                //postDocRef = doc(userImagesCollection, getImageName(imageName));
        
                /*post = {
                  imageName: imageName,
                  imageUrl: downloadUrl,
                  createdAt: serverTimestamp(),
                  location: location,
                  description: "",
                };*/
                //console.log('post', post);
                  //uploadPost(post);
              }
            );
          })
      };

      const uploadProfilePicture = () => {
        const userDocRef = doc(db, `users/${auth.currentUser?.uid}`);
        updateDoc(userDocRef, {
          profilePicture: imageUrl
        })
        .then(() => {
          ReactNativeAsyncStorage.setItem(`${auth.currentUser?.uid}/profilePicture`, JSON.stringify(imageUrl))
          .then(() => { console.log('Profile picture stored in AsyncStorage'); })
        })
        .catch((error) => {
          console.error('Error updating user profile picture:', error);
        });
      };

      const uploadDisplayName = (displayName: string) => {
        const userDocRef = doc(db, `users/${auth.currentUser?.uid}`);
        updateDoc(userDocRef, {
          name: displayName
        })
        .then(() => {
          ReactNativeAsyncStorage.setItem(`${auth.currentUser?.uid}/displayName`, JSON.stringify(displayName))
          .then(() => { console.log('Display name stored in AsyncStorage'); })
        })
        .catch((error) => {
          console.error('Error updating display name:', error);
        });
      };

      const uploadBio = (bio: string) => {
        const userDocRef = doc(db, `users/${auth.currentUser?.uid}`);
        updateDoc(userDocRef, {
          bio: bio
        })
        .then(() => {
          ReactNativeAsyncStorage.setItem(`${auth.currentUser?.uid}/bio`, JSON.stringify(bio))
          .then(() => { console.log('Biography stored in AsyncStorage'); })
        })
        .catch((error) => {
          console.error('Error updating Biography:', error);
        });
      };

      const uploadPost = (withDescription: string) => {
          //post!.description = withDescription;
          //console.log('post with description', post);
          const userImagesCollection = collection(db, `users/${auth.currentUser?.uid}/posts`);
          const postDocRef = doc(userImagesCollection, imageName);
          const post: Post = {
            imageName: imageName,
            imageUrl: imageUrl,
            createdAt: serverTimestamp(),
            location: imageLocation,
            description: withDescription,
          };

          setDoc(postDocRef, post);

          ReactNativeAsyncStorage.setItem(`${auth.currentUser?.uid}/posts`, JSON.stringify(post))
          .then(() => {
            console.log('Post stored in AsyncStorage');
          })
          .catch((error) => {
            console.error('Error storing user data in AsyncStorage:', error);
          });
          
          console.log('Upload is complete!');
      };
          
      const listFiles = async () => {
          const user = auth.currentUser;
          const listRef = ref(getStorage(), `images/${user?.uid}/`);
          const response = await listAll(listRef);
        
          return response.items;
      };

      return {
          //post,
          uploadImage,
          uploadProfilePicture,
          uploadDisplayName,
          uploadBio,
          uploadPost,
          listFiles
      };
    }
)();

export default UploadService;