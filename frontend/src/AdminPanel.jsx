import { useEffect, useState } from "react";
import { BarChart3, BellRing, ChevronDown, Download, FileText, Grid2X2, Megaphone, Plus, Search, Trash2, Users, X, XCircle } from "lucide-react";
import Profile from "./Profile";
import api from "./lib/api";
import { normalizeAnnouncement } from "./lib/normalizeAnnouncement";

const navigation = [
  ["dashboard", "Dashboard", Grid2X2], ["reports", "Reports", FileText], ["announcements", "Announcements", Megaphone], ["analytics", "Analytics", BarChart3], ["profile", "Profile", Users],
];
const reportRows = [
  { id: "#REP-1024", title: "Broken Elevator", place: "DPT Block B, Level 4", category: "Electrical", time: "Today · 10:24 AM", priority: "Urgent", status: "Pending", tone: "red" },
  { id: "#REP-1023", title: "Water Leak - Ceiling", place: "Science Lab 302, North Wing", category: "Plumbing", time: "Today · 09:15 AM", priority: "Normal", status: "In Progress", tone: "blue" },
  { id: "#REP-1021", title: "HVAC Filter Replacement", place: "Auditorium Main Hall", category: "AC/Heat", time: "Yesterday · 04:45 PM", priority: "Normal", status: "Resolved", tone: "green" },
];

function ActionButton({ children, secondary = false, onClick }) { return <button onClick={onClick} className={`admin-action ${secondary ? "admin-action-secondary" : ""}`}>{children}</button>; }
function Badge({ children, tone = "slate" }) { return <span className={`admin-badge admin-badge-${tone}`}>{children}</span>; }
function Status({ children }) { const tone = children === "Pending" ? "red" : children === "In Progress" ? "blue" : "green"; return <span className={`admin-status admin-status-${tone}`}><i />{children}</span>; }

function AdminSidebar({ page, onPage }) { return <aside className="admin-sidebar"><div className="admin-sidebar-brand"><span><Grid2X2 /></span><b>AdminPanel</b></div><nav>{navigation.map(([key, label, Icon]) => <button key={key} onClick={() => onPage(key)} className={page === key ? "active" : ""}><Icon />{label}</button>)}</nav><div className="admin-user"><span>AS</span><div><b>Admin User</b><small>Facilities Lead</small></div></div></aside>; }
function AdminHeader({ title, subtitle, children }) { return <header className="admin-header"><div><h1>{title}</h1><p>{subtitle}</p></div><div className="admin-header-actions">{children}</div></header>; }
function StatCard({ label, value, detail, tone = "green" }) { return <article className="admin-stat"><span>{label}</span><div><b>{value}</b>{detail && <Badge tone={tone}>{detail}</Badge>}</div></article>; }

const PALETTE = ["#ad0921", "#f78c00", "#367cf1", "#15b985", "#94a3b8", "#a855f7", "#eab308"];

function LiveCategoryChart({ rows }) {
  const counts = {};
  rows.forEach((row) => { counts[row.category] = (counts[row.category] || 0) + 1; });
  const entries = Object.entries(counts);
  const max = Math.max(...entries.map(([, count]) => count), 1);

  return <section className="admin-card admin-chart">
    <div className="admin-card-title"><h2>Reports by Category</h2></div>
    {entries.length === 0
      ? <p className="admin-empty-note">No reports yet.</p>
      : <div className="admin-bars">{entries.map(([label, count], index) => <div key={label}><span style={{ height: `${(count / max) * 100}%`, background: PALETTE[index % PALETTE.length] }} /><b>{label}</b></div>)}</div>}
  </section>;
}

function MaintenanceTable({ rows, onOpenReport }) {
  return <section className="admin-card admin-table-card"><div className="admin-card-title"><h2>Recent Maintenance Activity</h2></div><div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Report ID</th><th>Facility / Location</th><th>Category</th><th>Reported At</th><th>Status</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} onClick={() => onOpenReport?.(row.rawId)} className={onOpenReport ? "admin-row-clickable" : ""}><td><b>{row.id}</b></td><td><b>{row.title}</b><small>{row.place}</small></td><td><Badge tone={row.tone}>{row.category}</Badge></td><td>{row.time}</td><td><Status>{row.status}</Status></td></tr>)}</tbody></table></div></section>;
}

