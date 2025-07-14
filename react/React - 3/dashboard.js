import "./Dashboard.css";

function Dashboard() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalCashSales, setTotalCashSales] = useState(0);
  const [totalCreditSales, setTotalCreditSales] = useState(0);
  const [mostSalesBuyer, setMostSalesBuyer] = useState({ buyerName: "", saleTotal: 0 });

  useEffect(() => {
    const fetchSales = async () => {
      const sales = await getSalesData();
      setTotalSales(calculateTotalSales(sales));
      setTotalCashSales(calculateTotalCashSale(sales));
      setTotalCreditSales(calculateTotalCreditSale(sales));
      setMostSalesBuyer(calculateBuyerWithMostSale(sales));
    };

    fetchSales();
  }, []);

  return (
    <div className="dashboard">
      <div className="card">
        <h2>Total Sales</h2>
        <p>{totalSales}</p>
      </div>
      <div className="card">
        <h2>Total Cash Sales</h2>
        <p>{totalCashSales}</p>
      </div>
      <div className="card">
        <h2>Total Credit Sales</h2>
        <p>{totalCreditSales}</p>
      </div>
      <div className="card">
        <h2>Buyer with Most Sales</h2>
        <p>{mostSalesBuyer.buyerName}</p>
        <p>{mostSalesBuyer.saleTotal}</p>
      </div>
    </div>
  );
}

export default Dashboard;
