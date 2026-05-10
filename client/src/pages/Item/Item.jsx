import React, { useEffect, useState } from "react";
import "./Item.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const Item = ({ currentUser, users, setUsers }) => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/handwarmers/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error("Error fetching item:", err);
      }
    };

    fetchItem();
  }, [id]);

  if (!item) return <div className="loading">Loading...</div>;

  const itemId = Number(item.id);

  const userFromState = currentUser
    ? users.find(u => Number(u.id) === Number(currentUser.id))
    : null;

  if (currentUser && !userFromState) {
    console.warn("⚠ userFromState is NULL — user not in users[]");
  }

  const placedEntry = userFromState
    ? userFromState.hand_warmers_placed.find(
        p => Number(p.itemId) === itemId
      )
    : null;

  const placedQuantity = placedEntry?.quantity_placed || 0;

  const addPlaced = () => {
    if (!currentUser) {
      alert("Please log in first");
      return;
    }

    if (placedQuantity >= item.quantity) {
      alert("You cannot add more. This exceeds the available quantity.");
      return;
    }

    setUsers(prevUsers =>
      prevUsers.map(u => {
        if (Number(u.id) !== Number(currentUser.id)) return u;

        const updated = {
          ...u,
          hand_warmers_placed: [...u.hand_warmers_placed],
        };

        const existing = updated.hand_warmers_placed.find(
          p => Number(p.itemId) === itemId
        );

        if (existing) {
          existing.quantity_placed += 1;
        } else {
          updated.hand_warmers_placed.push({
            itemId,
            name: item.name,
            quantity_placed: 1,
          });
        }

        return updated;
      })
    );
  };

  const removePlaced = () => {
    if (!currentUser) {
      alert("Please log in first");
      return;
    }

    setUsers(prevUsers =>
      prevUsers.map(u => {
        if (Number(u.id) !== Number(currentUser.id)) return u;

        const updated = {
          ...u,
          hand_warmers_placed: [...u.hand_warmers_placed],
        };

        const existing = updated.hand_warmers_placed.find(
          p => Number(p.itemId) === itemId
        );

        if (existing) {
          if (existing.quantity_placed === 1) {
            updated.hand_warmers_placed = updated.hand_warmers_placed.filter(
              p => Number(p.itemId) !== itemId
            );
          } else {
            existing.quantity_placed -= 1;
          }
        }

        return updated;
      })
    );
  };

  return (
    <div className="item-display">
      <div className="left-pane">
        {/* remove empty src warnings */}
        <img className="left-arrow" src={null} alt="" />

        <img
          className="display-image"
          src={`http://localhost:4000/uploads/${item.image}`}
          alt={item.name}
        />

        <img className="right-arrow" src={null} alt="" />
      </div>

      <div className="right-pane">
        <div className="name">Name: {item.name}</div>
        <div className="description">Description: {item.description}</div>
        <div className="price">Price: $40</div>
        <div className="quantity-available">
          Quantity Available: {item.quantity}
        </div>

        <div className="toggle-amount">
          <div className="add" onClick={addPlaced}>+</div>
          <div className="quantity">{placedQuantity}</div>
          <div className="substract" onClick={removePlaced}>-</div>
        </div>
      </div>

    </div>
    

  );
};

export default Item;
