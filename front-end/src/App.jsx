import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Home from './components/home/home';
import Services from './components/services';
import About from './components/about';
import Contact from './components/contact';
import Navigation from './components/navigation/navigation';
import SignUp from './components/login/signup';
import Login from './components/login/login';
import Profile from './components/profile/profile';
import Footer from './components/footer/footer';
import Event from './components/event/event'
import Creator from './components/creator/creator';
import UserEvents from './components/userEvents/userEvents';

const App = () => {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [eventId, setEventId] = useState('')
  const [eventTitle, setEventTitle] = useState('')
  const [userId, setUserId] = useState('')
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [loginMessage, setLoginMessage] = useState('')
  const [reviewPopup, setReviewPopup] = useState(false)
  const [reviewerStatus, setReviewerStatus] = useState(false)
  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token'); // Get the session token or JWT from local storage
    const storedUsername = localStorage.getItem('username');
    const storedTitle = localStorage.getItem('eventTitle')
    const storedId = localStorage.getItem('eventId')
    const storedUserId = localStorage.getItem('userId')
    const storedPhoneNumber = localStorage.getItem('phoneNumber')
    const storedName = localStorage.getItem('name')
    const storedReviewerStatus = localStorage.getItem('reviewerStatus')
    console.log('Token from local storage:', token);
    console.log('Username from local storage:', storedUsername)
    console.log('user id from local storage:', storedUserId);
    console.log('name from local storage:', storedName);
    console.log('phone number from local storage:', storedPhoneNumber);
    console.log('reviewer status from local storage:', storedReviewerStatus);
    if (token && storedUsername && storedUserId && storedName && storedPhoneNumber) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // User is authenticated
      setReviewerStatus(storedReviewerStatus)
      setIsAuthenticated(true);
      setUsername(storedUsername);
      setEventId(storedId)
      setEventTitle(storedTitle)
      setUserId(storedUserId)
      setName(storedName)
      setPhoneNumber(storedPhoneNumber)
    } else {
      // User is not authenticated
      setIsAuthenticated(false);
      setUsername('');
    }
  }, []);

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

  useEffect(() => {
    if (email) {
      getUsername();
    }
  }, [email]);

  const getUsername = async () => {
    try {
      console.log(email);
      const response = await axios.get('http://localhost:3000/username', { params: { email } });
      setUsername(response.data[0]?.username || 'Username not found');
    } catch (error) {
      console.error('Error fetching username:', error);
      setUsername('Error fetching username');
    }
  };

  const filterDataByCategory = (category, searchText) => {
    setSelectedCategory(category);
    setSearchText(searchText);
  };

  const filteredData = selectedCategory
    ? data.filter( 
        (item) =>
          item.category.includes(selectedCategory) &&
          item.title.toLowerCase().includes(searchText?.toLowerCase() || '')
      )
    : data.filter((item) =>
        item.title.toLowerCase().includes(searchText?.toLowerCase() || '')
      );

  const handleEventId = (id) => {
    setEventId(id)
  }

  const handleEventTitle = (title) => {
    setEventTitle(title)
  }

  const handleEmailChange = (newEmail) => {
    setEmail(newEmail)
  }

  return (
    <>
      <Navigation
        filterDataByCategory={filterDataByCategory}
        setSearchText={setSearchText}
        isAuthenticated={isAuthenticated}
        username={username}
        userId={userId}
      />
      <Routes>
        <Route exact path='/' element={<Home filterDataByCategory={filterDataByCategory} filteredData={filteredData} onEventId={handleEventId} onEventTitle={handleEventTitle} successMessage={successMessage} deleteMessage={deleteMessage} loginMessage={loginMessage} setLoginMessage={setLoginMessage} reviewPopup={reviewPopup} setReviewPopup={setReviewPopup} name={name} eventId={eventId} userId={userId} setReviewerStatus={setReviewerStatus}/>} />
        <Route path='/services' element={<Services />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/creator' element={<Creator username={username} user_id={userId}/>} />
        <Route path='/user/:username'element={<Profile username={username} setUserId={setUserId} setName={setName} setPhoneNumber={setPhoneNumber} setLoginMessage={setLoginMessage} loginMessage={loginMessage}/>} />
        <Route path='/user/:username/:id/events'element={<UserEvents name={name} userId={userId}/>} />
        <Route path='/event/:competition/:id'element={<Event eventId={eventId} eventTitle = {eventTitle} userId={userId} name={name} phoneNumber={phoneNumber} setDeleteMessage={setDeleteMessage} setSuccessMessage={setSuccessMessage} setReviewPopup={setReviewPopup} reviewerStatus={reviewerStatus}/>} />
        <Route
          path='/login'
          element={<Login handleLogin={() => setIsAuthenticated(true)} setEmail={handleEmailChange} getUsername={getUsername} setLoginMessage={setLoginMessage}/>}
        />
      </Routes>
      <Footer />
    </>
  );
};

export default App;