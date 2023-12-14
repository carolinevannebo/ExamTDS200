// Service to create/update/delete user data in Firebase

import { CommentData, Post } from "../models";
import { auth, db } from "./firebaseconfig";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
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
    serverTimestamp,
    updateDoc,
    addDoc,
    getDocs,
    getDoc,
    deleteDoc
} from "firebase/firestore/lite";

const UploadService = (
    () => {
      const [imageUrl, setImageUrl] = useState<string>('');
      const [imageName, setImageName] = useState<string>('');
      const [imageLocation, setImageLocation] = useState<GeoPoint | undefined>(undefined);

      const getImageName = (fileName: string) => {
          return fileName.slice(0, fileName.lastIndexOf('.'));
      }

      const uploadImage = async (
          uri: string, 
          imageName: string, 
          onProgress: any,
          location?: GeoPoint | undefined ) => {
          
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
        
                if (downloadUrl) {
                  setImageUrl(downloadUrl);
                  setImageName(imageName);
                  setImageLocation(location);
                }

                // Finally, resolve the promise with the download URL
                resolve({ 
                  downloadUrl, 
                  metadata: uploadTask.snapshot.metadata,
                });
              },
            );
          });
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
          const userImagesCollection = collection(db, `users/${auth.currentUser?.uid}/posts`);
          console.log("Image name in uploadPost: " + imageName)

          if (!auth.currentUser) {
            throw new Error('No user signed in');
          }
          if (!imageUrl) {
            throw new Error('No image URL provided');
          }

          if (!imageName) {
            throw new Error('No image name provided');
          }

          const postDocRef = doc(userImagesCollection, imageName); // is it possible imagename is not set?
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

      const uploadComment = (userId: string, postId: string, comment: CommentData) => {
        const commentsCollection = collection(db, `users/${userId}/posts/${postId}/comments`);

        addDoc(commentsCollection, comment)
        .then((docRef) => {
          console.log('Comment written with ID: ', docRef.id);
        })
        .catch((error) => {
          console.error('Error adding comment: ', error);
        });
      };

      // Note: you should've just added id to each comment, this is unnecessary
      const deleteComment = async (userId: string, postId: string, comment: CommentData) => {
        const commentsCollectionRef = collection(db, `users/${userId}/posts/${postId}/comments`);
        const commentsSnapshot = await getDocs(commentsCollectionRef);
        if (commentsSnapshot.empty) {
          console.log("No posts for user: " + userId)
          return;
        }

        const documents = commentsSnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });

        for (const document of documents) {
          const commentDocRef = doc(db, `users/${userId}/posts/${postId}/comments/${document.id}`);
          const commentDoc = await getDoc(commentDocRef);
          const commentData = commentDoc.data() as CommentData;
          const commentRef: CommentData = {
            author: commentData.author,
            text: commentData.text,
            date: commentData.date,
          };
          
          if (commentRef.author.uid === comment.author.uid && commentRef.text === comment.text) {
            console.log('Comment found, deleting...', commentRef);
            await deleteDoc(commentDocRef);
            console.log('Comment deleted');
            break;
          }
        }
      };
          
      // Unused at the moment
      const listFiles = async () => {
          const user = auth.currentUser;
          const listRef = ref(getStorage(), `images/${user?.uid}/`);
          const response = await listAll(listRef);
        
          return response.items;
      };

      return {
          uploadImage,
          uploadProfilePicture,
          uploadDisplayName,
          uploadBio,
          uploadPost,
          uploadComment,
          deleteComment,
          listFiles
      };
    }
)();

export default UploadService;