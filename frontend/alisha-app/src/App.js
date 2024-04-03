import Navbar from './components/Navbar';
import Stock from './components/Stock';
import History from './components/History';
import Home from './components/Home';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </>
      
  );
}

export default App;
