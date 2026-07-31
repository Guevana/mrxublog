import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginSequence } from './components/LoginSequence';
import { MainLayout } from './components/layout/MainLayout';
import { useAppStore } from './store/appStore';

// Route-level code splitting: the Hub loads with the first paint; the
// detail views (article rendering, photo galleries) load on demand.
const HubViewContainer = lazy(() =>
  import('./components/hub/HubView').then(m => ({ default: m.HubViewContainer })),
);
const DetailViewContainer = lazy(() =>
  import('./components/detail/DetailView').then(m => ({ default: m.DetailViewContainer })),
);

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
          <Route index element={
            <Suspense fallback={null}><HubViewContainer /></Suspense>
          } />
          <Route path="module/:id" element={
            <Suspense fallback={null}><DetailViewContainer /></Suspense>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