function LiveTrendChart({ trend }) {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().slice(0, 10));
  }
  const counts = days.map((day) => trend.find((point) => point.date === day)?.count || 0);
  const max = Math.max(...counts, 1);
  const points = counts.map((count, index) => `${(index / (days.length - 1)) * 100},${100 - (count / max) * 90}`).join(" ");

  return <section className="admin-card admin-trend">
    <div className="admin-card-title"><h2>Reports Submitted (Last 30 Days)</h2></div>
    {counts.every((c) => c === 0)
      ? <p className="admin-empty-note">No reports submitted in the last 30 days yet.</p>
      : <svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points={points} fill="none" stroke="#ad0921" strokeWidth=".7" vectorEffect="non-scaling-stroke" /></svg>}
  </section>;
}

function LiveDonutChart({ byCategory }) {
  const total = byCategory.reduce((sum, item) => sum + item.count, 0);
  if (!total) return <section className="admin-card admin-donut"><h2>Category Distribution</h2><p className="admin-empty-note">No reports yet.</p></section>;
  return <section className="admin-card admin-donut">
    <h2>Category Distribution</h2>
    <div className="admin-donut-ring" />
    <ul>{byCategory.map((item, index) => <li key={item.category}><i className="admin-dot" style={{ background: PALETTE[index % PALETTE.length] }} />{item.category}<span>{Math.round((item.count / total) * 100)}%</span></li>)}</ul>
  </section>;
}

const STATUS_DISPLAY = { submitted: "Pending", in_progress: "In Progress", resolved: "Resolved" };

function formatTimestamp(value) {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) return typeof value === "string" ? value : null;
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function userReportRows(reports) {
  if (!reports?.length) return reportRows;
  return reports.map((report) => {
    const lower = `${report.title} ${report.description || ""}`.toLowerCase();
    const category = report.category || (lower.includes("water") || lower.includes("pipe") ? "Plumbing" : lower.includes("air") || lower.includes("ac ") ? "AC/Heat" : lower.includes("light") || lower.includes("electr") ? "Electrical" : "Furniture");
    const status = STATUS_DISPLAY[report.status] || "Pending";
    return {
      id: `#REP-${1000 + report.id}`,
      rawId: report.id,
      rawStatus: report.status,
      assignedTo: report.assignedTo,
      title: report.title,
      place: report.location,
      room: report.room,
      description: report.description,
      photoUri: report.photoUri,
      category,
      submittedAt: report.createdAt,
      inProgressAt: report.inProgressAt,
      resolvedAt: report.resolvedAt,
      time: formatTimestamp(report.createdAt) || "Today",
      priority: status === "Pending" ? "Urgent" : "Normal",
      status,
      tone: status === "Resolved" ? "green" : status === "In Progress" ? "blue" : "red",
    };
  });
}

function ReportDetailModal({ report, onClose, onUpdateStatus, onUpdateAssignment }) {
  const [assignedTo, setAssignedTo] = useState(report?.assignedTo || "");
  const [localStatus, setLocalStatus] = useState(report?.rawStatus);

  useEffect(() => {
    if (report) {
      setAssignedTo(report.assignedTo || "");
      setLocalStatus(report.rawStatus);
    }
  }, [report]);

  if (!report) return null;

  const advance = () => {
    const next = localStatus === "submitted" ? "in_progress" : "resolved";
    onUpdateStatus?.(report.rawId, next);
    setLocalStatus(next);
  };

  const saveAssignment = () => {
    if (assignedTo !== (report.assignedTo || "")) onUpdateAssignment?.(report.rawId, assignedTo);
  };

  const cancelAssignment = () => {
    setAssignedTo(report.assignedTo || "");
  };

  const assignmentChanged = assignedTo !== (report.assignedTo || "");

  return <div className="admin-modal-overlay" onClick={onClose}>
    <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
      <button className="admin-modal-close" onClick={onClose} aria-label="Close"><X /></button>
      <p className="admin-modal-id">{report.id}</p>
      <h2>{report.title}</h2>
      <p className="admin-modal-place">{report.place}{report.room ? ` · Room ${report.room}` : ""}</p>
      <div className="admin-modal-meta">
        <Badge tone={report.tone}>{report.category}</Badge>
        <Badge tone={report.priority === "Urgent" ? "red" : "blue"}>{report.priority}</Badge>
      </div>
      {report.photoUri && <img src={report.photoUri} alt="Reported issue" className="admin-modal-photo" />}
      <p className="admin-modal-description">{report.description}</p>

      <div className="admin-modal-timeline">
        <div className={`admin-timeline-step ${localStatus ? "done" : ""}`}>
          <i /><div><b>Submitted</b><small>{formatTimestamp(report.submittedAt) || "—"}</small></div>
        </div>
        <div className={`admin-timeline-step ${localStatus === "in_progress" || localStatus === "resolved" ? "done" : ""}`}>
          <i /><div><b>In Progress</b><small>{formatTimestamp(report.inProgressAt) || "—"}{assignedTo ? ` · Assigned to ${assignedTo}` : ""}</small></div>
        </div>
        <div className={`admin-timeline-step ${localStatus === "resolved" ? "done" : ""}`}>
          <i /><div><b>Resolved</b><small>{formatTimestamp(report.resolvedAt) || "—"}</small></div>
        </div>
      </div>

      <div className="admin-modal-actions">
        <label className="admin-modal-field">
          <span>Assigned To</span>
          <input
            type="text"
            value={assignedTo}
            onChange={(event) => setAssignedTo(event.target.value)}
            placeholder="Type a name..."
            className="admin-assign-input"
          />
        </label>
        {assignmentChanged && <div className="admin-modal-buttons">
          <button type="button" className="admin-action admin-action-secondary" onClick={cancelAssignment}>Cancel</button>
          <button type="button" className="admin-action" onClick={saveAssignment}>Save Assignment</button>
        </div>}
      </div>

      {localStatus !== "resolved" && <button type="button" className="admin-action admin-advance-button" onClick={advance}>
        {localStatus === "submitted" ? "Mark as In Progress" : "Mark as Resolved"}
      </button>}
    </div>
  </div>;
}

