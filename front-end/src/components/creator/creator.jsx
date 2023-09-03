import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './creator.css';

const Creator = ({ userId, setReviewPopup }) => {
  const username = sessionStorage.getItem('username')
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState(username);
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [images, setImages] = useState('')
  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const categoryArr = ['None', 'Mathematics', 'Chemistry', 'Physics', 'Biology', 'Computer Science', 'Business', 'Athletics', 'Visual/Performing Arts',
  'Debate', 'Engineering', 'Public/Legal Policy', 'History', 'Geography', 'Trivia']

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    try {
      const eventTime = new Date(`${date}T${time}`);
      const response = await axios.post('https://us-central1-compete-ce97a.cloudfunctions.net/api/post_competitions', {
        userId,
        title,
        description,
        organizer,
        location,
        eventTime,
        images,
        categories,
        price,
      });
      if(response.status === 200) {
        setReviewPopup(true)
        setTitle('');
        setDescription('');
        setOrganizer('');
        setLocation('');
        setTime('');
        setDate('');
        setImages('');
        setCategories([]);
        setPrice('');
        navigate('/home');
      }

    } catch (error) {
      console.error('Error creating event:', error);
      setError(error.response);
    }
  };

  const handleCategoryChange = (e) => {
    setCategories(e.target.value)
  };

  const handleEventCreation = () => {
    if (
      title !== '' &&
      organizer !== '' &&
      location !== '' &&
      time !== '' &&
      date !== '' &&
      categories.length > 0 &&
      price !== ''
    ) {
      handleConfirmation()
    } else {
      // Show required field error
      setError('Please fill out all required fields');
    }
  };

  const handleConfirmation = () => {
    setShowPopup(true)
  }

  const handleConfirm = () => {
    handleSubmit()
    setShowPopup(false);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImages(reader.result);
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    } else {
      setImageUrl('');
    }
  }

  return (
    <div className="container-creator">
      <form className="creator-form" onSubmit={handleSubmit}>
        <h2>Create Event</h2>
        {error && <p className="error-message">{error}</p>}
        <div className={`form-group ${error ? 'error' : ''}`}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={`form-group ${error ? 'error' : ''}`}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter any information the participant ought to know about the event or it's organization, such as how to pay the participation fee (if applicable), how to contact the organizer, what to expect, etc..."
          ></textarea>
        </div>
        <div className={`form-group ${error ? 'error' : ''}`}>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder='Enter a valid address, or state that the event is virtual'
          />
        </div>
        <div className={`form-group ${error ? 'error' : ''}`}>
          <label htmlFor="eventTime">Event Time</label>
          <input
            type="time"
            id="eventTime"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div className={`form-group ${error ? 'error' : ''}`}>
          <label htmlFor="eventDate">Event Date</label>
          <input
            type="date"
            id="eventDate"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className={`form-group ${error ? 'error' : ''}`}>
          <label htmlFor="images">Image</label>
          <input
            type="file"
            id="images"
            value={images.URL}
            onChange={(e) => handleImageChange(e)}
          />
        </div>
        <div className={`form-group ${error ? 'error' : ''}`}>
          <label>Category</label>
          <select
            value={categories}
            onChange={handleCategoryChange}
            className="form-control">
            <option value="">Select a category</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Physics">Physics</option>
            <option value="Biology">Biology</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Business">Business</option>
            <option value="Athletics">Athletics</option>
            <option value="Visual/Performing Arts">Visual/Performing Arts</option>
            <option value="Debate">Debate</option>
            <option value="Engineering">Engineering</option>
            <option value="Public/Legal Policy">Public/Legal Policy</option>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
            <option value="Trivia">Trivia</option>
          </select>
        </div>
        <div className={`form-group ${error ? 'error' : ''}`}>
          <label htmlFor="price">Participation Fee</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder='Enter the value of the participation fee for this event (if any)'
            min={0}
          />
        </div>
        <button type="button" className="creator-button" onClick={handleEventCreation}>
          Create Event
        </button>
      </form>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2 className="popup-title">Confirmation</h2>
            <p className="popup-message">Are you sure you want to create this event?</p>
            <div className="popup-buttons">
              <button type="submit" className="popup-button" onClick={handleConfirm}>
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

export default Creator;

            