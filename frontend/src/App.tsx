import { useAppStore } from './application/store/useAppStore';
import { AppLayout } from './presentation/layouts/AppLayout';
import { HomeScreen } from './presentation/screens/HomeScreen';
import { RoomScreen } from './presentation/screens/RoomScreen';
import { EndSessionScreen } from './presentation/screens/EndSessionScreen';
import { HistoryScreen } from './presentation/screens/HistoryScreen';

export function App() {
  const { screen } = useAppStore();

  const renderScreen = () => {
    switch (screen) {
      case 'home':             return <HomeScreen />;
      case 'waiting':
      case 'live':             return <RoomScreen />;
      case 'form':             return <EndSessionScreen />;
      case 'history':          return <HistoryScreen />;
      default:                 return null;
    }
  };

  return <AppLayout>{renderScreen()}</AppLayout>;
}
