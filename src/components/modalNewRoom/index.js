import react, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Alert } from 'react-native'

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'

function ModalNewRoom({ modalVisible, setUpdateScreenChat }) {
    const user = auth().currentUser.toJSON()

    const [nameRoom, setNameRoom] = useState('')

    function handleButtonCreate() {
        if (nameRoom == '') return;

        firestore()
            .collection("MESSAGE_THREADS")
            .get()
            .then((snapshot) => {
                let myChats = 0

                snapshot.docs.map(docItem => {
                    if (docItem.data().owner == user.uid) {
                        myChats += 1
                    }
                })

                if (myChats >= 4) {
                    alert("voce ja atingiu o limite de criação de chat por usuario")
                } else {
                    createRoom()
                }
            })

    }

    function createRoom() {
        firestore()
            .collection("MESSAGE_THREADS")
            .add({
                name: nameRoom,
                owner: user.uid,
                lastMessage: {
                    text: `Grupo ${nameRoom} criado. Bem vindo(a)`,
                    createdAt: firestore.FieldValue.serverTimestamp()
                }
            })
            .then((docRef) => {
                docRef.collection('MESSAGES').add({
                    text: `Grupo ${nameRoom} criado. Bem vindo(a)`,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    system: true
                })
                    .then(() => {
                        modalVisible()
                        setUpdateScreenChat()
                    })

            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={modalVisible}>
                <View style={styles.modal}></View>
            </TouchableWithoutFeedback>

            <View style={styles.modalContent}>
                <Text style={styles.title}>
                    Criar um novo Grupo?
                </Text>

                <TextInput
                    value={nameRoom}
                    onChangeText={(text) => setNameRoom(text)}
                    placeholder='Nome para a sala'
                    style={styles.input}
                />

                <TouchableOpacity style={styles.buttonCreate} onPress={handleButtonCreate}>
                    <Text style={styles.buttonText}>
                        Criar sala
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(34 , 34, 34, 0.4)'
    },

    modal: {
        flex: 1
    },

    modalContent: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 15
    },

    title: {
        marginTop: 14,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 19
    },

    input: {
        borderRadius: 4,
        height: 45,
        backgroundColor: '#DDD',
        marginVertical: 15,
        fontSize: 16,
        paddingHorizontal: 5
    },

    buttonCreate: {
        borderRadius: 4,
        backgroundColor: '#2E54D4',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },

    buttonText: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#FFF'
    }
})

export default ModalNewRoom