import { View } from 'react-native';
import { Register } from './src/components/Register';
import './dist/output.css';

export default function App() {
  return (
    <View className='flex-1 items-center justify-center bg-zinc-950'>
      <Register navigation={undefined}></Register>
    </View>
  );
}
