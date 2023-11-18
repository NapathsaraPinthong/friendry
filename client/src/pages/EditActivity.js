import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditActivity() {
  const navigate = useNavigate();
  const hostID = sessionStorage.getItem("userID");

  const [activityID, setActivityID] = useState(0);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [capacity, setCapacity] = useState(2);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(0);
  const [oldLocation, setOldLocation] = useState(0);
  const [equipment, setEquipment] = useState(0);
  const [oldEquipment, setOldEquipment] = useState(0);
  const [locationList, setLocationList] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);

  useEffect(() => {
    if (hostID === "") {
      navigate('/login');
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const activityResponse = await Axios.get(`http://localhost:3001/host/activity/${hostID}`);
      const activityData = activityResponse.data[0];
      setActivityID(activityData.activityID);
      setName(activityData.name);
      setCategory(activityData.category);
      setCapacity(activityData.capacity);
      setDescription(activityData.description);
      setLocation(activityData.roomID);
      setOldLocation(activityData.roomID);
      setEquipment(activityData.code);
      setOldEquipment(activityData.code);

      await Axios.patch('http://localhost:3001/location/cancel', { roomID: activityData.roomID });
      const locationResponse = await Axios.get('http://localhost:3001/locations');
      const equipmentResponse = await Axios.get('http://localhost:3001/equipments');

      setLocationList(locationResponse.data);
      setEquipmentList(equipmentResponse.data);

    } catch (error) {
      console.log(error);
    }
  };


  const handleLocationChange = (event) => {
    const selectedRoomID = event.target.value;
    setLocation(selectedRoomID);
  };

  const handleEquipmentChange = (event) => {
    const selectedCode = event.target.value;
    setEquipment(selectedCode);
  };

  const handleCategoryClick = (event) => {
    event.preventDefault();
    setCategory(event.target.value);
  };

  const dataBody = {
    name,
    category,
    capacity,
    description,
    location,
    equipment,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const memberResponse = await Axios.get(`http://localhost:3001/host/group/${hostID}`);
      const currentMembers = memberResponse.data.length;

      if (capacity < currentMembers) {
        alert('Cannot update capacity to a value lower than the current number of members.');
        fetchData();
      } else {

        await Axios.patch(`http://localhost:3001/update-activity/${activityID}`, dataBody);
        await Axios.patch('http://localhost:3001/equipment/cancel', { code: oldEquipment });
        await Axios.patch('http://localhost:3001/location/reserve', { roomID: location });
        await Axios.patch('http://localhost:3001/equipment/reserve', { code: equipment });
        console.log('Activity updated successfully!');
        navigate('/manage');
      }
    } catch (error) {
      console.error('Error while updating activity:', error);
    }
  };


  const handleCancel = async () => {
    await Axios.patch('http://localhost:3001/location/reserve', { roomID: oldLocation });
    navigate('/manage');
  }

  return (
    <div className="container">
      <h1>Edit Activity</h1>
      <form onSubmit={handleSubmit}>
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
              onChange={(event) => setDescription(event.target.value)}></textarea>
          </div>

          <div className='inline'>
            <label >Maximum no. of participants</label>
            <input type='number' name="capacity" min="2" max="30" value={capacity}
              onChange={(event) => setCapacity(event.target.value)} required></input>
          </div>

          <div>
            <label>Location</label>
            <select name='location' onChange={handleLocationChange} value={location} required>
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
              {equipmentList.map((val, key) => {
                return (
                  <option key={key} value={val.code}>{val.name}</option>
                )
              })}

            </select>
          </div>
        </div >
        <div className='btn-div'>
          <button type="submit" className='btn-blue'>Update</button>
          <button className='btn-red' onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default EditActivity;