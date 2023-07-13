import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './event.css';

const Event = ({ eventId, eventTitle }) => {
  const [eventData, setEventData] = useState('');
  const [showPopup, setShowPopup] = useState(false);

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

  const { title, description, organizer, location, event_time, date, price, images } = eventData;

  const handleParticipate = () => {
    setShowPopup(true);
  };

  const handleConfirm = () => {
    // Perform the participation action here
    setShowPopup(false);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

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
        <button className="individual-button" onClick={handleParticipate}>
          Participate
        </button>
      </div>

      {showPopup && (
  <div className="popup">
    <div className="popup-content">
      <h2 className="popup-title">Confirmation</h2>
      <p className="popup-message">Are you sure you want to participate in {title}?</p>
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