import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "./ProductContext";
import { FilterContext } from "./FilterContext";


const ProductDetail = () => {
  const { selectedProduct, updateProduct } = useContext(ProductContext);

  const { setFilter } = useContext(FilterContext);

  const [editedProduct, setEditedProduct] = useState({});

  useEffect(() => {
    if (selectedProduct) {
      setEditedProduct(selectedProduct);
    } else {
      setEditedProduct({ name: "", category: "", price: "", quantity: "" });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    setEditedProduct({
      ...editedProduct,

      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (selectedProduct) {
      updateProduct(editedProduct);
    } else {
      updateProduct({ ...editedProduct, id: Date.now() }); // Add new
    }
  };

  return (
    <div className="product-detail-container">
      <h2>Product Detail</h2>
      <label>
        Name:
        <input
          name="name"
          value={editedProduct.name || ""}
          onChange={handleChange}
          aria-label="Name:"
        />
      </label>
      <label>
        Category:
        <input
          name="category"
          value={editedProduct.category || ""}
          onChange={handleChange}
          aria-label="Category:"
        />
      </label>
      <label>
        Price:
        <input
          name="price"
          value={editedProduct.price || ""}
          onChange={handleChange}
          aria-label="Price:"
        />
      </label>
      <label>
        Quantity:
        <input
          name="quantity"
          value={editedProduct.quantity || ""}
          onChange={handleChange}
          aria-label="Quantity:"
        />
      </label>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ProductDetail;
