import { Post } from "../models/Post";
import { auth, db } from "./firebaseconfig";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
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
    DocumentReference
} from "firebase/firestore/lite";

const UploadService = (
    () => {
        let postDocRef: DocumentReference<DocumentData, DocumentData>;
        let post: Post = {
            imageName: '',
            imageUrl: '',
            createdAt: serverTimestamp(),
            location: undefined,
            description: '',
        };

        const getImageName = (fileName: string) => {
            return fileName.slice(0, fileName.lastIndexOf('.'));
        }

        const uploadImage = async (
            uri: string, 
            imageName: string, 
            location: GeoPoint | undefined,
            onProgress: any ) => { // todo: finn type til any
              
            const user = auth.currentUser;
            console.log('userID', user?.uid);
          
            if (!user) {
              throw new Error('No user signed in');
            }
          
            const response = await fetch(uri);
            const blob = await response.blob();
          
            const imageRef = ref(getStorage(), `images/${user.uid}/${imageName}`);
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
          
                  // Add image to user, sending to firestore
                  const userImagesCollection = collection(db, `users/${auth.currentUser?.uid}/posts`);
                  postDocRef = doc(userImagesCollection, getImageName(imageName));
          
                  post = {
                    imageName: imageName,
                    imageUrl: downloadUrl,
                    createdAt: serverTimestamp(),
                    location: location,
                    description: "",
                  };
                  console.log('post', post);
          
                  //uploadPost(post);
                }
              );
            })
        };

        const uploadPost = async (withDescription: string) => {
            // This looks unlogical, should be a better way
            post.description = withDescription;
            console.log('post with description', post);
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
            post,
            uploadImage,
            uploadPost,
            listFiles
        };
    }
)();

export default UploadService;