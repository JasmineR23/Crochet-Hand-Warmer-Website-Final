import React from 'react'
import './StripeForm.css'
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const StripeForm = ({ clientSecret, orderData, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card,
        },
      }
    );

    if (error) {
      alert(error.message);
      return;
    }

    await axios.post("http://localhost:4000/stripe/save-order", {
      ...orderData,
      paymentIntentId: paymentIntent.id,
    });

    onSuccess();
  };

  return (
    <form onSubmit={handlePayment} className="card-form">
      <CardElement />
      <button type="submit">Pay Now</button>
    </form>
  );
};

export default StripeForm;
