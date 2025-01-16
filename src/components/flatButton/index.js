import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function FlatButton({ modalVisible, userStatus }) {
    const navigation = useNavigation()

    function handleNavigationButton() {
        userStatus ? modalVisible() : navigation.navigate("SingIn")
    }

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.containerButton}
            onPress={handleNavigationButton}
        >
            <View>
                <Text style={styles.text}>
                    +
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerButton: {
        backgroundColor: '#2E54D4',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: '5%',
        right: '6%'
    },

    text: {
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold'
    }
})

export default FlatButton