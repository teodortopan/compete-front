import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './home.css';

const Home = () => {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/competitions');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filterDataByCategory = (category) => {
    setSelectedCategory(category);
  };

  const filteredData = selectedCategory
    ? data.filter((item) => item.category === selectedCategory)
    : data;

  return (
    <div className="container">
      <div className="sidebar">
        <h4>Categories</h4>
        <ul className="category-list">
        <li
            onClick={() => filterDataByCategory('')}
            className="category-item">
            None
          </li>
          <li
            onClick={() => filterDataByCategory('Math')}
            className="category-item">
            Math
          </li>
          <li
            onClick={() => filterDataByCategory('Chemistry')}
            className="category-item">
            Chemistry
          </li>
          <li
            onClick={() => filterDataByCategory('Physics')}
            className="category-item">
            Physics
          </li>
          <li
            onClick={() => filterDataByCategory('Biology')}
            className="category-item">
            Biology
          </li>
          <li
            onClick={() => filterDataByCategory('Computer Science')}
            className="category-item">
            Computer Science
          </li>
          <li
            onClick={() => filterDataByCategory('Business')}
            className="category-item">
            Business
          </li>
          <li
            onClick={() => filterDataByCategory('Other')}
            className="category-item">
            Other
          </li>
        </ul>
      </div>
      <div className="event-container">
        {filteredData.map((item) => (
          <div key={item.post_id} className="event-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="event-info">
              <p>Date: {item.date.substring(0, 10)}</p>
              <p>Time: {item.event_time}</p>
              <p>Location: {item.location}</p>
              <p>Organizer: {item.organizer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;