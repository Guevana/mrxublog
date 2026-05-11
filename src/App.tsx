import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginSequence } from './components/LoginSequence';
import { MainLayout } from './components/layout/MainLayout';
import { HubViewContainer } from './components/hub/HubView';
import { DetailViewContainer } from './components/detail/DetailView';
import { useAppStore } from './store/appStore';

export default function App() {
  const isLoggedIn = useAppStore(state => state.isLoggedIn);
  const login = useAppStore(state => state.login);

  if (!isLoggedIn) {
    return <LoginSequence onComplete={login} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HubViewContainer />} />
          <Route path="module/:id" element={<DetailViewContainer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
