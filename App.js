import React from "react";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TasksScreen from "./screens/TasksScreen";
import Footer from "./components/footer";

const Tab = createBottomTabNavigator();


export default function App() {
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

        </Tab.Navigator>
      </NavigationContainer>
  );
}
