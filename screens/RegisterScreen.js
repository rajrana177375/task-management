import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore"
import { useNavigation } from '@react-navigation/native';


const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();

  const goToLogin = () => {
    navigation.navigate('Login')
  }

  const handleRegister = async () => {

    if (password !== confirmPassword) return alert('Password does not match!');

    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const userID = userCredential.user.uid;

          setDoc(doc(db, "users", `${userID}`), {
            userID,
            username,
            email,
            name
          }).then(() => {
            console.log("User document successfully written!");
            navigation.navigate('Tasks');
          }).catch((error) => {
            console.error("Error writing user document: ", error);
          });
        })
        .catch((error) => {
          console.log('Error during user creation in Auth: ', error);
          alert('Signup Error, try again!');
        });
    } catch (error) {
      console.log('Error during user registration process: ', error);
      alert('Signup Error, try again!')
    }
  };


  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/taskify-logo.png')}
        style={styles.logo}
      />

      <Input
        placeholder='Name'
        rightIcon={{ type: 'font-awesome', name: 'user' }}
        value={name}
        onChangeText={setName}
      />

      <Input
        placeholder="Email"
        autoCapitalize="none"
        rightIcon={{ type: 'font-awesome', name: 'envelope' }}
        value={email}
        onChangeText={setEmail}
      />

      <Input
        placeholder="Username"
        autoCapitalize="none"
        rightIcon={{ type: 'font-awesome', name: 'user-circle' }}
        value={username}
        onChangeText={setUsername}
      />

      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        rightIcon={{
          type: 'font-awesome',
          name: showPassword ? 'eye-slash' : 'eye',
          onPress: () => setShowPassword(!showPassword),
        }}
      />

      <Input
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        rightIcon={{
          type: 'font-awesome',
          name: showPassword ? 'eye-slash' : 'eye',
          onPress: () => setShowPassword(!showPassword),
        }}
      />

      <Button
        title="Register"
        onPress={handleRegister}
      />

<Text onPress={goToLogin} style={styles.goToLogin}> {'<- Go to Login Page'}</Text>

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
  goToLogin: {
    marginVertical: 10,
    color: 'blue',
  }
});

export default RegisterScreen;
