import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './event.css';

const Event = ({ eventId, eventTitle, userId, name, phoneNumber, setSuccessMessage, setDeleteMessage, setReviewPopup, reviewerStatus, username, eventData, setEventData, data, setData }) => {
  const navigate = useNavigate();
  console.log(name)
  // const [eventData, setEventData] = useState([]);
  const [showConfirmationPopup, setConfirmationPopup] = useState(false);
  const [error, setError] = useState('');
  console.log({ userId });

  useEffect(() => {
    console.log(reviewerStatus)
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

  if (eventData === null) {
    return <div></div>;
  }

  const { title, description, organizer, location, event_time, date, price, images, user_id, participants } = eventData;
  console.log(participants)
  const handlePopup = () => {
    setConfirmationPopup(true);
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/participate/${eventId}`, {
        name: name,
        phoneNumber: phoneNumber,
        username: username,
      });

      if (response.status === 200) {
        setConfirmationPopup(false);
        navigate('/home');
        handleParticipation()
        if(localStorage.getItem('reviewerStatus') === false) {
          setReviewPopup(true)
        }
        setSuccessMessage(`Successfully registered for ${title}!`);
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('An error occurred while registering for the event.');
      }
    }
  };

  const handleParticipation = () => {
    console.log(reviewerStatus)
    if(reviewerStatus == false) {
      setReviewPopup(true)
    }
  }

  const handleCancel = () => {
    setConfirmationPopup(false);
  };

  const handleDelete = async () => {
    try {
      await axios.post(`http://localhost:3000/event/${eventTitle}/${eventId}/delete`);
      setData(data => data.filter(event => event.post_id !== eventId));

      setDeleteMessage(`Successfully deleted ${title}!`);
      setTimeout(() => {
        setDeleteMessage('');
      }, 3000);

      navigate('/home');
      // window.location.reload()
    } catch (error) {
      setError('An error occurred while deleting the event.');
    }
  };

  if (userId == user_id) {
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
          <p className="individual-price">Participation fee: {price}$</p>
          <h3>Participants:</h3>
          {participants?.map((participant, index) => (
            <p key={index}>{participant.name} / {participant.phone_number.substring(0,3) + '-' + participant.phone_number.substring(3,6) + '-' + participant.phone_number.substring(6,10)}</p>
          ))}
          <button className="individual-delete-button" onClick={handlePopup}>
            Delete Event
          </button>
        </div>

        {showConfirmationPopup && (
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
    );
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
        <p className="individual-date">Date: {date?.substring(0, 10)}</p>
        <p className="individual-price">Price: {price}$</p>
        {error && <p className="error-registration-message">You are already registered for this event!</p>}
        <button className="individual-button" onClick={handlePopup}>
          Participate
        </button>
      </div>

      {showConfirmationPopup && (
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