import React from "react";
import { createTheme, ThemeProvider } from "@rneui/themed";
import Component from "./components/MyComponent";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const theme = createTheme({
  lightColors: {
    primary: '#C9DBB2',
    secondary: '#E3F2C1',
    background: '#F6FFDE',
  },
  darkColors: {
    primary: '#2E4F4F',
    secondary: '#0E8388',
    background: '#CBE4DE',
  },
});

const Tab = createNativeStackNavigator();


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name='Login' component={LoginScreen} />
          <Tab.Screen name='Register' component={RegisterScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
