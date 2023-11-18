import React, { useState, useEffect } from 'react';
import '../style/JoinActivity.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import image from '../asset/joining.png';
import bar from '../asset/arriving bar.png';
import NavBar from '../components/NavBar';

function JoinActivity() {

  const userID = sessionStorage.getItem("userID");
  const [activity, setActivity] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (userID === "") {
      navigate('/login');
    } else {
      fetchData();
    }
  }, []);

  const handleCancelClick = (event) => {
    event.preventDefault();
    cancelActivity();
  }

  const cancelActivity = () => {
    try {
      Axios.delete(`http://localhost:3001/leave/${userID}`);
      console.log("Leave activity succesfully!");

      navigate('/');

    } catch (error) {
      console.log(error)
    }
  }

  const fetchData = async () => {
    try {
      const activity_response = await Axios.get(`http://localhost:3001/activity/${userID}`);
      setActivity(activity_response.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <NavBar />
      <div className='container'>
        <div className='joining-header'>
          <h1>You have joined the activity.</h1>
          <div className='image'>
            <img src={image} alt="Image" width="225" />
          </div>

          <div className='joining-detail'>
            <h2>Go meet your friends !</h2>
            <p id='location'>{activity.Address}, {activity.Room}</p><br></br>
            <img src={bar} alt="Bar" width="375" />
            <div className='tags'>{activity.Category}</div>
            <h3>{activity.Name}</h3>
            <p id='description'>{activity.Description}</p>
            <p id='host'>Host: {activity.HostFirstName} {activity.HostLastName}</p>
            <div className="btn-cancel">
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinActivity