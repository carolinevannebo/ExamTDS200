import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { ImageBackground } from 'react-native';

type BackgroundImageProps = {
    children: React.ReactNode;
}

const bgImgSourceIOS = require('./images/bg-ios.jpg');
const bgImgSourceWeb = require('./images/bg-web.jpg');

const BackgroundImage = ({children}: BackgroundImageProps) => {
    const bgImgSource = Platform.OS === 'web' ? bgImgSourceWeb : bgImgSourceIOS;

    return (
        <ImageBackground source={bgImgSource} style={styles.background}>
            {children}
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
});

export default BackgroundImage;