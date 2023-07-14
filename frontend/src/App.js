import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Register}  from './components/Register';
import {Breaches}  from './components/Breaches';
import {Navbar} from './components/Navbar';

function App() {
  return (

    <Router>
      <Navbar />
      <div className='container p-4'>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Breaches />} />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
