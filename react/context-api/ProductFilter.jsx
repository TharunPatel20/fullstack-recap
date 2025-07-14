import React, { useContext } from "react";

import { FilterContext } from "./FilterContext";

const ProductFilter = () => {
  const { filter, setFilter } = useContext(FilterContext);

  const categories = ["All", "Category A", "Category B", "Category C"];

  return (
    <div className="product-filter">
      <label htmlFor="category">Filter by Category: </label>
      <select
        id="category"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductFilter;
