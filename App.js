import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your StudentList and StudentDetail components
import StudentList from './components/StudentList'; // You need to create this
import StudentDetail from './components/StudentDetail'; // You need to create this
import AddStudent from './components/AddStudent'; // You need to create this
import EditStudent from './components/EditStudent'; // You need to create this

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StudentList">
        <Stack.Screen name="StudentList" component={StudentList} options={{ title: 'Students' }} />
        <Stack.Screen name="StudentDetail" component={StudentDetail} options={{ title: 'Student Detail' }} />
        <Stack.Screen name="AddStudent" component={AddStudent} />
        <Stack.Screen name="EditStudent" component={EditStudent} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // ... your existing styles
});
