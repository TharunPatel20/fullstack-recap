// Javascript
const transactions = [
  { type: "deposit", amount: 100 },
  { type: "withdrawal", amount: 50 },
  { type: "deposit", amount: 200 },
  { type: "withdrawal", amount: 30 },
  { type: "deposit", amount: 150 },
];
function getTransactions() {
  const transactionType = document.getElementById("transactionType").value;
  const transactionList = document.getElementById("transactionList");
  filterTransactions(transactionType, transactionList);
}
function filterTransactions(transactionType, transactionList) {
  transactionList.innerHTML = ""; // Clear previous transactions
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transactionType === "all" || transaction.type === transactionType
  );
  filteredTransactions.forEach((transaction) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${
      transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)
    }
$${transaction.amount}`;
    listItem.className = transaction.type;
    transactionList.appendChild(listItem);
  });
}
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    document
      .getElementById("transactionType")
      .addEventListener("change", getTransactions);
    getTransactions(); // Initial call to display all transactions
  });
}
module.exports = filterTransactions;
