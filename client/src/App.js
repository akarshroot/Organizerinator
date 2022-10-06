import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Home from './pages/home/Home';
import { AuthProvider } from './context/AuthContext';
import Navbar from './layout/Navbar';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  const [isLoading, setLoading] = useState(true);
  setTimeout(() => setLoading(false), 1000)

  return isLoading !== true ? (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          {/*
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/create" element={<Dashboard />} />
          <Route exact path="/post" element={<Dashboard />} />
          <Route exact path="/viewcreated" element={<Dashboard />} />
          <Route exact path="/viewposted" element={<Dashboard />} /> */}
          {/* <Route path='/404' element={<NotFound />}></Route> */}
          {/* <Route element={<NotFound />}></Route> */}
        </Routes>
        {/* <Footer /> */}
      </AuthProvider>
    </Router>
  )
    : (
      <div className="loader-container">
        Loading...
      </div>
    )
}

export default App;