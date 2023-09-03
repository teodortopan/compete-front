import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './event.css';

const Event = ({ eventId, eventTitle, user_id, name, phoneNumber, setSuccessMessage, setDeleteMessage, setReviewPopup, username, eventData, setEventData, data, setData, setUnregisterMessage }) => {
  const navigate = useNavigate();
  const reviewerStatus = localStorage.getItem('reviewerStatus')
  // const [eventData, setEventData] = useState([]);
  const [showConfirmationPopup, setConfirmationPopup] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getEventData = async () => {
      try {
        const response = await axios.get(`https://us-central1-compete-ce97a.cloudfunctions.net/api/event/${eventTitle}/${eventId}`);
        setEventData(response.data);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };
    getEventData();
  }, [eventTitle]);

  if (eventData === null) {
    return <div>Loading...</div>;
  }

  const { title, description, organizer, location, eventTime, price, images, userId, participants } = eventData
  const dateEventTime = new Date(eventTime)
  const handlePopup = () => {
    setConfirmationPopup(true);
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.post(`https://us-central1-compete-ce97a.cloudfunctions.net/api/participate/${eventId}`, {
        name: name,
        phoneNumber: phoneNumber,
        username: username,
      });

      if (response.status === 200) {
        console.log(reviewerStatus)
        setConfirmationPopup(false);
        navigate('/home');
        handleParticipation()
        if(reviewerStatus === 'false') {
          console.log('reviewing')
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
    if(reviewerStatus == false) {
      setReviewPopup(true)
    }
  }

  const handleCancel = () => {
    setConfirmationPopup(false);
  };

  const handleDelete = async () => {
    try {
      await axios.post(`https://us-central1-compete-ce97a.cloudfunctions.net/api/event/${eventTitle}/${eventId}/delete`);
      setData(data => data.filter(event => event.id !== eventId));

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

  const handleUnregister = async() => {
    try {
      await axios.post(`https://us-central1-compete-ce97a.cloudfunctions.net/api/event/${eventTitle}/${eventId}/unregister`, {
        username: username
      })

      setUnregisterMessage(`Successfully unregistered from ${title}!`)
      setTimeout(() => {
        setUnregisterMessage('');
      }, 3000);

      navigate('/home');
    } catch (error) {
      setError('An error occurred while deleting the event.');
    }
  }

  if (userId == user_id) {
    return (
      <div className="individual-container">
        <div className="individual-left">
          <img src={images} alt="Event" className="individual-image" />
          <h1 className="individual-title">{title}</h1>
          <p className="individual-description">{description}</p>
          <p className="individual-organizer">Organizer: {organizer}</p>
          <p className="individual-location">Location: {location}</p>
          <p>Date & Time: {dateEventTime.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit'}) + '@' + dateEventTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</p>
          <p className="individual-price">Participation fee: {price}$</p>
          <h3>Participants:</h3>
          {participants?.map((participant, index) => (
            <ol type="1">
              <li key={index}>{participant.name} / {participant.phoneNumber?.substring(0, 3)}-{participant.phoneNumber?.substring(3, 6)}-{participant.phoneNumber?.substring(6, 10)} </li>
            </ol>
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
  if(participants?.some(map => map.username.toLowerCase() === username.toLowerCase())) {
    return (
      <div className="individual-container">
        <div className="individual-left">
          <img src={images} alt="Event" className="individual-image" />
          <h1 className="individual-title">{title}</h1>
          <p className="individual-description">{description}</p>
          <p className="individual-organizer">Organizer: {organizer}</p>
          <p className="individual-location">Location: {location}</p>
          <p>Date & Time: {dateEventTime.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit'}) + '@' + dateEventTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</p>
          <p className="individual-price">Price: {price}$</p>
          <p className='individual-participant-count'>Number of Participants: {participants?.length}</p>
          <button className="individual-unparticipate-button" onClick={handlePopup}>
            Unregister for this event
          </button>
        </div>
  
        {showConfirmationPopup && (
          <div className="popup">
            <div className="popup-content">
              <h2 className="popup-title">Confirmation</h2>
              <p className="popup-message">Are you sure you want to unregister for this event?</p>
              <div className="popup-buttons">
                <button className="popup-button" onClick={handleUnregister}>
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
        <p>Date & Time: {dateEventTime.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit'}) + '@' + dateEventTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</p>
        <p className="individual-price">Price: {price}$</p>
        <p className='individual-participant-count'>Number of Participants: {participants?.length}</p>
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