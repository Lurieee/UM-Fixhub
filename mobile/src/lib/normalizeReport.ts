export type ReportStatus = 'Submitted' | 'In Progress' | 'Resolved';
export type Urgency = 'Low' | 'Medium' | 'High';

export type Report = {
  id: string;
  refCode: string;
  title: string;
  category: string;
  building: string;
  room: string;
  description: string;
  urgency: Urgency;
  status: ReportStatus;
  reportedAt: string;
  reportedBy: string;
  assignedStaff: string | null;
  photoUri: string | null;
  inProgressAt: string | null;
  resolvedAt: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

export function normalizeReport(apiReport: any): Report {
  return {
    id: String(apiReport.id),
    refCode: `#REP-${apiReport.id}`,
    title: apiReport.title,
    category: apiReport.category,
    building: apiReport.building,
    room: apiReport.room ?? '',
    description: apiReport.description,
    urgency: apiReport.urgency as Urgency,
    status: apiReport.status as ReportStatus,
    reportedAt: formatDate(apiReport.created_at),
    reportedBy: apiReport.user?.name ?? 'You',
    assignedStaff: apiReport.assigned_to || null,
    photoUri: apiReport.photo_url || null,
    inProgressAt: apiReport.in_progress_at || null,
    resolvedAt: apiReport.resolved_at || null,
  };
}