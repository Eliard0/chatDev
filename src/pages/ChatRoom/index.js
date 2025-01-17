import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, ActivityIndicator, FlatList, Alert } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FlatButton from '../../components/FlatButton';
import ModalNewRoom from '../../components/ModalNewRoom';
import ChatList from '../../components/ChatList';

export default function ChatRoom() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [modal, setModal] = useState(false)
    const [user, setUser] = useState(null)
    const [threads, setThreads] = useState([])
    const [loading, setLoading] = useState(true)
    const [updateScreenChat, setUpdateScreenChat] = useState(false)

    useEffect(() => {
        const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
        setUser(hasUser)
    }, [isFocused]);

    useEffect(() => {
        let isActive = true

        function getChats() {

            firestore()
                .collection("MESSAGE_THREADS")
                .orderBy("lastMessage.createdAt", 'desc')
                .limit(10)
                .get()
                .then((snapshot) => {
                    const threads = snapshot.docs.map(documentSnapshot => {
                        return {
                            _id: documentSnapshot.id,
                            name: '',
                            lastMessage: { text: '' },
                            ...documentSnapshot.data()
                        }
                    })

                    if (isActive) {
                        setThreads(threads)
                        setLoading(false)
                    }
                })
        }


        getChats()

        return () => {
            isActive = false;
        }
    }, [isFocused, updateScreenChat]);

    function handleSingOut() {
        auth()
            .signOut()
            .then(() => {
                setUser(null);
                navigation.navigate("SingIn")
            })
            .catch(() => {
                console.log("nao esta logado")
            })
    }

    function deleteRoom(ownerId, idRoom) {
        if (ownerId !== user?.uid) return;

        Alert.alert(
            "Atençõo!",
            "Voce tem certeza que deseja apagar essa sala?",
            [
                {
                    text: "Cancel",
                    onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: "OK",
                    onPress: () => handleDeleteRoom(idRoom)
                }
            ]
        )
    }

    async function handleDeleteRoom(idRoom) {
        await firestore()
            .collection("MESSAGE_THREADS")
            .doc(idRoom)
            .delete();

        setUpdateScreenChat(!updateScreenChat)
    }

    if (loading) {
        return (
            <View style={styles.viewLoading}>
                <ActivityIndicator size="large" color="#555" />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRoom}>
                <View style={styles.headerRoomLeft}>
                    {user && (
                        <TouchableOpacity onPress={handleSingOut}>
                            <MaterialIcons name="arrow-back" size={28} color="#FFF" />
                        </TouchableOpacity>
                    )
                    }
                    <Text style={styles.title}>Grupos</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                    <MaterialIcons name="search" size={28} color="#FFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={threads}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <ChatList data={item} deleteRoom={() => deleteRoom(item.owner, item._id)} userStatus={user} />
                )}
            />

            <FlatButton modalVisible={() => setModal(true)} userStatus={user} />

            <Modal visible={modal} animationType='fade' transparent={true}>
                <ModalNewRoom
                    modalVisible={() => setModal(false)}
                    setUpdateScreenChat={() => setUpdateScreenChat(!updateScreenChat)}
                />
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },

    headerRoom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#2E54D4',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20
    },
    headerRoomLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        paddingLeft: 10,
        color: '#fff'
    },
    viewLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }

})