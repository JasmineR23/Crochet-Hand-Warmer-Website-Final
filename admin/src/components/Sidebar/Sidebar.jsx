import React from 'react'
import './Sidebar.css'
import { useNavigate } from "react-router-dom"

const Sidebar = () => {

  const navigate = useNavigate();

  return (
    <div className='sidebar'>
      <div className='sidebar-option' onClick={() => navigate("/handwarmer")}>Register hand warmer</div>
      <div className='sidebar-option' onClick={() => navigate("/handwarmerlist")}>View Hand warmers</div>
      <div className='sidebar-option' onClick={() => navigate("/orders")}>View orders</div>
    </div>
  )
}

export default Sidebar
