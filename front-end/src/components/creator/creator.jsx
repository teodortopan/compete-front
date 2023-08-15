import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './creator.css';

const Creator = ({username, user_id}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState(username);
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [images, setImages] = useState('');
  const [date, setDate] = useState('');
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
      const response = await axios.post('https://fh0ac22h12.execute-api.us-east-2.amazonaws.com/prod/post_competitions', {
        user_id,
        title,
        description,
        organizer,
        location,
        date,
        time,
        images,
        categories,
        price,
      });
      setTitle('');
      setDescription('');
      setOrganizer('');
      setLocation('');
      setTime('');
      setImages('');
      setDate('');
      setCategories([]);
      setPrice('');

      navigate('/home');

      window.location.reload();
    } catch (error) {
      console.error('Error creating event:', error.response.data);
      setError(error.response.data.error);
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCategories((prevCategories) => [...prevCategories, value]);
    } else {
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category !== value)
      );
    }
  };

  const handleEventCreation = () => {
    if (
      title !== '' &&
      organizer !== '' &&
      location !== '' &&
      date !== '' &&
      time !== '' &&
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
          <label htmlFor="organizer">Organizer</label>
          <input
            type="text"
            id="organizer"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            disabled
            placeholder={username}
          />
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
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div className={`form-group ${error ? 'error' : ''}`}>
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
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
          <div className="creator-category-container">
          <label>
              <input
                type="checkbox"
                value="Mathematics"
                checked={categories.includes('Mathematics')}
                onChange={handleCategoryChange}
              />
              Mathematics
            </label>
            <label>
              <input
                type="checkbox"
                value="Chemistry"
                checked={categories.includes('Chemistry')}
                onChange={handleCategoryChange}
              />
              Chemistry
            </label>
            <label>
              <input
                type="checkbox"
                value="Physics"
                checked={categories.includes('Physics')}
                onChange={handleCategoryChange}
              />
              Physics
            </label>
            <label>
              <input
                type="checkbox"
                value="Biology"
                checked={categories.includes('Biology')}
                onChange={handleCategoryChange}
              />
              Biology
            </label>
            <label>
              <input
                type="checkbox"
                value="Computer Science"
                checked={categories.includes('Computer Science')}
                onChange={handleCategoryChange}
              />
              Computer Science
            </label>
            <label>
              <input
                type="checkbox"
                value="Business"
                checked={categories.includes('Business')}
                onChange={handleCategoryChange}
              />
              Business
            </label>
            <label>
              <input
                type="checkbox"
                value="Athletics"
                checked={categories.includes('Athletics')}
                onChange={handleCategoryChange}
              />
              Athletics
            </label>
            <label>
              <input
                type="checkbox"
                value="Visual/Performing Arts"
                checked={categories.includes('Visual/Performing Arts')}
                onChange={handleCategoryChange}
              />
              Visual/Performing Arts
            </label>
            <label>
              <input
                type="checkbox"
                value="Debate"
                checked={categories.includes('Debate')}
                onChange={handleCategoryChange}
              />
              Debate
            </label>
            <label>
              <input
                type="checkbox"
                value="Engineering"
                checked={categories.includes('Engineering')}
                onChange={handleCategoryChange}
              />
              Engineering
            </label>
            <label>
              <input
                type="checkbox"
                value="Public/Legal Policy"
                checked={categories.includes('Public/Legal Policy')}
                onChange={handleCategoryChange}
              />
              Public/Legal Policy
            </label>
            <label>
              <input
                type="checkbox"
                value="History"
                checked={categories.includes('History')}
                onChange={handleCategoryChange}
              />
              History
            </label>
            <label>
              <input
                type="checkbox"
                value="Geography"
                checked={categories.includes('Geography')}
                onChange={handleCategoryChange}
              />
              Geography
            </label>
            <label>
              <input
                type="checkbox"
                value="Trivia"
                checked={categories.includes('Trivia')}
                onChange={handleCategoryChange}
              />
              Trivia
            </label>
          </div>
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

            