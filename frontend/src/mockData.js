export const currentUser = { firstName: "Lorena", initials: "AS", role: "Student Account" };
export const statusStyles = {
  submitted: { label: "Submitted", bg: "bg-slate-100", text: "text-slate-600" },
  in_progress: { label: "In Progress", bg: "bg-orange-100", text: "text-red-700" },
  resolved: { label: "Resolved", bg: "bg-emerald-100", text: "text-emerald-700" },
};
export const recentReports = [
  { id: 1, title: "Broken Desk Chair", description: "Furniture repair request for study area.", location: "Library Room 302", icon: "chair", status: "in_progress", createdAt: "Oct 22, 2024" },
  { id: 2, title: "Leaky Water Fountain", description: "Water pooling near the main entrance.", location: "Student Union", icon: "droplet", status: "resolved", createdAt: "Oct 18, 2024" },
  { id: 3, title: "Light Out in Hallway", description: "Hazardous dark area near lab entrance.", location: "Science Block B", icon: "bulb", status: "submitted", createdAt: "Oct 24, 2024" },
  { id: 4, title: "Elevator Stuck (DPT)", description: "Floor display flickering and doors jamming.", location: "DPT Building", icon: "megaphone", status: "in_progress", createdAt: "Oct 21, 2024" },
  { id: 5, title: "AC Unit Making Noise", description: "Loud grinding sound in Lecture Hall A.", location: "West Wing", icon: "snowflake", status: "resolved", createdAt: "Oct 15, 2024" },
];
export const campusUpdates = [{ id: 1, title: "DPT Building Elevator Maintenance", body: "Out of service on Oct 24th from 8:00 AM to noon.", icon: "megaphone", highlighted: true }, { id: 2, title: "Water Main Repairs - North Dorms", body: "Scheduled for tomorrow. Temporary outages expected between 2-4 PM.", icon: "droplet", highlighted: false }];
export const activityStats = { totalFixed: 12, active: 3, campusSafetyScore: 94 };
