import Add from './assets/icons/Add.svg'
import Back from './assets/icons/Back.svg'
import Camera from './assets/icons/Camera.svg'
import Close from './assets/icons/Close.svg'
import Comment from './assets/icons/Comment.svg'
import Heart from './assets/icons/Heart.svg'
import Home from './assets/icons/Home.svg'
import Gear from './assets/icons/Gear.svg'
import Image from './assets/icons/Image.svg'
import Logout from './assets/icons/Logout.svg'
import Profile from './assets/icons/Profile.svg'
import Remove from './assets/icons/Remove.svg'
import Send from './assets/icons/Send.svg'

const bgImgSourceIOS = require('./assets/images/bg-ios.jpg');
const bgImgSourceWeb = require('./assets/images/bg-web.jpg');

const placeholderProfileSrc = require('./assets/images/placeholder-profile.jpeg');
const placeholderPostSrc = require('./assets/images/test-upload.jpg');

export const Assets = {
    icons: {
        Add,
        Back,
        Camera,
        Close,
        Comment,
        Heart,
        Home,
        Gear,
        Image,
        Logout,
        Profile,
        Remove,
        Send,
    },
    images: {
        bg: {
            ios: bgImgSourceIOS,
            web: bgImgSourceWeb,
        },
        placeholder: {
            profile: placeholderProfileSrc,
            post: placeholderPostSrc,
        }
    },
};

export default Assets;