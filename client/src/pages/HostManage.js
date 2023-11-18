import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import '../style/HostManage.css'
import pic from '../asset/userpic.svg'
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';


function HostManage() {

  const hostID = sessionStorage.getItem("userID");
  const [activity, setActivity] = useState([]);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    if (hostID === "") {
      navigate('/login');
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const activity_response = await Axios.get(`http://localhost:3001/host/activity/${hostID}`);
      setActivity(activity_response.data[0]);
      const member_response = await Axios.get(`http://localhost:3001/host/group/${hostID}`);
      setMembers(member_response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await Axios.delete(`http://localhost:3001/delete-activity/${activity.activityID}`);
      if (response.status === 200) {
        console.log('Activity deleted successfully!');
        await Axios.patch('http://localhost:3001/location/cancel', { roomID: activity.roomID });
        await Axios.patch('http://localhost:3001/equipment/cancel', { code: activity.code });
        console.log('Room and Equipment cancelled successfully!');
        navigate('/');

      } else {
        console.error('Failed to delete activity');
      }
    } catch (error) {
      console.error('Error while deleting activity:', error);
    }
  };


  return (
    <div>
      <NavBar />
      <div className='container'>
        <h1>My Group</h1>
        <div className='reciept'>
          <div className='activity-detail'>
            <div className='top-inline'>
              <h3>{activity.name}</h3>
              <span>{activity.category}</span>
            </div>
            <p>{activity.description}</p>
            <div className='bottom-inline'>
              <span>{activity.room} | {activity.address}</span>
              <span>{activity.equipment}</span>

            </div>
          </div>
          <hr />
          <div className='group-detail'>
            <div className='group-inline'>
              <h4>Member list</h4>
              <div className='capacity'>
                <span className='bold'>{members.length}</span>/
                <span>{activity.capacity}</span>
              </div>
            </div>

            <div className='member-con'>
              <div>
                <img src={pic} width="25" />
                <span>You</span>
              </div>
              {members
              .filter((val) => val.student_id != hostID)
              .map((val, key) => {
                return (
                  <div key={key}>
                    <img src={pic} width="25" />
                    <span>{val.fname} {val.lname}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className='details'>*Only one activity can be created at a time*</div>
        <div className='btn-div'>
          <button className='btn-blue' onClick={() => { navigate('/edit') }}>Edit</button>
          <button className='btn-red' onClick={handleDelete}>End</button>
        </div>
      </div>
    </div>
  )
}

export default HostManage