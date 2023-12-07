import { View } from 'react-native';
import InitialNavigation from './src/routes/InitialNavigation';
import './dist/output.css';

export default function App() {
  return (
    <View className='flex-auto items-center justify-center bg-zinc-950'>
      <InitialNavigation />
    </View>
  );
}
