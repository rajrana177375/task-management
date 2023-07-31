// App.js
import React, { useState, useEffect } from "react";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TasksScreen from "./screens/TasksScreen";
import Footer from "./components/footer";
import ProfileScreen from "./screens/ProfileScreen";
import { registerForPushNotificationsAsync, scheduleTaskNotifications } from './services/NotificationService';
import { auth } from './services/firebase';
import TaskBoardScreen from "./screens/TaskBoardScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      
      if (!auth.currentUser?.uid) return;

      const userId = auth.currentUser.uid;
      if (userId) {
        scheduleTaskNotifications(userId, token);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => {
          if (props.state.routeNames[props.state.index] !== 'Login' && props.state.routeNames[props.state.index] !== 'Register') {
            return <Footer {...props} />;
          }
        }}>
        <Tab.Screen name='Login' component={LoginScreen}/>
        <Tab.Screen name='Register' component={RegisterScreen} />
        <Tab.Screen name='Tasks' component={TasksScreen} />
        <Tab.Screen name='Profile' component={ProfileScreen} />
        <Tab.Screen name='TaskBoard' component={TaskBoardScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}
