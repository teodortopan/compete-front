import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Home from './components/home/home';
import Services from './components/services';
import About from './components/about/about';
import Contact from './components/contact/contact';
import Navigation from './components/navigation/navigation';
import SignUp from './components/login/signup';
import Login from './components/login/login';
import Profile from './components/profile/profile';
import Footer from './components/footer/footer';
import Event from './components/event/event'
import Creator from './components/creator/creator';
import UserEvents from './components/userEvents/userEvents';
import Landing from './components/landing/landing';

const App = () => {
  const [token, setToken] = useState('')
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
  const [unregisterMessage, setUnregisterMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [loginMessage, setLoginMessage] = useState('')
  const [reviewPopup, setReviewPopup] = useState(false)
  const [reviewerStatus, setReviewerStatus] = useState(false)
  const [userData, setUserData] = useState(null);
  const [userEventData, setUserEventData] = useState(null)
  const [eventData, setEventData] = useState([]);
  useEffect(() => {
    if(!localStorage.getItem('reviewerStatus')) {
      localStorage.setItem('reviewerStatus', false)
    }
    // Check if the user is authenticated
    const storedToken = sessionStorage.getItem('token'); // Get the session token or JWT from local storage
    const storedUsername = sessionStorage.getItem('username');
    const storedTitle = localStorage.getItem('eventTitle')
    const storedId = localStorage.getItem('eventId')
    const storedUserId = sessionStorage.getItem('userId')
    const storedPhoneNumber = sessionStorage.getItem('phoneNumber')
    const storedName = sessionStorage.getItem('name')
    const storedReviewerStatus = localStorage.getItem('reviewerStatus')
    if (storedToken && storedUsername && storedUserId && storedPhoneNumber) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // User is authenticated
      setToken(storedToken)
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
        const response = await axios.get('https://us-central1-compete-ce97a.cloudfunctions.net/api/competitions', {
        });
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
      const response = await axios.get('https://us-central1-compete-ce97a.cloudfunctions.net/api/username', { params: { email } });
      setUsername(response.data[0]?.username || 'Username not found');
    } catch (error) {
      console.error('Error fetching username:', error);
      setUsername('Error fetching username');
    }
  };

  const filterDataByCategory = (category, searchText) => {
    if(category === 'None') {
      setSelectedCategory('')
    } else {
      setSelectedCategory(category);
    }
    setSearchText(searchText);
  };

  const today = new Date(); // Get the current date
today.setDate(today.getDate() - 2); // Subtract 2 days from the current date

const filteredData = selectedCategory
  ? data.filter(
      (item) =>
        item.category?.includes(selectedCategory) &&
        item.title.toLowerCase().includes(searchText?.toLowerCase() || '') &&
        new Date(item.eventTime) >= today // Compare the item's date with today
    )
  : data.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchText?.toLowerCase() || '') &&
        new Date(item.eventTime) >= today // Compare the item's date with today
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
        <Route exact path='/' element={<Landing />} />
        <Route path='/home' element={<Home filterDataByCategory={filterDataByCategory} filteredData={filteredData} onEventId={handleEventId} onEventTitle={handleEventTitle} successMessage={successMessage} deleteMessage={deleteMessage} loginMessage={loginMessage} setLoginMessage={setLoginMessage} reviewPopup={reviewPopup} setReviewPopup={setReviewPopup} name={name} eventId={eventId} userId={userId} reviewerStatus={reviewerStatus} selectedCategory={selectedCategory} unregisterMessage={unregisterMessage}/>} />
        <Route path='/services' element={<Services />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/creator' element={<Creator username={username} userId={userId} setReviewPopup={(setReviewPopup)}/>} />
        <Route path='/user/:username'element={<Profile username={username} setUserId={setUserId} setName={setName} setPhoneNumber={setPhoneNumber} setLoginMessage={setLoginMessage} loginMessage={loginMessage} userData={userData} setUserData={setUserData}/>} />
        <Route path='/user/:username/:id/events'element={<UserEvents name={name} userId={userId} onEventId={handleEventId} onEventTitle={handleEventTitle} userEventData={userEventData} setUserEventData={setUserEventData}/>} />
        <Route path='/event/:competition/:id'element={<Event eventId={eventId} eventTitle = {eventTitle} user_id={userId} name={name} phoneNumber={phoneNumber} setDeleteMessage={setDeleteMessage} setSuccessMessage={setSuccessMessage} setReviewPopup={setReviewPopup} reviewerStatus={reviewerStatus} username={username} eventData={eventData} setEventData={setEventData} data={data} setData={setData} setUnregisterMessage={setUnregisterMessage}/>} />
        <Route
          path='/login'
          element={<Login handleLogin={() => setIsAuthenticated(true)} setEmail={handleEmailChange} getUsername={getUsername} setLoginMessage={setLoginMessage} setUsername={setUsername} setToken={setToken} setUserId={setUserId}/>}
        />
      </Routes>
      <Footer userData={userData} userEventData={userEventData} eventData={eventData}/>
    </>
  );
};

export default App;