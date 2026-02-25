import { useEffect } from 'react';
import { Board } from './components/Board';

function App() {
  useEffect(() => {
    // Disable browser back navigation — push a state and keep replacing it
    const blockBack = () => {
      window.history.pushState(null, '', window.location.href);
    };

    // Push initial state so there's something to "go back" to
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', blockBack);

    return () => {
      window.removeEventListener('popstate', blockBack);
    };
  }, []);

  return <Board />;
}

export default App;
