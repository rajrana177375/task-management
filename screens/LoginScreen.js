import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setEmail('');
        setPassword('');
      };
    }, [])
  );

  const handleRegister = () => {
    navigation.navigate('Register');
  }

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password).then(() => {
        navigation.navigate('Tasks');
      })
    } catch (error) {
      alert('Incorrect email or password')
    }
  };

  return (
    <View style={styles.container}>

      <Image
        source={require('../assets/taskify-logo.png')}
        style={styles.logo}
      />

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        rightIcon={{
          type: 'font-awesome',
          name: 'envelope'
        }}
      />

      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        rightIcon={{
          type: 'font-awesome',
          name: showPassword ? 'eye-slash' : 'eye',
          onPress: () => setShowPassword(!showPassword),
        }}
      />

      <Button
        title="Login"
        onPress={handleLogin}
      />

      <Text style={styles.registerText}>
        New user?{' '}
        <Text onPress={handleRegister} style={styles.registerLink}>Register now</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  forgotPasswordText: {
    marginVertical: 10,
  },
  registerText: {
    marginTop: 20,
  },
  registerLink: {
    color: 'blue',
  },
});

export default LoginScreen;
