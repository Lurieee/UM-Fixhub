export type Announcement = {
  id: string;
  title: string;
  body: string;
  date: string;
};

export function normalizeAnnouncement(apiAnnouncement: any): Announcement {
  const date = new Date(apiAnnouncement.created_at);
  return {
    id: String(apiAnnouncement.id),
    title: apiAnnouncement.title,
    body: apiAnnouncement.message,
    date: isNaN(date.getTime())
      ? ''
      : date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  };
}