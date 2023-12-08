import React from 'react';
//import { View, SafeAreaView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
//import InitialNavigation from './src/routes/InitialNavigation';
import { StyleSheet } from 'react-native';
import { registerRootComponent } from 'expo';

export default function App() {
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.app}>
      {/*<InitialNavigation />*/}
    </SafeAreaView>
    </SafeAreaProvider>
  );
}


registerRootComponent(App);

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#09090b',
    justifyContent: 'center',
    alignItems: 'center',
  },
});