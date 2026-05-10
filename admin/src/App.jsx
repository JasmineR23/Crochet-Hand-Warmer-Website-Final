import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import HandWarmer from './pages/HandWarmer/HandWarmer'
import HandWarmerList from './pages/HandWarmerList/HandWarmerList'
import Orders from './pages/Orders/Orders'

const App = () => {
  return (
    <div className='app'>
      <Sidebar/>

      <Routes>
        <Route path='/handwarmer' element={<HandWarmer/>}/>
        <Route path='/handwarmerlist' element={<HandWarmerList/>}/>
        <Route path="/orders" element={<Orders />} />

      </Routes>
    </div>
  )
}

export default App
