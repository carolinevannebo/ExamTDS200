import { FieldValue, GeoPoint } from "firebase/firestore/lite";

export interface Post {
    imageName: string;
    imageUrl: string;
    createdAt: FieldValue;
    location: GeoPoint | undefined;
    description: string;
}