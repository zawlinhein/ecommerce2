import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allProducts } from "./productSlice";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";

const Home = () => {
  const [searchText, setSearchText] = useState("");
  const productList = useSelector(allProducts);

  const filterItems = productList.filter((item) => {
    return item.title.toLowerCase().includes(searchText.toLowerCase());
  });

  const navigate = useNavigate();
  const RenderProducts = () => {
    return (
      <>
        <SearchBar setSearchText={setSearchText} searchText={searchText} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            padding: "20px",
          }}
        >
          {filterItems.map((product) => (
            <>
              <ProductCard product={product} key={product.id} />
              {/*  <p style={{ padding: "10px" }}>{product.title}</p>
            <button onClick={() => navigate(`/products/${product.id}`)}>
              View Detail
            </button> */}
            </>
          ))}
        </div>
      </>
    );
  };
  return (
    <div>
      <RenderProducts />
    </div>
  );
};

export default Home;
