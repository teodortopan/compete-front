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

const App = () => {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token'); // Get the session token or JWT from local storage
    const storedUsername = localStorage.getItem('username');
    console.log('Token from local storage:', token);
    console.log('Username from local storage:', storedUsername);
    if (token && storedUsername) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // User is authenticated
      setIsAuthenticated(true);
      setUsername(storedUsername);
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

  return (
    <>
      <Navigation
        filterDataByCategory={filterDataByCategory}
        setSearchText={setSearchText}
        isAuthenticated={isAuthenticated}
        username={username}
      />
      <Routes>
        <Route exact path='/' element={<Home filterDataByCategory={filterDataByCategory} filteredData={filteredData} />} />
        <Route path='/services' component={Services} />
        <Route path='/about' component={About} />
        <Route path='/contact' component={Contact} />
        <Route path='/signup' component={SignUp} />
        <Route
          path='/login'
          element={<Login handleLogin={() => setIsAuthenticated(true)} setEmail={setEmail} getUsername={getUsername} />}
        />
      </Routes>
    </>
  );
};

export default App;