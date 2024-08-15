import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'react-native-bcrypt';
import { useAuth } from '../Context/Auth.context';

const AuthScreen = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setIsLoggedIn } = useAuth();


    const handleToggle = () => {
        setIsRegistering(!isRegistering);
    };

    const handleRegister = async () => {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        await AsyncStorage.setItem(email, hashedPassword);
        Alert.alert('Registration successful!');
    };


    const handleLogin = async () => {
        const storedPasswordHash = await AsyncStorage.getItem(email);
        if (storedPasswordHash && bcrypt.compareSync(password, storedPasswordHash)) {
            const sessionToken = Math.random().toString(36).substring(2);
            const timestamp = new Date().getTime();
            await AsyncStorage.setItem('sessionToken', sessionToken);
            await AsyncStorage.setItem('sessionTimestamp', timestamp.toString());
            console.log("Login successful, session token and timestamp set"); // Debugging line

            setIsLoggedIn(true);
            startSessionTracking(); // Ensure this is called

            Alert.alert('Login successful!');
        } else {
            Alert.alert('Invalid credentials');
        }
    };


    const handleLogout = async () => {
        await AsyncStorage.removeItem('sessionToken');
        await AsyncStorage.removeItem('sessionTimestamp');
        setIsLoggedIn(false);
        Alert.alert('Logged out');
    };

    const startSessionTracking = () => {
        console.log("Session tracking started..."); // Debugging line
        let intervalId = setInterval(async () => {
            console.log("Interval is running..."); // Debugging line

            const sessionTimestamp = await AsyncStorage.getItem('sessionTimestamp');
            console.log("Session timestamp:", sessionTimestamp); // Debugging line

            const now = new Date().getTime();
            if (now - parseInt(sessionTimestamp) > 3 *60* 1000) { // 30min for testing
                console.log("Session expired..."); // Debugging line

                await AsyncStorage.removeItem('sessionToken');
                await AsyncStorage.removeItem('sessionTimestamp');
                setIsLoggedIn(false)
                clearInterval(intervalId);
                Alert.alert('Session expired, logging out...');
            }
        }, 1000*60); // Check every min

        AsyncStorage.setItem('sessionIntervalId', intervalId.toString());
    };


    return (
        <View>
            <Text>{isRegistering ? 'Register' : 'Login'}</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button
                title={isRegistering ? 'Register' : 'Login'}
                onPress={isRegistering ? handleRegister : handleLogin}
            />
            <Button title={isRegistering ? 'Go to Login' : 'Go to Register'} onPress={handleToggle} />
        </View>
    );
};

export default AuthScreen;
