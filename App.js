// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/features/home-scr/HomScreen';
import MosqueList from './src/features/items-src/MosqueList';
import EditMosqueScreen from './src/features/items-src/EditMosque';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Welcome' }} 
        />
         <Stack.Screen 
          name="MasjidList" 
          component={MosqueList} 
          options={{ title: 'Nearby Masjids' }} 
        />
          <Stack.Screen 
          name="EditMasjid" 
          component={EditMosqueScreen} 
          options={{ title: 'Edit Masjid' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}