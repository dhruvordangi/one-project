import { useContext, useEffect } from 'react';
import React from 'react'
import { UserContext } from '../UserContext';
import { Link } from 'react-router-dom';
import ProfileLogo from './ProfileLogo.jsx';

function Header() {
  const {setUserInfo, userInfo}= useContext(UserContext)
  useEffect( ()=>{
    fetch('http://localhost:3000/header', {
      credentials:'include',
    }).then(response =>{
      response.json().then(userInfo =>{
        setUserInfo(userInfo)
      })
    })
  },[] );


  function logout(){
    fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials:'include'
    });
    setUserInfo(null);
  }

  const username= userInfo?.username;
  console.log(username);
  


  return (
    <div className="homepage-container">
      <header className="header">
        <Link to='/'>
        <h1>Task Manager</h1>
        <img src="https://img.freepik.com/free-vector/1-logo-design-template_23-2151180197.jpg?t=st=1735323970~exp=1735327570~hmac=098a77c9d8488eaa4d6c8c7c6402994a3e2d69df948ea4eb899d1f8b3ae4a6e8&w=740" width="100" height="100" alt="image" />
        </Link>
        
        <nav>
          <ul className="nav-links">
            {username && 
            <>
            <Link onClick={logout}>
            <li className='user-profile-logo'>Logout</li>
            </Link>
            <li><Link className='user-profile-logo' to='/create-assignment'>Create Assingment</Link></li>
           <Link to='/profile'> <li><ProfileLogo name={username} /></li></Link>
            </>}
            {
              !username &&
              <>
                <li><Link to='/login'>Login</Link></li>
                <li><Link to='/register'>Register</Link></li>
              </>
            }
          </ul>
        </nav>
      </header>
    </div>
  );


}

export default Header