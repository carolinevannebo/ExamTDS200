// Simple loading animation for uploading posts
// TODO: Change colors

import { Modal, ActivityIndicator, StyleSheet, View } from 'react-native';

interface LoadingSpinnerProps {
    visible: boolean;
    close: () => void;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ visible, close }) => {

    return (
        <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
            close();
        }}>
            <View style={styles.modalContainer}>
                <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color="#1d4342" />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    spinnerContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
});

export default LoadingSpinner;
