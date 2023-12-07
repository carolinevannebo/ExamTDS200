import React from 'react';
import { View } from 'react-native';
import InitialNavigation from './src/routes/InitialNavigation';
import { StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.app}>
      <InitialNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#09090b',
    justifyContent: 'center',
    alignItems: 'center',
  },
});