export const getDate = (date) => {
  const d = new Date(date);
  return d.toLocaleString([], {
    year: "numeric",
    month: "numeric",
    // day: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit',
  });
};
