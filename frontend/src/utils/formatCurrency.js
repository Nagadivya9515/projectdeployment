export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style:    "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
// formatCurrency(4999) → "₹4,999"