import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import AuditScreen from './src/screens/AuditScreen';
import AttestationScreen from './src/screens/AttestationScreen';
import MaterialsScreen from './src/screens/MaterialsScreen';
import MenuScreen from './src/screens/MenuScreen';
import TrendsScreen from './src/screens/TrendsScreen';
import TechScreen from './src/screens/TechScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Audit" component={AuditScreen} />
        <Tab.Screen name="Materials" component={MaterialsScreen} />
        <Tab.Screen name="Menu" component={MenuScreen} />
        <Tab.Screen name="Trends" component={TrendsScreen} />
        <Tab.Screen name="Tech" component={TechScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
