import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import './App.css';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Today from './components/Today';
import Plan from './components/Plan';
import Reflect from './components/Reflect';
import Signup from './components/Signup';
import Admin from './components/Admin';

const App: React.FunctionComponent = () => {

  const [sessionToken, setSessionToken] = useState<any>('');

  const updateToken = (newToken:string) => {
    console.log(newToken);
    localStorage.setItem('token', newToken);
    setSessionToken(newToken);
  }

  useEffect(() => {
    if (localStorage.getItem('token')){
      setSessionToken(localStorage.getItem('token'));
    }
  }, [updateToken])

  const tokenProp = {
    token:sessionToken,
    updateToken:updateToken
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login {...tokenProp}/>} />
          <Route path='/Login' element={<Login {...tokenProp}/>} />
          <Route path='/Signup' element={<Signup updateToken={updateToken}/>}/>
          <Route path='/Today' element={<Today token={sessionToken}/> } />
          <Route path='/Plan' element={<Plan />} />
          <Route path='/Reflect' element={<Reflect/>} />
          <Route path='/Admin' element={<Admin/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
