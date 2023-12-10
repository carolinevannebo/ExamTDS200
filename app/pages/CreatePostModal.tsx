import { useState } from "react";
import {Modal, StyleSheet, Text, Pressable, View} from 'react-native';

const CreatePostModal = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Hello World!</Text>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Hide Modal</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

export default CreatePostModal;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: "#f0fdfa",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#1d4342",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.95,
        shadowRadius: 3.84,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonClose: {
        backgroundColor: "#1d4342",
      },
      textStyle: {
        color: "#f0fdfa",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: "#1d4342",
        fontWeight: "bold",
        fontSize: 20
      }
});