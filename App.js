import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import PlantsScreen from './screens/PlantsScreen';
import AboutScreen from './screens/AboutScreen';
import AIAssistantScreen from './screens/AIAssistantScreen';
import LoadingScreen from './components/LoadingScreen';
import CalendarScreen from './screens/CalendarScreen';
const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // User is signed in
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ headerShown: false }} 
            />
                  <Stack.Screen 
              name="Calendar" 
              component={CalendarScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Plants" 
              component={PlantsScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="About" 
              component={AboutScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="AIAssistant" 
              component={AIAssistantScreen} 
              options={{ headerShown: false }} 
            />
          </>
        ) : (
          // User is not signed in
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
