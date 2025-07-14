import React, { useContext } from "react";

import { ProductContext } from "../contexts/ProductContext";

import { FilterContext } from "../contexts/FilterContext";

import LowStockAlert from "./LowStockAlert";

import ProductFilter from "./ProductFilter";

import "../App.css";

const ProductList = () => {
  const { products, setSelectedProduct } = useContext(ProductContext);

  const { filter } = useContext(FilterContext);

  const filteredProducts =
    filter === "All" ? products : products.filter((p) => p.category === filter);

  return (
    <div className="product-list-container">
      <h2>Product List</h2>
      <ProductFilter />
      <LowStockAlert />
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <button key={product.id} onClick={() => setSelectedProduct(product)}>
            {product.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
