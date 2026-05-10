import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [handWarmers, setHandWarmers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/orders/all")
      .then(res => setOrders(res.data))
      .catch(err => console.error("Failed to fetch orders:", err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:4000/handwarmers")
      .then(res => setHandWarmers(res.data))
      .catch(err => console.error("Failed to fetch hand warmers:", err));
  }, []);

  const getItemInfo = (itemId) => {
    return handWarmers.find(hw => hw.id === itemId);
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await axios.delete(`http://localhost:4000/orders/delete/${orderId}`);

      // Remove from frontend state
      setOrders(prev => prev.filter(o => o.id !== orderId));

      alert("Order deleted successfully");
    } catch (err) {
      console.error("Failed to delete order:", err);
      alert("Failed to delete order");
    }
  };

  return (
    <div className="admin-orders">
      <h1>All Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">

              {/* Preview image */}
              {order.items.length > 0 && (() => {
                const firstItem = getItemInfo(order.items[0].itemId);
                return firstItem ? (
                  <img
                    src={`http://localhost:4000/uploads/${firstItem.image}`}
                    alt={firstItem.name}
                    className="order-preview-img"
                  />
                ) : null;
              })()}

              <h2>Order #{order.id}</h2>
              <p><strong>User ID:</strong> {order.userId}</p>
              <p><strong>Total:</strong> ${order.total}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

              <h3>Items:</h3>
              <ul>
                {order.items.map((item, i) => {
                  const info = getItemInfo(item.itemId);
                  return (
                    <li key={i}>
                      {info ? (
                        <>
                          <strong>{info.name}</strong> — Qty: {item.quantity_placed}
                        </>
                      ) : (
                        <>Item #{item.itemId} — Qty: {item.quantity_placed}</>
                      )}
                    </li>
                  );
                })}
              </ul>

              <h3>Shipping Info:</h3>
              <p>{order.shipping.firstName} {order.shipping.lastName}</p>
              <p>{order.shipping.address}</p>
              <p>{order.shipping.city}, {order.shipping.postal}</p>

              <p><strong>Payment Intent:</strong> {order.paymentIntentId}</p>

              {/* ⭐ DELETE BUTTON */}
              <button
                className="delete-order-btn"
                onClick={() => deleteOrder(order.id)}
              >
                Cancel Order
              </button>
              <button
              className="order-delivered-btn"

              >
                Order Delivered
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
