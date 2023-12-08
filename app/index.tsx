import React from "react";
import { Redirect } from "expo-router";
import InitialNavigation from "./routes/InitialNavigation";

const index = () => {
    return <InitialNavigation/>//<Redirect href="/pages/WelcomePage" />;
}

export default index;