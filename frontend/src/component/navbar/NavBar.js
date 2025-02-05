import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { cartItems } from "../slice/productSlice";
import { useSelector } from "react-redux";
import { currentUser } from "../slice/userSlice";
import logo from "../shop.png";

const Navbar = () => {
  const navigate = useNavigate();
  const userData = useSelector(currentUser);
  const itemNum = useSelector(cartItems).length;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center space-x-6">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10" />
          </Link>
        </div>
        <div className="flex justify-center flex-grow">
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-gray-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-gray-400">
                Products
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center space-x-6">
          {userData.role === "admin" && (
            <li className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="hover:text-gray-400"
              >
                Admin Actions
              </button>
              {dropdownOpen && (
                <ul className="absolute bg-gray-700 text-white mt-2 py-2 rounded shadow-lg">
                  <li>
                    <Link
                      to="/editProducts"
                      className="block px-4 py-2 hover:bg-gray-600"
                    >
                      Edit Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/editUsers"
                      className="block px-4 py-2 hover:bg-gray-600"
                    >
                      Edit Users
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/addProduct"
                      className="block px-4 py-2 hover:bg-gray-600"
                    >
                      Add Product
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}
          {"_id" in userData ? (
            <Link to="/profile" className="hover:text-gray-400">
              Profile
            </Link>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-400">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-400">
                Register
              </Link>
            </>
          )}
          <div className="relative">
            <div
              className="navbar-cart cursor-pointer"
              onClick={() => navigate("/cart")}
            >
              <FaShoppingCart className="text-xl" />
              {itemNum > 0 && (
                <span className="absolute -right-2 -top-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {itemNum}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
