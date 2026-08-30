export const currentUser = {
  firstName: "Lorena",
  lastName: "Odiong",
  initials: "LO",
  email: "l.odiong@umindanao.edu.ph",
  studentId: "2026-001234",
  program: "BS Information Technology",
  campus: "Matina Campus",
};
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
export const campusUpdates = [
  { id: 1, title: "DPT Building Elevator Maintenance", body: "Out of service on Oct 24 from 8:00 AM to noon.", content: "The DPT Building elevator will be temporarily unavailable on October 24, from 8:00 AM until 12:00 noon, while the maintenance team completes a scheduled safety inspection.\n\nPlease use the nearby stairwells during this period. Students and staff who need accessibility support may contact the Facilities Help Desk for assistance.", date: "Today · 8:00 AM", icon: "megaphone", highlighted: true },
  { id: 2, title: "Water Main Repairs — North Dorms", body: "Temporary water outages are expected tomorrow between 2:00 and 4:00 PM.", content: "Repairs to the water main serving the North Dormitories are scheduled for tomorrow from 2:00 PM to 4:00 PM. Water pressure may be reduced before and after the work window.\n\nPlease store enough water for immediate needs before 2:00 PM. Service will return as soon as the repair and safety checks are completed.", date: "Today · 7:30 AM", icon: "droplet", highlighted: false },
  { id: 3, title: "Library Study Area Reopens", body: "The second-floor quiet study area is available again starting this afternoon.", content: "The Library’s second-floor quiet study area has reopened following repairs to the lighting fixtures and air-conditioning system.\n\nThe space is available during normal library hours. Thank you for your patience while the work was completed.", date: "Yesterday · 4:15 PM", icon: "bulb", highlighted: false },
  { id: 4, title: "Weekend Pathway Cleaning", body: "Walkway cleaning is scheduled around the Student Union this Saturday morning.", content: "The Facilities Team will clean the covered walkways around the Student Union on Saturday from 6:00 AM to 10:00 AM.\n\nSome sections may be briefly closed or slippery while cleaning is in progress. Please follow the posted directional signs and use alternate paths when necessary.", date: "Yesterday · 2:40 PM", icon: "sparkles", highlighted: false },
  { id: 5, title: "Science Block B Power Test", body: "A brief electrical systems test will take place after classes this Friday.", content: "A routine power systems test is planned for Science Block B this Friday at 6:30 PM. The test may cause a short interruption to lighting and selected outlets for up to 15 minutes.\n\nLaboratory users should save work and switch off sensitive equipment before the test begins. No interruption is expected during regular class hours.", date: "Aug 29 · 11:00 AM", icon: "zap", highlighted: false },
];
export const activityStats = { totalFixed: 12, active: 3, campusSafetyScore: 94 };
