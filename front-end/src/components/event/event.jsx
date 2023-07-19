import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './event.css';

const Event = ({ eventId, eventTitle, userId, name, phoneNumber }) => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  console.log({userId})
  useEffect(() => {
    const getEventData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/event/${eventTitle}/${eventId}`);
        setEventData(response.data);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };
    getEventData();
  }, [eventTitle]);

  if (!eventData) {
    return <div>Loading...</div>;
  }

  const { title, description, organizer, location, event_time, date, price, images, user_id } = eventData;
  console.log(eventData)
  const handlePopup = () => {
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    const response = await axios.post(`http://localhost:3000/participate/${eventId}`, {
      name: name,
      phoneNumber: phoneNumber,
    })
    console.log(response.data)
    setShowPopup(false);
    navigate('/')
    window.location.reload()
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleDelete = () => {
    axios.post(`http://localhost:3000/event/${eventTitle}/${eventId}/delete`)
    navigate('/')
    window.location.reload()
  }

  if(userId == user_id) {
    return(
      <div className="individual-container">
      <div className="individual-left">
        <img src={images} alt="Event" className="individual-image" />
        <h1 className="individual-title">{title}</h1>
        <p className="individual-description">{description}</p>
        <p className="individual-organizer">Organizer: {organizer}</p>
        <p className="individual-location">Location: {location}</p>
        <p className="individual-time">Event Time: {event_time}</p>
        <p className="individual-date">Date: {date.substring(0, 10)}</p>
        <p className="individual-price">Participation fee: {price}$</p>
        <button className="individual-delete-button" onClick={handlePopup}>
          Delete Event
        </button>
      </div>

      {showPopup && (
  <div className="popup">
    <div className="popup-content">
      <h2 className="popup-title">Confirmation</h2>
      <p className="popup-message">Are you sure you want to permanently delete this event?</p>
      <div className="popup-buttons">
        <button className="popup-button" onClick={handleDelete}>
          Yes
        </button>
        <button className="popup-button" onClick={handleCancel}>
          No
        </button>
      </div>
    </div>
  </div>
    )}
    </div>
    )
  }

  return (
    <div className="individual-container">
      <div className="individual-left">
        <img src={images} alt="Event" className="individual-image" />
        <h1 className="individual-title">{title}</h1>
        <p className="individual-description">{description}</p>
        <p className="individual-organizer">Organizer: {organizer}</p>
        <p className="individual-location">Location: {location}</p>
        <p className="individual-time">Event Time: {event_time}</p>
        <p className="individual-date">Date: {date.substring(0, 10)}</p>
        <p className="individual-price">Price: {price}$</p>
        <button className="individual-button" onClick={handlePopup}>
          Participate
        </button>
      </div>

      {showPopup && (
  <div className="popup">
    <div className="popup-content">
      <h2 className="popup-title">Confirmation</h2>
      <p className="popup-message">Are you sure you want to participate in this event?</p>
      <div className="popup-buttons">
        <button className="popup-button" onClick={handleConfirm}>
          Yes
        </button>
        <button className="popup-button" onClick={handleCancel}>
          No
        </button>
      </div>
    </div>
  </div>
    )}
    </div>
  );
};

export default Event;