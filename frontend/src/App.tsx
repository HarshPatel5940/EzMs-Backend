import './App.css';
import { Outlet } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <div>
      <Outlet />
      <Toaster closeButton position="top-right" />
    </div>
  );
}

export default App;
