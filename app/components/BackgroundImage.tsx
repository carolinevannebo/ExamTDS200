// Background image to wrap around welcome page, register and login components

import { Platform, StyleSheet } from 'react-native';
import { ImageBackground } from 'react-native';
import Assets from '../Assets';

type BackgroundImageProps = {
    children: React.ReactNode;
}

const BackgroundImage = ({children}: BackgroundImageProps) => {
    const bgImgSource = Platform.OS === 'web' ? Assets.images.bg.web : Assets.images.bg.ios;

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