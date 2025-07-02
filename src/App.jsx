import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Chat from './Pages/Chat'
import Home from './Pages/Home'
import Header from './components/Header'


const App = () => {
  return (
    <>
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path='/chat' element={<Chat/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App