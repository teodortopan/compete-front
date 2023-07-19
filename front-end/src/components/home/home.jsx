import React, { useState } from 'react'
import './home.css';
import Footer from '../footer/footer';
import { useNavigate } from 'react-router-dom';

const Home = ({ filterDataByCategory, filteredData, onEventId, onEventTitle }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;
  const handleEventClick = (id, title) => {
    const token = localStorage.getItem('token');

    if(token) {
      localStorage.setItem('eventTitle', title)
      localStorage.setItem('eventId', id)
      onEventId(id)
      onEventTitle(title)
      console.log(id)
      console.log(title)
      navigate(`/event/${title}/${id}`)
    }
    else {
      navigate('/login')
    }

  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredData.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalEvents = filteredData.length;
  const totalPages = Math.ceil(totalEvents / eventsPerPage);

  return (
    <div className="container">
      <div className="sidebar">
        <h4>Categories</h4>
        <ul className="category-list">
          <li onClick={() => filterDataByCategory('')} className="category-item">
            None
          </li>
          <li onClick={() => filterDataByCategory('Mathematics')} className="category-item">
            Mathematics
          </li>
          <li onClick={() => filterDataByCategory('Chemistry')} className="category-item">
            Chemistry
          </li>
          <li onClick={() => filterDataByCategory('Physics')} className="category-item">
            Physics
          </li>
          <li onClick={() => filterDataByCategory('Biology')} className="category-item">
            Biology
          </li>
          <li onClick={() => filterDataByCategory('Computer Science')} className="category-item">
            Computer Science
          </li>
          <li onClick={() => filterDataByCategory('Business')} className="category-item">
            Business
          </li>
          <li onClick={() => filterDataByCategory('Athletics')} className="category-item">
            Athletics
          </li>
          <li onClick={() => filterDataByCategory('Visual/Performing Arts')} className="category-item">
            Visual/Performing Arts
          </li>
          <li onClick={() => filterDataByCategory('Debate')} className="category-item">
            Debate
          </li>
          <li onClick={() => filterDataByCategory('Engineering')} className="category-item">
            Engineering
          </li>
          <li onClick={() => filterDataByCategory('Public/Legal Policy')} className="category-item">
            Public/Legal Policy
          </li>
          <li onClick={() => filterDataByCategory('History')} className="category-item">
            History
          </li>
          <li onClick={() => filterDataByCategory('Geography')} className="category-item">
            Geography
          </li>
          <li onClick={() => filterDataByCategory('Trivia')} className="category-item">
            Trivia
          </li>
        </ul>
      </div>
      <div className="content">
        
          {currentEvents.map((item) => (
            <div key={item.post_id} className="event-card" onClick={() => handleEventClick(item.post_id, item.title)}>
              <img className="event-image" src={item.images} alt="Event" />
              <h3 className='event-title'>{item.title}</h3>
              <div className="event-info">
                <p>Date & Time: {item.date.substring(0, 10) + ' @ ' + item.event_time}</p>
                <p className={`event-attribute ${item.location.length > 25 ? 'event-description' : ''}`}>Location: {item.location}</p>
                <p className={`event-attribute ${item.organizer.length > 25 ? 'event-description' : ''}`}>Organizer: {item.organizer}</p>
                <p>Participation fee: ${item.price}</p>
              </div>
            </div>
          ))}
      
      <div className="pagination-container">
          <div className="pagination">
            {/* Left arrow */}
            {currentPage > 1 && filteredData.length > 0 && (
              <button onClick={() => handlePageChange(currentPage - 1)}>
                 <i className="fas fa-chevron-left"></i>
              </button>
            )}

            {/* Current page number */}
            <span className='page-number'>{currentPage}</span>

            {/* Right arrow */}
            {currentPage * eventsPerPage < filteredData.length && (
              <button onClick={() => handlePageChange(currentPage + 1)}>
                 <i className="fas fa-chevron-right"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home