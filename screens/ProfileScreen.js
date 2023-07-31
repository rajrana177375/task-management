import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Input, Button, Avatar } from 'react-native-elements';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { signOut } from "firebase/auth";
import { useFocusEffect } from '@react-navigation/native';

function ProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const handleSave = async () => {
    if (!name || !username) {
      alert('Please fill out all fields before saving.');
      return;
    }
  
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        await updateDoc(userDocRef, {
          name: name,
          username: username,
        });
      } else {
        await setDoc(userDocRef, {
          name: name,
          username: username,
        });
      }
  
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
      setLoading(true);

      const fetchUserData = async () => {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setName(userDoc.data().name);
          setUsername(userDoc.data().username);
        }

        setLoading(false); // Set loading to false when the data is fetched
      };

      fetchUserData();
    }, [])
  );

  useEffect(() => {
    setLoading(true); // Set loading to true on component mount

    const unsubscribe = navigation.addListener('focus', () => {
      // Handle any additional logic on screen focus if needed
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {loading ? ( // Show the loader if loading is true
        <ActivityIndicator size="large" color="#407BFF" />
      ) : (
        <>
          <Avatar
            size="xlarge"
            rounded
            source={null}
            title={name.charAt(0).toUpperCase()}
            overlayContainerStyle={{ backgroundColor: '#407BFF' }}
            containerStyle={styles.avatarContainer}
          />
          <Input
            placeholder="Name"
            value={name}
            onChangeText={setName}
            inputStyle={styles.inputStyle}
          />
          <Input
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            inputStyle={styles.inputStyle}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Save"
              onPress={handleSave}
              buttonStyle={styles.saveButton}
            />
            <Button
              title="Logout"
              onPress={handleLogout}
              buttonStyle={styles.logoutButton}
            />

          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    marginBottom: 20,
  },
  inputStyle: {
    color: '#333',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#407BFF',
    marginRight: 20,
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    marginLeft: 20,
  },
});

export default ProfileScreen;
