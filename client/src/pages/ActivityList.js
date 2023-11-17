import React, { useState, useEffect } from 'react';
import '../style/ActivityList.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';


function ActivityList() {

  const [activity, setActivity] = useState([]);
  const [activityID, setActivityID] = useState(0);
  const [tagFilter, setTagFilter] = useState("All");
  const [checkJoin, setcheckJoin] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);


  const userID = sessionStorage.getItem("userID");
  const navigate = useNavigate();

  useEffect(() => {
    if (userID === "") {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [tagFilter]);

  const fetchData = async () => {
    try {
      const activitygroup_check = await Axios.get(`http://localhost:3001/activitygroup/${userID}`);
      // User is not in the activitygroup, hide the join button 
      if (activitygroup_check.data[0]) {
        setcheckJoin(true);
        setCurrentActivity(activitygroup_check.data[0]);
      }
      else {
        setcheckJoin(false);
        setCurrentActivity(null);
      }

      const activity_response = await Axios.get(`http://localhost:3001/activitylist`);
      setActivity(activity_response.data);
      document.getElementById(tagFilter).disabled = true;

    } catch (error) {
      console.log(error);
    }
  };

  const handleJoinClick = (event) => {
    event.preventDefault();
    data_body.activityID = event.target.value;
    joinActivity();
  }

  const handleFilterClick = (event) => {
    event.preventDefault();
    document.getElementById("All").disabled = false;
    document.getElementById("Book Talk").disabled = false;
    document.getElementById("Board Game").disabled = false;
    document.getElementById("Politics").disabled = false;
    document.getElementById("Language").disabled = false;

    document.getElementById(event.target.id).disabled = true;
    setTagFilter(event.target.id);
  }

  const data_body = {
    activityID: activityID,
    userID: userID
  }

  const joinActivity = () => {
    try {
      Axios.post('http://localhost:3001/join', data_body);
      console.log("Join activity succesfully!");

      navigate('/join');

    } catch (error) {
      console.log(error)
    }
  }

  const linkJoinPage = () => {
    navigate('/join');
  }

  return (
    <div>
      <NavBar />
      <div className='container'>
        <div className='list-header'>
          <h1>Activity List</h1>
          <div />

          <div className='tags-filter'>

            <nav>
              <ul>
                <li>
                  <button onClick={handleFilterClick} id='All'>All</button>
                </li>
                <li>
                  <button onClick={handleFilterClick} id='Book Talk'>Book Talk</button>
                </li>
                <li>
                  <button onClick={handleFilterClick} id='Board Game'>Board Game</button>
                </li>
                <li>
                  <button onClick={handleFilterClick} id='Politics'>Politics</button>
                </li>
                <li>
                  <button onClick={handleFilterClick} id='Language'>Language</button>
                </li>
              </ul>
            </nav>
          </div>

          <div className='activity-details'>
            {checkJoin &&
              (<div id='joined'>
                <div className='activity-list' id='current' onClick={linkJoinPage}>
                  <div className='tags'>{currentActivity.Category}</div>
                  <div className='location'>{currentActivity.Address}, {currentActivity.RoomName}</div><br></br>
                  <h1><b>{currentActivity.Current}</b>/{currentActivity.Capacity}</h1>
                  <h2>{currentActivity.Name}</h2>
                  <h3>{currentActivity.Description}</h3>
                  <div id='joinStatus'>Joined</div>
                </div>
                <p>** If you want to join other activities, please cancel the current one first **</p>
              </div>)
            }
            {activity
              .filter(val => currentActivity === null || currentActivity.ActivityID !== val.ActivityID)
              .map((val, key) => {
                var btnStatus = false;
                if (val.Current >= val.Capacity)
                  btnStatus = true;
                if (val.Category === tagFilter || tagFilter === 'All') {
                  return (
                    <div className='activity-list' key={key}>
                      <div className='tags'>{val.Category}</div>
                      <div className='location'>{val.Address}, {val.RoomName}</div><br></br>
                      <h1><b>{val.Current}</b>/{val.Capacity}</h1>
                      <h2>{val.Name}</h2>
                      <h3>{val.Description}</h3>
                      <div className='btn-join'>
                        {!checkJoin &&
                          (<button onClick={handleJoinClick} value={val.ActivityID} disabled={btnStatus}>Join</button>)
                        }</div>
                    </div>
                  )
                }
              })}
          </div>
          <div className='bottom-text'>
            <p>Can't find any activity you want to join?</p>
            <button onClick={() => { navigate('/create') }}>Create your own!</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityList