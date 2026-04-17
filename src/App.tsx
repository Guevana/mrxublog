import { useState } from 'react';
import { LoginSequence } from './components/LoginSequence';
import { MainInterface } from './components/MainInterface';

export default function App() {
  const [loginComplete, setLoginComplete] = useState(false);

  return (
    <>
      {!loginComplete ? (
        <LoginSequence onComplete={() => setLoginComplete(true)} />
      ) : (
        <MainInterface />
      )}
    </>
  );
}
