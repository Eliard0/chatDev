import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, SafeAreaView, Platform, TouchableOpacity } from 'react-native';

import auth from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native'

export default function SingIn() {
    const navigation = useNavigation()

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [typeLogin, setTypeLogin] = useState(false);

    function handleLogin() {
        if (typeLogin) {
            console.log("s")
            if (name === '' || email === '' || password === '') {
                console.log("esta vazio")
            }

            auth()
                .createUserWithEmailAndPassword(email, password)
                .then((user) => {
                    user.user.updateProfile({
                        displayName: name
                    })
                        .then(() => {
                            navigation.goBack();
                        })

                })
                .catch((error) => {
                    if (error.code === 'auth/email-already-in-use') {
                        console.log('Email já em uso!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        console.log('Email invalido!');
                    }
                })

        } else {
            auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    navigation.goBack();
                })
                .catch((error) => {
                    if (error.code === 'auth/invalid-email') {
                        console.log('Email invalido!');
                    }
                })

        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.logo}>HeyGrupos</Text>
            <Text style={{ marginBottom: 30 }}>Ajude, colabore, faça networcking</Text>

            {typeLogin && (
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={(text) => setName(text)}
                    placeholder='Digite seu Nome'
                    placeholderTextColor="#99999B"
                />
            )}
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder='Digite seu Email'
                placeholderTextColor="#99999B"
            />
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder='Digite sua Senha'
                placeholderTextColor="#99999B"
            />

            <TouchableOpacity
                style={[styles.buttonLogin, { backgroundColor: typeLogin ? "#F53745" : "#57DD86" }]}
                onPress={handleLogin}
            >
                <Text style={styles.textButtonLogin}>{typeLogin ? "Cadastrar" : "Acessar"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setTypeLogin(!typeLogin)}>
                <Text>{typeLogin ? "já possuo uma conta" : "Criar uma nova conta"}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },

    logo: {
        fontSize: 37,
        marginTop: Platform.OS === 'android' ? 55 : 80,
        fontWeight: 'bold'
    },

    input: {
        color: '#121212',
        backgroundColor: '#EBEBEB',
        width: '90%',
        borderRadius: 6,
        marginBottom: 10,
        paddingHorizontal: 8,
        height: 50
    },

    buttonLogin: {
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 6
    },

    textButtonLogin: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 15
    },
})