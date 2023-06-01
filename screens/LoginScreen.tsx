import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();

  const handleRegister = () => {
    navigation.navigate('Register');
  }

  const handleLogin = () => {
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

      <Text style={styles.forgotPasswordText}>Forgot Password?</Text>

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
