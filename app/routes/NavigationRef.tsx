import React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export function navigate(name: string, params?: any) {
  navigationRef.current?.navigate(name, params);
}

export function goBack() {
  navigationRef.current?.goBack();
}
