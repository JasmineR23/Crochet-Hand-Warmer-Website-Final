import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


const stripePromise = loadStripe("pk_test_51TQvhQLjBQ6muBJH8Bj9oO4Lcp74PPCCoa02HqZwHxInabdafGC9vSGHIDUVE8PrnrTdef7KHR4LJyQPh50Vpuzi003mho5OlX");

createRoot(document.getElementById('root')).render(


  <BrowserRouter>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </BrowserRouter>
)
