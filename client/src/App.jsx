import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Products from './pages/Products/Products'
import Item from './pages/Item/Item'
import Login from './components/Login/Login'
import NavBar from './components/NavBar/NavBar'
import Cart from './pages/Cart/Cart'
import Success from './pages/Success/Success'
import Profile from './pages/Profile/Profile'
import Footer from './components/Footer/Footer'
import Blog from './pages/Blog/Blog'


const App = () => {

  const [showLogin, setShowLogin] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null)


  const [users, setUsers] = useState([
    {
      id: 0,
      username: "test1Username",
      email: "test1Email@gmail.com",
      password: "test1Password",
      hand_warmers_placed: [],
    }
  ]);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <>
      <div className='app'>

        {showLogin ? <Login users={users} setUsers={setUsers} setCurrentUser={setCurrentUser} setShowLogin={setShowLogin} /> : <></>}
        <NavBar setShowLogin={setShowLogin} currentUser={currentUser} profileImage={profileImage} />


        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products users={users} setUsers={setUsers} setCurrentUser={setCurrentUser} />} />
          <Route path='/item/:id' element={<Item users={users} setUsers={setUsers} currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path='cart' element={<Cart users={users} currentUser={currentUser} setUsers={setUsers} />} />
          <Route path="/success" element={<Success />} />
          <Route path="/profile" element={<Profile currentUser={currentUser} setCurrentUser={setCurrentUser} profileImage={profileImage} setProfileImage={setProfileImage} />} />
          <Route path="/blog" element={<Blog currentUser={currentUser} setCurrentUser={setCurrentUser}/>}
          />
        </Routes>

        <Footer />

      </div>
    </>
  )
}

export default App
