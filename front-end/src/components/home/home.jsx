import React from 'react'
import './home.css';

const Home = ({ filterDataByCategory, filteredData }) => {

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
          <li onClick={() => filterDataByCategory('Literary Studies')} className="category-item">
            Literary Studies
          </li>
        </ul>
      </div>
      <div className="content">
        
          {filteredData.map((item, index) => (
            <div key={item.post_id} className="event-card">
              <img className="event-image" src={item.images} alt="Event" />
              <h3>{item.title}</h3>
              <div className="event-info">
                <p>Date & Time: {item.date.substring(0, 10) + ' @ ' + item.event_time}</p>
                <p>Location: {item.location}</p>
                <p>Organizer: {item.organizer}</p>
                <p>Price: ${item.price}</p>
              </div>
            </div>
          ))}
      
      </div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <h1 className="website-name">Compete.</h1>
            <ul className="footer-links">
              <li>
                <a href="/services">Services</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-right">
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;