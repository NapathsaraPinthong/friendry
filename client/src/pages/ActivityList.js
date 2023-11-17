import React, { useEffect } from 'react'
import NavBar from '../components/NavBar.js'
import { useNavigate } from 'react-router-dom';

function ActivityList() {

  const userID = sessionStorage.getItem("userID");
  const navigate = useNavigate();

  useEffect(() => {
    if (userID === "") {
      navigate('/login');
    }
  }, []);

  return (
    <div>
      <NavBar />
      <div className='container'>ActivityList</div>
    </div>
  )
}

export default ActivityList