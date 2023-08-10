import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './home.css';
import Footer from '../footer/footer';
import { useNavigate, Link } from 'react-router-dom';

const Home = ({ filterDataByCategory, filteredData, onEventId, onEventTitle, successMessage, deleteMessage, reviewPopup, setReviewPopup, name, userId, reviewerStatus}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewBody, setReviewBody] = useState('')
  const [sortOption, setSortOption] = useState('None');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const eventId = localStorage.getItem('eventId')
  const eventsPerPage = 9;
  const handleEventClick = (id, title) => {
    const token = sessionStorage.getItem('token');

    if (token) {
      localStorage.setItem('eventTitle', title);
      localStorage.setItem('eventId', id);
      onEventId(id);
      onEventTitle(title);
      console.log(id);
      console.log(title);
      navigate(`/event/${title}/${id}`);
    } else {
      navigate('/login');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortData = (data) => {
    // Sort the data based on the selected option
    switch (sortOption) {
      case 'PriceLowToHigh':
        return data.slice().sort((a, b) => a.price - b.price);
      case 'PriceHighToLow':
        return data.slice().sort((a, b) => b.price - a.price);
      default:
        return data;
    }
  };

  const handleReviewSubmit = async(e) => {
    e.preventDefault()
    setError('');

    try {
      console.log(reviewBody)
      // const response = await axios.post(`http://localhost:3000/review/${eventId}`, {
      //   name,
      //   review: reviewBody,
      // })
      const response = await axios.post(`http://localhost:3000/review`, {
        name,
        review: reviewBody,
        id: userId,
      })
      if(response.status == 200) {
        console.log(response.data)
        setReviewPopup(false)
        localStorage.setItem('reviewerStatus', true)
        window.location.reload()
      }
    } catch (error) {
      console.error('Error sending review:', error);
      setError('Error sending review.');
    }
  }

  const handleReviewDecline = () => {
    setReviewPopup(false)
  }

  const handleReviewBodyChange = (text) => {
    setReviewBody(text)
  }

  useEffect(() => {
    const sortedData = sortData(filteredData);
    setData(sortedData);
  }, [filteredData, sortOption]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = data.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalEvents = data.length;
  const totalPages = Math.ceil(totalEvents / eventsPerPage);


  return (
    <div className="container">
      {successMessage && <div className="success-banner">{successMessage}</div>}
      {deleteMessage && <div className="delete-banner">{deleteMessage}</div>}
      <div className="sidebar">
        <h4>Categories</h4>
        <div className="sorting-dropdown">
          <label htmlFor="sortOption">Sort By:</label>
          <select id="sortOption" value={sortOption} onChange={handleSortChange}>
            <option value="None">None</option>
            <option value="PriceLowToHigh">Price Low to High</option>
            <option value="PriceHighToLow">Price High to Low</option>
          </select>
        </div>
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
              <button key="prev" onClick={() => handlePageChange(currentPage - 1)}>
                 <i className="fas fa-chevron-left"></i>
              </button>
            )}

            {/* Current page number */}
            <span className='page-number'>{currentPage}</span>

            {/* Right arrow */}
            {currentPage * eventsPerPage < filteredData.length && (
              <button key='next' onClick={() => handlePageChange(currentPage + 1)}>
                 <i className="fas fa-chevron-right"></i>
              </button>
            )}
          </div>
        </div>
        {reviewPopup && (
          <div className="review-popup">
            <div className="review-popup-content">
              <h2 className="review-popup-title">Share Your Opinion!</h2>
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <div className="review-form-body">
                  <label htmlFor="review">
                    Share your thoughts on your experience so far with this platform! All opinions will be taken into consideration to improve the platform
                  </label>
                  <textarea
                    id="review"
                    value={reviewBody}
                    onChange={(e) => handleReviewBodyChange(e.target.value)}
                    required
                  />
                </div>
              </form>
              <div className="review-popup-buttons">
                <button className="review-popup-button" onClick={handleReviewDecline}>
                  Not right now
                </button>
                <button className="review-popup-button" onClick={handleReviewSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home