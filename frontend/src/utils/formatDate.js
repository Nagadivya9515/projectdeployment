export const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  }).format(new Date(date));
// formatDate("2025-05-17") → "17 May 2025"

export const formatDateTime = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(date));