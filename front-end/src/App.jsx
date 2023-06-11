import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from './components/home'
import Services from './components/services'
import About from './components/about'
import Contact from './components/contact'
import Navigation from './components/navigation'
function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route exact path='/' Component={Home} />
        <Route path='/services' Component={Services} />
        <Route path='/about' Component={About} />
        <Route path='/contact' Component={Contact} />
      </Routes>
    </>
  )
}

export default App
