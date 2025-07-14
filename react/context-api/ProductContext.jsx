import React, { createContext, useState, useEffect } from "react";

import initialProducts from "../data/products"; 
//no data folder as of now, assuming initialProducts is an array of product objects

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const updateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const addProduct = (newProduct) => {
    newProduct.id = products.length + 1; // simple id assignment

    setProducts([...products, newProduct]);
  };

  return (
    <ProductContext.Provider
      value={{
        products,

        selectedProduct,

        setSelectedProduct,

        updateProduct,

        addProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
