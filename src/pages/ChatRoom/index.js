import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FlatButton from '../../components/flatButton';

export default function ChatRoom() {
    const navigation = useNavigation();
    const [modal, setModal] = useState(false)

    function handleSingOut() {
        auth()
            .signOut()
            .then(() => {
                navigation.navigate("SingIn")
            })
            .catch(() => {
                console.log("nao esta logado")
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRoom}>
                <View style={styles.headerRoomLeft}>
                    <TouchableOpacity onPress={handleSingOut}>
                        <MaterialIcons name="arrow-back" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Grupos</Text>
                </View>

                <TouchableOpacity>
                    <MaterialIcons name="search" size={28} color="#FFF" />
                </TouchableOpacity>
            </View>

            <FlatButton modalVisible={() => setModal(true)} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    }

})