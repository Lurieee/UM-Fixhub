export function normalizeAnnouncement(apiAnnouncement) {
  const date = new Date(apiAnnouncement.created_at);
  return {
    id: apiAnnouncement.id,
    icon: "megaphone",
    title: apiAnnouncement.title,
    body: apiAnnouncement.message,
    content: apiAnnouncement.message,
    date: isNaN(date.getTime())
      ? ""
      : date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
  };
}