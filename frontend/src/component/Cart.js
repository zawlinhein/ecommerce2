import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartItems, updateCart, setQty, setStock } from "./slice/productSlice";
import axios from "axios";
import "./cart.css";
import { useNavigate } from "react-router-dom";
import { currentUser } from "./slice/userSlice";
import { addPurchasedItems } from "./slice/userSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(currentUser);
  const itemsInCart = useSelector(cartItems);

  const changeQty = (sign, qty, productId) => {
    if (sign === "+") {
      const newQty = qty + 1;
      dispatch(setQty({ newQty, productId }));
    } else if (sign === "-") {
      const newQty = qty - 1;
      dispatch(setQty({ newQty, productId }));
    }
  };
  ///////////

  const calculateTotalPrice = () => {
    const totalPrice = itemsInCart.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );
    return totalPrice;
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString();
  };

  const handleCheckout = (e) => {
    itemsInCart.map((item) => {
      const newStock = item.stock - item.qty;
      const productId = item._id;
      axios
        .put(`http://localhost:8000/put/${item._id}`, { stock: newStock })
        .then((res) => {
          dispatch(setStock({ newStock, productId }));
        })
        .catch((error) => {
          alert("Failed to update resource. Please try again.");
          console.log(error);
        });
    });

    const filteredItems = itemsInCart.map((item) => ({
      title: item.title,
      qty: item.qty,
    }));

    const invoice = {
      date: getCurrentDate(),
      totalPrice: calculateTotalPrice(),
      items: filteredItems,
    };

    axios
      .put(`http://localhost:8000/add-invoice/${userData._id}`, invoice)
      .then((res) => {
        dispatch(addPurchasedItems(invoice));
      })
      .catch((error) => {
        alert("Failed to update resource. Please try again.");
        console.log(error);
      });

    dispatch(updateCart([]));
    navigate("/");
  };

  const removeItem = (itemId) => {
    const newItemsInCart = itemsInCart.filter((item) => item._id !== itemId);
    dispatch(updateCart(newItemsInCart));
  };
  return (
    <div className="cart-container">
      {itemsInCart.map((item) => (
        <div className="cart-item" key={item._id}>
          <div className="item-details">
            <h3>{item.title}</h3>
            <p>Price: ${item.price}</p>
          </div>
          <div>
            <p>Remaining Quantity: {item.stock - item.qty}</p>
          </div>
          <div className="quantity-control">
            <button
              onClick={() => changeQty("-", item.qty, item._id)}
              disabled={item.qty <= 1}
            >
              -
            </button>
            <span>{item.qty}</span>
            <button
              onClick={() => changeQty("+", item.qty, item._id)}
              disabled={item.qty >= item.stock}
            >
              +
            </button>
          </div>
          <p>Total: ${(item.price * item.qty).toFixed(2)}</p>
          <button onClick={() => removeItem(item._id)}>Remove</button>
        </div>
      ))}
      <div className="total-price">
        Total Price: ${calculateTotalPrice().toFixed(2)}
      </div>
      <div className="checkout-buttons">
        {"_id" in userData ? (
          <button onClick={handleCheckout}>Checkout</button>
        ) : (
          <button onClick={() => navigate("/login")}>Login</button>
        )}
        <button onClick={() => navigate("/")}>Continue Shopping</button>
      </div>
    </div>
  );
};

export default Cart;
