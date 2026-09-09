const STATUS_TO_FRONTEND = {
  Submitted: "submitted",
  "In Progress": "in_progress",
  Resolved: "resolved",
};

const STATUS_TO_BACKEND = {
  submitted: "Submitted",
  in_progress: "In Progress",
  resolved: "Resolved",
};

export const ICON_BY_CATEGORY = {
  Electrical: "zap",
  Plumbing: "droplet",
  Furniture: "chair",
  Infrastructure: "wrench",
  Cleanliness: "sparkles",
};

export function deriveIcon(category) {
  return ICON_BY_CATEGORY[category] || "wrench";
}

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

export function normalizeReport(apiReport) {
  return {
    id: apiReport.id,
    title: apiReport.title,
    location: apiReport.building,
    room: apiReport.room,
    description: apiReport.description,
    category: apiReport.category,
    icon: deriveIcon(apiReport.category),
    urgency: (apiReport.urgency || "").toLowerCase(),
    status: STATUS_TO_FRONTEND[apiReport.status] || "submitted",
    assignedTo: apiReport.assigned_to || "",
    photoUri: apiReport.photo_url || null,
    createdAt: formatDate(apiReport.created_at) || apiReport.created_at,
    submittedAt: apiReport.created_at,
    inProgressAt: apiReport.in_progress_at || null,
    resolvedAt: apiReport.resolved_at || null,
  };
}

export function denormalizeStatus(frontendStatus) {
  return STATUS_TO_BACKEND[frontendStatus] || "Submitted";
}