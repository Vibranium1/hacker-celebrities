import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  // Link
} from "react-router-dom";
import Hacker from "./views/hacker"


function App() {
  return (
    <div className="App">
    
    <Router>
      <Routes><Route path="/" Component={Hacker} /></Routes>
  
</Router>
    </div>
  );
}

export default App;

