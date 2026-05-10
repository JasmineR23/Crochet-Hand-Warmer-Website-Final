import React, { useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import profile_template from '../../assets/profile_template.png'

const NavBar = ({ setShowLogin, currentUser }) => {
  const [menu, setMenu] = useState("home")
  const clearActiveMenu = () => setMenu("")


  const profileSrc = currentUser?.profileImage
    ? `http://localhost:4000/uploads/${currentUser.profileImage}`
    : profile_template

  return (
    <div className='navbar'>
      <div className='navbar-left'>
        <img className='icon' src='./icon.png' alt="" />
        <div className='brandName'>Crochet Hand Warmers</div>
      </div>

      <div className='navbar-center'>
        <Link 
          to='/' 
          onClick={() => setMenu("home")} 
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>

        <Link 
          to='/products' 
          onClick={() => setMenu("products")} 
          className={menu === "products" ? "active" : ""}
        >
          Products
        </Link>

        <Link 
          to='/blog' 
          onClick={() => setMenu("blog")} 
          className={menu === "products" ? "active" : ""}
        >
          Blog
        </Link>


      </div>

      <div className='navbar-right'>
        <div className='cart'>
          <button className="cart-btn">
            <Link to='/cart' onClick={clearActiveMenu}>
              <i className="fa-solid fa-cart-shopping"></i>
            </Link>
          </button>
        </div>

        {!currentUser && (
          <ul className='logins'>
            <li 
              className='user-login' 
              onClick={() => setShowLogin(true)}
            >
              User Sign in
            </li>
          </ul>
        )}

        {currentUser && (
          <Link to='/profile' className='loggedin'>
            <img 
              className='profile-template'
              src={profileSrc}
              alt="profile"
            />
          </Link>
        )}
      </div>
    </div>
  )
}

export default NavBar
