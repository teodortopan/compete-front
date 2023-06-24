import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from './components/home/home'
import Services from './components/services'
import About from './components/about'
import Contact from './components/contact'
import Navigation from './components/navigation'
import Signup from './components/signup'
import Login from './components/login'
function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route exact path='/' Component={Home} />
        <Route path='/services' Component={Services} />
        <Route path='/about' Component={About} />
        <Route path='/contact' Component={Contact} />
        <Route path='/signup' Component={Signup} />
        <Route path='/login' Component={Login} />
      </Routes>
    </>
  )
}

export default App
