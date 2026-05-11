import { useState } from 'react';
import { LoginSequence } from './components/LoginSequence';
import { MainInterface } from './components/MainInterface';

export default function App() {
  const [loginComplete, setLoginComplete] = useState(() => {
    return localStorage.getItem('hasVisited') === 'true';
  });

  const handleLoginComplete = () => {
    localStorage.setItem('hasVisited', 'true');
    setLoginComplete(true);
  };

  return (
    <>
      {!loginComplete ? (
        <LoginSequence onComplete={handleLoginComplete} />
      ) : (
        <MainInterface />
      )}
    </>
  );
}
