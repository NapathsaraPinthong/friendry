import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login';
import Signup from './pages/Signup';
import ActivityList from './pages/ActivityList';
import JoinActivity from './pages/JoinActivity';
import CreateActivity from './pages/CreateActivity';
import HostManage from './pages/HostManage';
import EditActivity from './pages/EditActivity';
import HostPage from './pages/HostPage';

function App() {

  return (
    <div className="App">
      <div className="body-container">
        <BrowserRouter>
          <Routes>
            <Route index element={<ActivityList />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/join' element={<JoinActivity />} />
            <Route path='/create' element={<CreateActivity />} />
            <Route path='/manage' element={<HostManage />} />
            <Route path='/edit' element={<EditActivity />} />
            <Route path='/host' element={<HostPage />} />
          </Routes>

        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
