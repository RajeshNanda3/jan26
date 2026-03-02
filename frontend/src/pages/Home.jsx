import React, { useState } from 'react'
import { AppData } from '../context/AppContext'
import { Link, useNavigate } from 'react-router-dom'
import Loading from '../Loading'


const Home = () => {
  const [loading, setLoading] = useState(true);
  const {logoutUser,user}= AppData()
  const navigate =useNavigate()
  console.log(user.role)
  console.log(user)
  
  // const handleLogout= ()=>{
  //   console.log("hii mama")
  //   logoutUser
  // }
  
  return (
    <>
    {/* {loading? ( */}
      {/* <Loading/> */}
    {/* ) : ( */}
      <div className='flex flex-col justify-center items-center h-screen'>
      <button className=' bg-blue-500! text-black-50 p-2 rounded-4xl' onClick ={()=> logoutUser(navigate)}>log out</button>
      
      {
        user && user.role === "ADMIN" &&
        <Link to='/dashboard' className='btn btn-primary bg-green-500 text-black-50 p-2 rounded-4xl' >Dashboard</Link>
      }
    </div>
    {/* ) */}

    {/* } */}
      
    
    {/* <div className='flex flex-col justify-center items-center h-screen'>
      <button className=' bg-blue-500! text-black-50 p-2 rounded-4xl' onClick ={()=> logoutUser(navigate)}>log out</button>
      {
        user && user.role === "ADMIN" &&
        <Link className='btn btn-primary bg-green-500 text-black-50 p-2 rounded-4xl' >Dashboard</Link>
      }
    </div> */}
    </>
  )
}

export default Home