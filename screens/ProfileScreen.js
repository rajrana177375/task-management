import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Button, Avatar } from 'react-native-elements';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { signOut } from "firebase/auth";
import { useFocusEffect } from '@react-navigation/native';

function ProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const handleSave = async () => {
    try {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDoc, {
        name: name,
        username: username,
      });

      alert('Profile updated!');

    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setName("");
      setUsername("");

      const fetchUserData = async () => {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setName(userDoc.data().name);
          setUsername(userDoc.data().username);
        }
      };

      fetchUserData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Avatar
        size="large"
        rounded
        source={null}
        title={name.charAt(0).toUpperCase()}
        overlayContainerStyle={{ backgroundColor: 'blue' }}
      />
      <Input
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <Input
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Save"
          onPress={handleSave}
        />
        <Button
          title="Logout"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
});

export default ProfileScreen;
