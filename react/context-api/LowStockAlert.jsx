import React, { useContext } from "react";

import { ProductContext } from "./ProductContext";

const LowStockAlert = () => {
  const { products } = useContext(ProductContext);

  const lowStockItems = products.filter((product) => product.quantity <= 5);

  return (
    <div className="low-stock-alert">
      {lowStockItems.length > 0 ? (
        <div className="alert">
          Low Stock Alert: {lowStockItems.map((item) => item.name).join(", ")}
        </div>
      ) : null}
    </div>
  );
};

export default LowStockAlert;
