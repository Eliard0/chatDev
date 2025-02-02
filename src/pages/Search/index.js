import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Keyboard, FlatList } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import ChatList from '../../components/ChatList';

export default function Search() {
    const isFocused = useIsFocused()
    const [input, setInput] = useState()
    const [user, setUser] = useState()
    const [chats, setChats] = useState([])

    useEffect(() => {
        const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null
        setUser(hasUser)
    }, [isFocused]);

    function handleSerach() {
        if (input == '') return;

        const responseSerach = firestore()
            .collection("MESSAGE_THREADS")
            .where("name", ">=", input)
            .where("name", "<=", input, '\uf8ff')
            .get()
            .then((snapshot) => {
                const thread = snapshot.docs.map(documentSnapshot => {
                    return {
                        _id: documentSnapshot.id,
                        name: '',
                        lastMessage: { text: '' },
                        ...documentSnapshot.data()
                    }
                })
                setChats(thread)
                setInput('')
                Keyboard.dismiss()
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerInput}>
                <TextInput
                    placeholder="Digite o nome da sala"
                    value={input}
                    onChangeText={(text) => setInput(text)}
                    autoCapitalize='none'
                    style={styles.input}
                />

                <TouchableOpacity style={styles.buttonSearch} onPress={handleSerach}>
                    <MaterialIcons name="search" size={30} color="#FFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={chats}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ChatList data={item} userStatus={user} />
                )}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },

    containerInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 14
    },

    input: {
        backgroundColor: '#EBEBEB',
        marginLeft: 10,
        height: 50,
        width: '80%',
        borderRadius: 4,
        padding: 5
    },

    buttonSearch: {
        backgroundColor: '#2E54D4',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        width: '15%',
        marginHorizontal: 5
    }
})