import React from 'react'
import { Link } from 'react-router-dom'
import { AppData } from '../context/AppContext'

const NavBar = () => {
  const {logoutUser,user}= AppData()
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between">
      <div className="font-bold text-lg">Hii Frnd</div>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/contact">Contact</Link>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            
            <button onClick={logoutUser} className="ml-4">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default NavBar
