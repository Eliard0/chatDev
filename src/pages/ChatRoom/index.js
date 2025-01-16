import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal } from 'react-native';

import auth from '@react-native-firebase/auth';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FlatButton from '../../components/flatButton';
import ModalNewRoom from '../../components/modalNewRoom';

export default function ChatRoom() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [modal, setModal] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
        setUser(hasUser)
        console.log(hasUser)
    }, [isFocused]);


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

                <TouchableOpacity>
                    <MaterialIcons name="search" size={28} color="#FFF" />
                </TouchableOpacity>
            </View>

            <FlatButton modalVisible={() => setModal(true)} userStatus={user} />

            <Modal visible={modal} animationType='fade' transparent={true}>
                <ModalNewRoom modalVisible={() => setModal(false)} />
            </Modal>
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