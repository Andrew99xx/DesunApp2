import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import DynamicForm from './src/components/DynamicForm';
import { AuthProvider, useAuth } from './src/Context/Auth.context';
import AuthScreen from './src/components/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
const formConfig = {
  fields: [
    {
      type: 'text',
      name: 'username',
      label: 'Username'
    },
    {
      type: 'password',
      name: 'password',
      label: 'Password'
    },
    {
      type: 'email',
      name: 'email',
      label: 'Email'
    },
    {
      type: 'number',
      name: 'age',
      label: 'Age'
    },
    {
      type: 'checkbox',
      name: 'interests',
      label: 'Interests',
      options: [
        { label: 'Sports', value: 'sports', checked: false },
        { label: 'Music', value: 'music', checked: false },
        { label: 'Movies', value: 'movies', checked: false }
      ]
    },
    {
      type: 'radio',
      name: 'gender',
      label: 'Gender',
      options: [
        { label: 'Male', value: 'male', checked: false },
        { label: 'Female', value: 'female', checked: false }
      ]
    },
    {
      type: 'select',
      name: 'country',
      label: 'Country',
      options: [
        { label: 'India', value: 'india' },
        { label: 'USA', value: 'usa' },
        { label: 'Canada', value: 'canada' }
      ]
    }
  ]
};

const App = () => {
  const testAsyncStorage = async () => {
    await AsyncStorage.setItem('testKey', 'testValue');
    const value = await AsyncStorage.getItem('testKey');
    console.log("Test value from AsyncStorage:", value); // Should log 'testValue'
  };

  

  useEffect(() => {
    testAsyncStorage(); // Run this on component mount
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ScrollView>
    </SafeAreaView>
  );
};
const AppContent = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <DynamicForm config={formConfig} />; // Render your main app content if logged in
  } else {
    return <AuthScreen />; // Render the Auth screen if not logged in
  }
};
export default App;
