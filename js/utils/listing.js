export function calculateDaysLeft(endsAt) {
  const endDate = new Date(endsAt);
  const now = new Date();
  const diffTime = endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export function getHighestBid(bids, startingPrice = 0) {
  if (!bids || bids.length === 0) return startingPrice;
  const highestBid = Math.max(...bids.map((bid) => bid.amount));
  return Math.max(highestBid, startingPrice);
}
