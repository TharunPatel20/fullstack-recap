import axios from "axios";

export const getSalesData = async () => {
  let { data } = await axios.get(`/sales.json`);
  return data;
};

export const calculateTotalSales = (sales) => {
  return sales.reduce((total, sale) => total + sale.saleTotal, 0);
};

export const calculateTotalCashSale = (sales) => {
  return sales
    .filter((sale) => !sale.creditCard)
    .reduce((total, sale) => total + sale.saleTotal, 0);
};

export const calculateTotalCreditSale = (sales) => {
  return sales
    .filter((sale) => sale.creditCard)
    .reduce((total, sale) => total + sale.saleTotal, 0);
};

export const calculateBuyerWithMostSale = (sales) => {
  const buyerSales = sales.reduce((acc, sale) => {
    acc[sale.buyerName] = (acc[sale.buyerName] || 0) + sale.saleTotal;
    return acc;
  }, {});

  const topBuyer = Object.entries(buyerSales).reduce((max, [buyer, total]) => {
    return total > max.saleTotal ? { buyerName: buyer, saleTotal: total } : max;
  }, { buyerName: "", saleTotal: 0 });

  return topBuyer;
};
