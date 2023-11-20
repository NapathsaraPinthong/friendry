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
  const [hosts, setHosts] = useState([]);

  const userID = sessionStorage.getItem("userID");
  const navigate = useNavigate();

  const [disabledButtons, setDisabledButtons] = useState({
    All: false,
    Boardgame: false,
    Language: false,
    "Movie Talk": false,
    "Book Talk": false,
    "Talk on topic": false,
    "Watching Movie": false,
  });

  useEffect(() => {
    if (!userID || userID === "") {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [tagFilter]);

  const fetchData = async () => {
    try {
      const activitygroup_check = await Axios.get(`http://localhost:3001/activitygroup/${userID}`);
      const host_response = await Axios.get('http://localhost:3001/hosts');
      setHosts(host_response.data.map((val) => val.hostID));
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

      // Disable buttons based on tagFilter
      const disabledButtonsCopy = { ...disabledButtons };
      Object.keys(disabledButtonsCopy).forEach((button) => {
        disabledButtonsCopy[button] = false;
      });
      disabledButtonsCopy[tagFilter] = true;
      setDisabledButtons(disabledButtonsCopy);

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
    if (userID && hosts.includes(Number(userID))) {
      navigate('/manage');
    } else {
      navigate('/join');
    }
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
                  <button onClick={handleFilterClick} id='All' 
                    disabled={disabledButtons['All']}>All</button>
                </li>
                <li>
                  <button onClick={handleFilterClick} id='Boardgame'
                    disabled={disabledButtons['Boardgame']}>Board Game</button>
                </li>
                <li>
                  <button onClick={handleFilterClick} id='Language' disabled={disabledButtons['Language']}>Language</button>
                </li>
                <li>
                  <button onClick={handleFilterClick} id='Movie Talk' disabled={disabledButtons['Movie Talk']}>Movie Talk</button>
                </li>
                <li>
                  <button onClick={handleFilterClick} id='Book Talk' disabled={disabledButtons['Book Talk']}>Book Talk</button>
                </li>
                <li>
                  <button onClick={handleFilterClick} id='Talk on Topic' disabled={disabledButtons['Talk on Topic']}>Talk on Topic</button>
                </li>
                <li>
                  <button onClick={handleFilterClick} id='Watching Movie' disabled={disabledButtons['Watching Movie']}>Watching Movie</button>
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
            {activity.length > 0 && activity
              .filter(val => currentActivity === null || currentActivity.ActivityID !== val.activityID)
              .map((val, key) => {
                var btnStatus = false;
                {console.log(val.category)}
                if (val.Current >= val.capacity)
                  btnStatus = true;
                if (val.category === tagFilter || tagFilter === 'All') {
                  return (
                    <div className='activity-list' key={key}>
                      <div className='tags'>{val.category}</div>
                      <div className='location'>{val.address}, {val.RoomName}</div><br></br>
                      <h1><b>{val.Current}</b>/{val.capacity}</h1>
                      <h2>{val.name}</h2>
                      <h3>{val.description}</h3>
                      <div className='btn-join'>
                        {!checkJoin &&
                          (<button onClick={handleJoinClick} value={val.activityID} disabled={btnStatus}>Join</button>)
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