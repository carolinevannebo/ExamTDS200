# TravelSnap TDS200 Exam (2023)

This technical task is built on top of the theoretical analysis from Task 1. 
Regardless of your conclusion made for Task 1 about the suggested development approach, you should develop the TravelSnap application using either Ionic + Vue or React Native for frontend, and Firebase as backend as a service.

## Four primary requirements for implementation (no priority order by numbering):
- Present an overview of all traveller photos that are retrieved from Firebase. This can, for example, to be in a list or grid format.
- Ensure that each travel photo is clickable to access a detailed view or information.
- Develop a secure and intuitive interface where users can upload new traveller photos directly from camera or select from existing gallery. Along with the photo, users shall be able to add captions and additional information before storing in Firebase.
- Allow users to navigate seamlessly between different pages, i.e., the photo overview, detailed view, and upload images.

The four points mentioned above present the minimum requirement for the assignment. For those aiming for a higher grade, more functionalities and complexity in the implementation is expected.

## Solution

### Features
- User management with Firebase Authentication and Firestore.
- Register, log in & log out functionality (Only logged in users can enter the app).
- User state management with context provider.
- Services to communicate with backend.
- Manage image uploads with Firebase Storage
- Custom navigation between pages, components and modals using hooks and nesting for screens and tabs.
- Profile page per user including user information, gallery of their posts and map of image locations.
- Settings modal where user can update their information and change profile picture.
- Feed for browsing travel photos.
- Detail page where user can see post, map of where image was taken, leave a comment, delete their own comment, and navigate to author's profile page.
- Create post modal where user can take a picture with their camera or upload an image from their gallery, write a description and upload post that will include timestamp and location.
- Loading spinner for uploading a post.
- Custom UI elements.
- Error alerts.

### Usage
- npm i
- npx expo start
- s
- scan QR code

### Packages

## Notes
- The application should be run with expo go. During this project I've tested both expo go and development build for iOS and web. However, development build for iOS has not been updated and should not be considered.
- The last 24 hours before delivery, the project reached the max quota in Firebase storage. Before this, uploading images worked as expected. I am currently unable to test this functionality again before the deadline without upgrading my plan. See screenshot attatchments.
- Initially the app used expo-router, this is no longer used other than entering the app. Project should be restructured.

### Further development
- Implement like-functionality for heart-icon buttons.
- Implement more colors for the visual design, especially accent colors.
- Implement splash screen for entering application to distract user while data is loading.
- Implement a button with a magnifying glass icon in the feed page. Upon clicking, search field should expand and component should handle search by usernames, captions, or locations. Last one could be handled with a reverse geocoding API: https://openweathermap.org/api/geocoding-api
- Refactor styles into a styleguide or use nativewind. It is bad practice to have a stylesheet for every file.
- Refactor repeating functions in download service to improve reusability and readability.
- Move register component's backend logic. Seperate concerns.
- Move imagepicker logic into it's own file for reusability. Repeating code is bad practice.
- Set map region for profile page based on last post location.

### Warnings
- Require cycle warning started appearing after I optimized imports with index files, it stems from require call for placeholder profile picture and background images for initial navigation.

### Bugs
- Data loading: Sometimes when first starting the app as an already logged in user, the feed page is blank as it renders empty before data is loaded. Switching tab and re-entering will display posts as expected.
- User state: After logging out as user1 and logging in as user2, user1's profile page is still displayed until resfreshing or re-entering profile page.
- Rendering: Upon Firebase storage error "Failed to load" when denied access, images that are not rendered still takes up whitespace.
- Unexpected behavior: When logged in user navigates to another user's profile page, they can open the settings modal and edit their own data.
- Unexpected behavior: When registering as a new user, input validation for repeat password does not update as it should after wrong input. For example: "repeat password does not match password", changing it to correct password will still lead to error alert.
- Data modeling: Logged in user cannot comment on their own post, this is because of a mistake I made by passing the entire user object to author in commentData. Should be fixed by changing to author ID.
- Navigation: When user navigates to profile page of the post author, and then chooses to open another post detail page from the gallery, it navigates to the first post detail page again. State is not changed.
- Firestore throws errors when firebase config properties are located in .env.


### Sources
- Nguyen, J. (2022, March 12). React-Navigation Gradient Background - John Nguyen - Medium. Medium. https://medium.com/@dev-john-nguyen/react-navigation-gradient-background-fc8d929386df
- Aaron Saunders. (2023, June 7). React Native Expo Firebase -   Simplify Your Image Uploads with Image Picker Camera [ Video ]. YouTube. https://www.youtube.com/watch?v=tX_HPvwB-5c
