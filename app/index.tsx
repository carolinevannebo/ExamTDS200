// Entry point

import React from "react";
import { Redirect } from "expo-router";
import { auth } from "./services/firebaseconfig";

const index = () => {
    const userSignedIn = auth.currentUser;
    const initialRouteName = userSignedIn ? 'pages/HomePage' : 'pages/WelcomePage';

    return <Redirect href={initialRouteName}/>
}
export default index;