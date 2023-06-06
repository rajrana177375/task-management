import React from "react";
import RegisterScreen from "./screens/RegisterScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TasksScreen from "./screens/TasksScreen";

const Tab = createBottomTabNavigator();


export default function App() {
  return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name='Register' component={RegisterScreen} />
          <Tab.Screen name='Tasks' component={TasksScreen} />
        </Tab.Navigator>
      </NavigationContainer>
  );
}
