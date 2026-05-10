import React, { useEffect, useState } from "react";
import axios from "axios";
import StripeForm from "../../components/StripeForm/StripeForm.jsx";
import "./Cart.css";

const Cart = ({ currentUser, users, setUsers }) => {
  const [checkoutForm, setCheckoutForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postal: "",
  });

  const [handWarmers, setHandWarmers] = useState([]);
  const [clientSecret, setClientSecret] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);

  useEffect(() => {
    const fetchWarmers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/handwarmers");
        setHandWarmers(res.data);
      } catch (err) {
        console.error("Error fetching hand warmers:", err);
      }
    };

    fetchWarmers();
  }, []);

  if (!currentUser) {
    return <h2>Please log in to view your cart.</h2>;
  }

  const userFromState = users.find(u => u.id === currentUser.id);


  const placed = userFromState?.hand_warmers_placed || [];

  const handleCheckoutChange = (e) => {
    setCheckoutForm({ ...checkoutForm, [e.target.name]: e.target.value });
  };

  const addPlaced = (itemId) => {
    setUsers(prev => {
      return prev.map(u => {
        if (u.id !== currentUser.id) return u;

        const cloned = {
          ...u,
          hand_warmers_placed: [...u.hand_warmers_placed]
        };

        const existing = cloned.hand_warmers_placed.find(p => p.itemId === itemId);

        if (existing) {
          existing.quantity_placed += 1;
        } else {
          cloned.hand_warmers_placed.push({
            itemId,
            quantity_placed: 1
          });
        }

        return cloned;
      });
    });
  };

  const removePlaced = (itemId) => {
    setUsers(prev => {
      return prev.map(u => {
        if (u.id !== currentUser.id) return u;

        const cloned = {
          ...u,
          hand_warmers_placed: [...u.hand_warmers_placed]
        };

        const existing = cloned.hand_warmers_placed.find(p => p.itemId === itemId);

        if (!existing) return cloned;

        if (existing.quantity_placed === 1) {
          cloned.hand_warmers_placed = cloned.hand_warmers_placed.filter(
            p => p.itemId !== itemId
          );
        } else {
          existing.quantity_placed -= 1;
        }

        return cloned;
      });
    });
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    const itemsForStripe = placed.map(p => {
      const fullItem = handWarmers.find(h => h.id === p.itemId);

      return {
        name: fullItem.name,
        quantity: p.quantity_placed,
        price: 40,
      };
    });

    const res = await axios.post(
      "http://localhost:4000/stripe/create-payment-intent",
      {
        items: itemsForStripe,
        shipping: checkoutForm,
        userId: currentUser.id,
      }
    );

    setClientSecret(res.data.clientSecret);
    setShowCardForm(true);
  };

  const clearCart = () => {
    setUsers(prev =>
      prev.map(u =>
        u.id === currentUser.id
          ? { ...u, hand_warmers_placed: [] }
          : u
      )
    );
  };

  const handlePaymentSuccess = () => {
    clearCart();
    window.location.href = `${window.location.origin}/success`;
  };

  return (
    <div className="cart">
      <h1>Your Cart</h1>

      {placed.length === 0 ? (
        <h3>Your cart is empty.</h3>
      ) : (
        placed.map(p => {
          const fullItem = handWarmers.find(h => h.id === p.itemId);
          if (!fullItem) return null;

          return (
            <div key={p.itemId} className="cart-item">
              <img
                src={`http://localhost:4000/uploads/${fullItem.image}`}
                alt={fullItem.name}
              />

              <div>
                <h2>{fullItem.name}</h2>
                <p>Price: $40</p>

                <div className="quantity-controls">
                  <button onClick={() => addPlaced(p.itemId)}>+</button>
                  <span>{p.quantity_placed}</span>
                  <button onClick={() => removePlaced(p.itemId)}>-</button>
                </div>

                <p>Total: ${p.quantity_placed * 40}</p>
              </div>
            </div>
          );
        })
      )}

      {!showCardForm && placed.length > 0 && (
        <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
          <h2>Checkout</h2>

          <input
            name="firstName"
            placeholder="First name"
            value={checkoutForm.firstName}
            onChange={handleCheckoutChange}
            required
          />

          <input
            name="lastName"
            placeholder="Last name"
            value={checkoutForm.lastName}
            onChange={handleCheckoutChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={checkoutForm.email}
            onChange={handleCheckoutChange}
            required
          />

          <input
            name="address"
            placeholder="Street Address"
            value={checkoutForm.address}
            onChange={handleCheckoutChange}
            required
          />

          <input
            name="city"
            placeholder="City"
            value={checkoutForm.city}
            onChange={handleCheckoutChange}
            required
          />

          <input
            name="postal"
            placeholder="Postal Code"
            value={checkoutForm.postal}
            onChange={handleCheckoutChange}
            required
          />

          <button type="submit">Continue to Payment</button>
        </form>
      )}

      {showCardForm && clientSecret && (
        <StripeForm
          clientSecret={clientSecret}
          orderData={{
            userId: currentUser.id,
            items: placed,
            total: placed.reduce(
              (sum, p) => sum + p.quantity_placed * 40,
              0
            ),
            shipping: checkoutForm,
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Cart;
