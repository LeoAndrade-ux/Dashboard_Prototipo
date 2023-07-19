import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Register}  from './components/Register';
import {Breaches}  from './components/Breaches';
import {Navbar} from './components/Navbar';
import {Users} from './components/Users';
import {Home} from './components/Home';

function App() {
  return (

    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/breaches" element={<Breaches />} />
          <Route path="/clients" element={<Users />} />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
