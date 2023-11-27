import React, { useState, useEffect } from 'react';
import '../style/CreateActivity.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

function CreateActivity() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(0);
  const [locationList, setLocationList] = useState([]);
  const [equipment, setEquipment] = useState(0);
  const [equipmentList, setEquipmentList] = useState([]);

  const hostID = sessionStorage.getItem("userID");
  const [hosts, setHosts] = useState([]);
  const [inActivityGroup, setInActivityGroup] = useState(false);


  useEffect(() => {
    if (hostID === "") {
      navigate('/login');
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const location_response = await Axios.get('http://localhost:3001/locations');
      const equipment_response = await Axios.get('http://localhost:3001/equipments');
      const host_response = await Axios.get(`http://localhost:3001/hosts`);
      const hostsData = host_response.data.map((val) => val.hostID);
      setHosts(hostsData);
      setLocationList(location_response.data);
      setEquipmentList(equipment_response.data);

      const activitygroup_check = await Axios.get(`http://localhost:3001/activitygroup/${hostID}`);
      if (activitygroup_check.data[0]) {
        setInActivityGroup(true);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryClick = (event) => {
    event.preventDefault()
    setCategory(event.target.value);
  }

  const handleLocationChange = (event) => {
    const selectedRoomID = event.target.value;
    setLocation(selectedRoomID);
  };

  const handleEquipmentChange = (event) => {
    const selectedCode = event.target.value;
    setEquipment(selectedCode);
  };


  const data_body = {
    name: name,
    category: category,
    capacity: capacity,
    description: description,
    location: location,
    equipment: equipment,
    hostID: hostID
  }

  const addActivity = () => {
    try {
      Axios.post('http://localhost:3001/create-activity', data_body);
      Axios.patch('http://localhost:3001/location/reserve', { roomID: location });
      Axios.patch('http://localhost:3001/equipment/reserve', { code: equipment });
      console.log("Create activity succesfully!");

      navigate('/manage');

    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !category || !capacity || !location || !equipment) {
      alert("Please complete all required fields.");
    } else if ( capacity < 2 || capacity > 30) {
      alert("Number of participants must be between 2 and 30.");
    } 
    else {
      try {
        await addActivity();
        const activity_response = await Axios.get(`http://localhost:3001/host/activity/${hostID}`);

        if (activity_response.data && activity_response.data.length > 0) {
          const activityID = activity_response.data[0].activityID;
          await Axios.post('http://localhost:3001/join', { activityID: activityID, userID: hostID });
          setName("");
          setCategory("");
          setCapacity(2);
          setDescription("");
          setLocation(0);
          setEquipment(0);
        } else {
          console.log("Activity data not found.");
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  if (hostID && hosts.includes(Number(hostID))) {
    navigate('/manage');
  } else {
    return (
      <div>
        <NavBar />
        <div className='container'>
          <h1>Create Activity</h1>
          {inActivityGroup && (
            <div className="warning-message">
              <p>** You are already part of an activity group <br></br> You cannot create a new activity at the moment **</p>
            </div>
          )}
          {!inActivityGroup && (
            <form>
              <div className='section'>
                <h2>Choose tag(s) <span>that best describe your activity</span></h2>
                <hr />
                <div className="tags">
                  <button onClick={handleCategoryClick}
                    value={'Boardgame'}
                    className={category === 'Boardgame' ? 'selected' : ''}
                    style={{ background: "#DD6168" }}>
                    Boardgame
                  </button>
                  <button onClick={handleCategoryClick}
                    value={'Language'}
                    className={category === 'Language' ? 'selected' : ''}
                    style={{ background: "#FFD13F" }}>
                    Language
                  </button>
                  <button onClick={handleCategoryClick}
                    value={'Movie Talk'}
                    className={category === 'Movie Talk' ? 'selected' : ''}
                    style={{ background: "#7383D2" }}>
                    Movie Talk
                  </button>
                  <button onClick={handleCategoryClick}
                    value={'Book Talk'}
                    className={category === 'Book Talk' ? 'selected' : ''}
                    style={{ background: "#BAE076" }}>
                    Book Talk
                  </button>
                  <button onClick={handleCategoryClick}
                    value={'Talk on Topic'}
                    className={category === 'Talk on Topic' ? 'selected' : ''}
                    style={{ background: "#4D8CAF" }}>
                    Talk on Topic
                  </button>
                  <button onClick={handleCategoryClick}
                    value={'Watching Movie'}
                    className={category === 'Watching Movie' ? 'selected' : ''}
                    style={{ background: "#DD6168" }}>
                    Watching Movie
                  </button>
                  <button onClick={handleCategoryClick}
                    value={'Others'}
                    className={category === 'Others' ? 'selected' : ''}
                    style={{ background: "#7B7979" }}>
                    Others
                  </button>
                </div>

                <p>Don't know if your activity belongs to which tag? Select <span>Others</span></p>
              </div>

              <div className='section'>
                <h2>Activity's Details</h2>
                <hr />
                <div>
                  <label>Activity's Name</label>
                  <input type='text' name='act-name'
                    value={name} placeholder="More creative name, more people are interested !"
                    onChange={(event) => setName(event.target.value)} required></input>
                </div>

                <div>
                  <label>Description</label>
                  <textarea name='act-desc' value={description}
                    placeholder="Tell them what you are going to do ..."
                    onChange={(event) => setDescription(event.target.value)} required></textarea>
                </div>

                <div className='inline'>
                  <label >Maximum no. of participants</label>
                  <input type='number' name="capacity" min="2" max="30" value={capacity} required onChange={(event) => setCapacity(event.target.value)} ></input>
                </div>

                <div>
                  <label>Location</label>
                  <select name='location' onChange={handleLocationChange} value={location} required>
                    <option>Select location</option>
                    {locationList.map((val, key) => {
                      return (
                        <option key={key} value={val.roomID}>{val.name}</option>
                      )
                    })}

                  </select>
                </div>

                <div>
                  <label>Equipment</label>
                  <select name='equipment' onChange={handleEquipmentChange} value={equipment} required>
                    <option>Select equipment</option>
                    {equipmentList.map((val, key) => {
                      return (
                        <option key={key} value={val.code}>{val.name}</option>
                      )
                    })}

                  </select>
                </div>
              </div>

              <div className="btn-con">
                <button onClick={handleSubmit}>Create</button>
              </div>
            </form>
          )}
        </div>
      </div>

    )
  }
}


export default CreateActivity