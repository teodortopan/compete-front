import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../footer/footer';
import './userEvents.css'
import { useNavigate, Link } from 'react-router-dom';

const UserEvents = ({ userId, onEventId, onEventTitle, userEventData, setUserEventData }) => {
  const storedName = sessionStorage.getItem('name')
  const navigate = useNavigate();
  // const [userEventData, setUserEventData] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8;

  const handleEventClick = (id, title) => {
    localStorage.setItem('eventTitle', title);
    localStorage.setItem('eventId', id);
    onEventId(id);
    onEventTitle(title);
    navigate(`/event/${title}/${id}`);
  }
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  }
  
  useEffect(() => {
    console.log(userId, storedName)
    const getUserEventData = async () => {
      try {
        const encodedName = encodeURIComponent(storedName)
        console.log(encodedName)
        const response = await axios.get(`http://localhost:3000/${encodedName}/${userId}`);
        setUserEventData(response.data);
        console.log(response.data)
      } catch (error) { 
        console.error('Error fetching user-event data:', error);
      }
    };
    getUserEventData();
  }, [storedName, userId]);

  if (userEventData === null || !storedName) {
    return <div></div>;
  }
  
  if (userEventData.length === 0) {
    return <div>No events found for the user.</div>;
  }

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = userEventData.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalEvents = userEventData.length;
  const totalPages = Math.ceil(totalEvents / eventsPerPage);


  return (
    <div className="user-container">
      <div className="user-content">
        
          {currentEvents.map((item) => (
            <div key={item.post_id} className="user-event-card" onClick={() => handleEventClick(item.post_id, item.title)}>
              <img className="user-event-image" src={item.images} alt="Event" />
              <h3 className='user-event-title'>{item.title}</h3>
              <div className="user-event-info">
                <p>Date & Time: {item.date?.substring(0, 10) + ' @ ' + item.event_time}</p>
                <p className={`user-event-attribute ${item.location?.length > 25 ? 'user-event-description' : ''}`}>Location: {item.location}</p>
                <p className={`user-event-attribute ${item.organizer?.length > 25 ? 'user-event-description' : ''}`}>Organizer: {item.organizer}</p>
                <p>Participation fee: ${item.price}</p>
              </div>
            </div>
          ))}
      
      <div className="pagination-container">
          <div className="pagination">
            {/* Left arrow */}
            {currentPage > 1 && userEventData.length > 0 && (
              <button key="prev" onClick={() => handlePageChange(currentPage - 1)}>
                 <i className="fas fa-chevron-left"></i>
              </button>
            )}

            {/* Current page number */}
            <span className='page-number'>{currentPage}</span>

            {/* Right arrow */}
            {currentPage * eventsPerPage < userEventData.length && (
              <button key='next' onClick={() => handlePageChange(currentPage + 1)}>
                 <i className="fas fa-chevron-right"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEvents