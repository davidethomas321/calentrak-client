import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import './App.css';
import Sidebar from './components/Sidebar';
import Today from './components/Today';
import Plan from './components/Plan';
import Reflect from './components/Reflect';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Sidebar/>
        <Routes>
          <Route path='/Today' element={<Today/>} />
          <Route path='/Plan' element={<Plan/>} />
          <Route path='/Reflect' element={<Reflect/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
