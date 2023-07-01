import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Home from './components/home/home'
import Services from './components/services'
import About from './components/about'
import Contact from './components/contact'
import Navigation from './components/navigation'
import SignUp from './components/login/signup'
import Login from './components/login/login'
const App = () => {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token'); // Get the session token or JWT from local storage
  
    if (token) {
      // User is authenticated
      setIsAuthenticated(true);
    } else {
      // User is not authenticated
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/competitions')
        setData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    };

    fetchData()
  }, [])

  const filterDataByCategory = (category, searchText) => {
    setSelectedCategory(category)
    setSearchText(searchText)
  }

  const filteredData = selectedCategory
  ? data.filter(
      (item) =>
        item.category.includes(selectedCategory) &&
        item.title.toLowerCase().includes(searchText?.toLowerCase() || '')
    )
  : data.filter((item) =>
      item.title.toLowerCase().includes(searchText?.toLowerCase() || '')
    )


  return (
    <>
      <Navigation filterDataByCategory={filterDataByCategory} setSearchText={setSearchText}/>
      <Routes>
        <Route exact path='/' element={<Home filterDataByCategory={filterDataByCategory} filteredData={filteredData}/>}/>
        <Route path='/services' Component={Services} />
        <Route path='/about' Component={About} />
        <Route path='/contact' Component={Contact} />
        <Route path='/signup' Component={SignUp} />
        <Route path='/login' Component={Login} />
      </Routes>
    </>
  )
}

export default App