function LiveDashboardPage({ reports, onPage, onOpenReport }) {
  const rows = userReportRows(reports);
  const pending = rows.filter((row) => row.status === "Pending").length;
  const active = rows.filter((row) => row.status === "In Progress").length;
  const resolved = rows.filter((row) => row.status === "Resolved").length;
  return <><AdminHeader title="Facilities Overview" subtitle="Live overview of reports submitted by UM FixHub users.">
    <ActionButton onClick={() => onPage("reports")}><Plus />View All Reports</ActionButton></AdminHeader><div className="admin-content"><div className="admin-stats"><StatCard label="Total Reports" value={rows.length} detail="Live data" /><StatCard label="Pending" value={pending} detail={pending ? "Needs attention" : "All clear"} tone="red" /><StatCard label="In Progress" value={active} detail="Active work" /><StatCard label="Resolved" value={resolved} detail={`${rows.length ? Math.round((resolved / rows.length) * 100) : 0}% Rate`} /></div><div className="admin-dashboard-grid"><section><div className="admin-section-heading"><h2>🚨 High Priority Alerts</h2><button onClick={() => onPage("reports")}>View All</button></div><div className="admin-alerts">{rows.filter((row) => row.status !== "Resolved").slice(0, 3).map((row) => <article key={row.id} className={`admin-alert ${row.tone === "blue" ? "blue" : ""}`} onClick={() => onOpenReport(row.rawId)} style={{ cursor: "pointer" }}><span>{row.tone === "blue" ? <BellRing /> : <XCircle />}</span><div><b>{row.title}</b><p>{row.place}</p></div><aside><Badge tone={row.tone}>{row.priority}</Badge><small>{row.time}</small></aside></article>)}</div></section><LiveCategoryChart rows={rows} /></div><MaintenanceTable rows={rows.slice(0, 5)} onOpenReport={onOpenReport} /></div></>;
}

function LiveReportsPage({ reports, onOpenReport }) {
  const [query, setQuery] = useState("");
  const rows = userReportRows(reports);
  const filtered = rows.filter((report) => `${report.id} ${report.title} ${report.place}`.toLowerCase().includes(query.toLowerCase()));
  return <><AdminHeader title="All Facility Reports" subtitle="Live maintenance reports submitted by UM FixHub users. Click a row to view and manage."></AdminHeader><div className="admin-content"><section className="admin-filterbar"><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reports by ID, location or keyword..." /></label><button>All Categories <ChevronDown /></button><button>All Status <ChevronDown /></button></section><MaintenanceTable rows={filtered} onOpenReport={onOpenReport} /><p className="admin-pagination-note">Showing {filtered.length} of {rows.length} user reports</p></div></>;
}

function LiveAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/analytics")
      .then(({ data }) => setAnalytics(data))
      .catch(() => setError("Could not load analytics."));
  }, []);

  if (error) return <><AdminHeader title="Analytics Overview" subtitle="Metrics calculated from your reports." /><div className="admin-content"><p className="admin-empty-note">{error}</p></div></>;
  if (!analytics) return <><AdminHeader title="Analytics Overview" subtitle="Metrics calculated from your reports." /><div className="admin-content"><p className="admin-empty-note">Loading analytics...</p></div></>;

  return <><AdminHeader title="Analytics Overview" subtitle="Metrics calculated from your reports."><ActionButton secondary onClick={() => api.get("/analytics").then(({ data }) => setAnalytics(data))}><Download />Refresh</ActionButton></AdminHeader><div className="admin-content"><div className="admin-stats"><StatCard label="Total Reports" value={analytics.total} detail="Live" /><StatCard label="Resolved" value={analytics.resolved} detail={`${analytics.resolution_rate}% resolved`} /><StatCard label="In Progress" value={analytics.in_progress} detail="Active work" tone="blue" /><StatCard label="Pending" value={analytics.pending} detail="Needs attention" tone="red" /></div><div className="admin-analytics-grid"><LiveTrendChart trend={analytics.trend} /><LiveDonutChart byCategory={analytics.by_category} /></div></div></>;
}

function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    api.get("/announcements")
      .then(({ data }) => setAnnouncements(data.map(normalizeAnnouncement)))
      .catch(() => setError("Could not load announcements."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/announcements", { title, message });
      setTitle("");
      setMessage("");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not post announcement.");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements((items) => items.filter((item) => item.id !== id));
    } catch {
      setError("Could not delete announcement.");
    }
  };

  return <><AdminHeader title="Announcements" subtitle="Post campus-wide updates that students see on their dashboard." /><div className="admin-content">
    <section className="admin-card">
      <div className="admin-card-title"><h2>New Announcement</h2></div>
      <form onSubmit={submit} className="admin-announcement-form">
        <label className="admin-modal-field"><span>Title</span>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Water Main Repairs — North Dorms" className="admin-assign-input" />
        </label>
        <label className="admin-modal-field"><span>Message</span>
          <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Details students should know..." className="admin-assign-input admin-announcement-textarea" />
        </label>
        {error && <p className="admin-announcement-error">{error}</p>}
        <button type="submit" disabled={submitting} className="admin-action">{submitting ? "Posting..." : "Post Announcement"}</button>
      </form>
    </section>

    <section className="admin-card">
      <div className="admin-card-title"><h2>Posted Announcements</h2></div>
      {loading
        ? <p className="admin-empty-note">Loading...</p>
        : announcements.length === 0
          ? <p className="admin-empty-note">No announcements posted yet.</p>
          : <div className="admin-announcement-list">{announcements.map((item) => <div key={item.id} className="admin-announcement-item">
            <div><b>{item.title}</b><p>{item.body}</p><small>{item.date}</small></div>
            <button onClick={() => remove(item.id)} aria-label="Delete announcement" className="admin-icon-button"><Trash2 /></button>
          </div>)}</div>}
    </section>
  </div></>;
}

export default function AdminPanel({ reports, user, onUpdateStatus, onUpdateAssignment, onUserUpdate, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [selectedReportId, setSelectedReportId] = useState(null);

  const rows = userReportRows(reports);
  const selectedReport = selectedReportId ? rows.find((row) => row.rawId === selectedReportId) : null;

  const pageComponent = {
    dashboard: <LiveDashboardPage reports={reports} onPage={setPage} onOpenReport={setSelectedReportId} />,
    reports: <LiveReportsPage reports={reports} onOpenReport={setSelectedReportId} />,
    announcements: <AnnouncementsPage />,
    analytics: <LiveAnalyticsPage />,
    profile: <div className="admin-profile-page"><Profile user={user} reports={reports} onLogout={onLogout} onUserUpdate={onUserUpdate} accountType="Administrator" /></div>,
  }[page];

  return <div className="admin-app">
    <AdminSidebar page={page} onPage={setPage} />
    <main className="admin-main">{pageComponent}</main>
    <ReportDetailModal
      report={selectedReport}
      onClose={() => setSelectedReportId(null)}
      onUpdateStatus={onUpdateStatus}
      onUpdateAssignment={onUpdateAssignment}
    />
  </div>;
}