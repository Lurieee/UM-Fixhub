import { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import HeroCard from "./HeroCard";
import RecentReports from "./RecentReports";
import CampusUpdates from "./CampusUpdates";
import ActivityCard from "./ActivityCard";
import EmergencyCard from "./EmergencyCard";
import ReportIssue from "./ReportIssue";
import MyReports from "./MyReports";
import ReportDetail from "./ReportDetail";
import Profile from "./Profile";
import IssueCategories from "./IssueCategories";
import SubmissionConfirmation from "./SubmissionConfirmation";
import AdminPanel from "./AdminPanel";
import { currentUser } from "./mockData";
import api from "./lib/api";
import { normalizeReport, denormalizeStatus } from "./lib/normalizeReport";
import { normalizeAnnouncement } from "./lib/normalizeAnnouncement";
import { LandingPage, LoginPage, SignUpPage } from "./AuthPages";

const PROTECTED_ROUTES = ["dashboard", "categories", "report", "editReport", "submitted", "reports", "reportDetail", "updates", "profile", "admin"];

function parseRoute(path) {
  if (path === "/" || path === "/welcome") return { name: "landing" };
  if (path === "/login") return { name: "login" };
  if (path === "/signup") return { name: "signup" };
  if (path === "/dashboard") return { name: "dashboard" };
  if (path === "/report-issue") return { name: "categories" };
  if (path === "/report-issue/form") return { name: "report" };
  if (path === "/report-submitted") return { name: "submitted" };
  if (path === "/my-reports") return { name: "reports" };
  if (path === "/updates") return { name: "updates" };
  if (path === "/profile") return { name: "profile" };
  if (path === "/admin") return { name: "admin" };

  const editMatch = path.match(/^\/my-reports\/(\d+)\/edit$/);
  if (editMatch) return { name: "editReport", id: Number(editMatch[1]) };

  const match = path.match(/^\/my-reports\/(\d+)$/);
  return match ? { name: "reportDetail", id: Number(match[1]) } : { name: "landing" };
}

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));
  const [reports, setReports] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [lastSubmittedReport, setLastSubmittedReport] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem("um-fixhub-user")) || currentUser;
    } catch {
      return currentUser;
    }
  });
  const [updates, setUpdates] = useState([]);
  const [readNoticeIds, setReadNoticeIds] = useState([]);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setRoute(parseRoute(path));
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Route protection: redirect to /login if a protected route is visited without a token,
  // and redirect non-admins away from /admin.
  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (PROTECTED_ROUTES.includes(route.name) && !token) {
      navigate("/login");
      return;
    }

    if (route.name === "admin" && token && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [route.name]);

  // Fetch real reports and announcements from the backend whenever we're logged in (token exists)
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) return;

    api.get("/reports")
      .then(({ data }) => setReports(data.map(normalizeReport)))
      .catch((err) => console.error("Failed to load reports:", err));

    api.get("/announcements")
      .then(({ data }) => setUpdates(data.map(normalizeAnnouncement)))
      .catch((err) => console.error("Failed to load announcements:", err));
  }, [route.name]); // refetch on navigation so new reports/announcements show up elsewhere too

  const activeKey = useMemo(() => {
    if (["categories", "report", "editReport", "submitted"].includes(route.name)) return "report";
    if (route.name === "dashboard") return "dashboard";
    if (route.name === "updates") return "updates";
    return "reports";
  }, [route.name]);

  const selectCategory = (category) => {
    setSelectedCategory(category);
    navigate("/report-issue/form");
  };

  // ReportIssue already posts to the API itself and calls onSubmit with the raw response
  const submitReport = (apiReport) => {
    const normalized = normalizeReport(apiReport);
    setReports((items) => [normalized, ...items]);
    setLastSubmittedReport(normalized);
    navigate("/report-submitted");
  };

  const updateReport = async (id, status) => {
    try {
      const { data } = await api.patch(`/reports/${id}`, { status: denormalizeStatus(status) });
      setReports((items) => items.map((item) => (item.id === id ? normalizeReport(data) : item)));
    } catch (err) {
      console.error("Failed to update report:", err);
    }
  };

  const updateAssignment = async (id, assignedTo) => {
    try {
      const { data } = await api.patch(`/reports/${id}`, { assigned_to: assignedTo });
      setReports((items) => items.map((item) => (item.id === id ? normalizeReport(data) : item)));
    } catch (err) {
      console.error("Failed to update assignment:", err);
    }
  };

  const deleteReport = (id) => {
    // No DELETE endpoint on the backend by design — this only removes it from the local view.
    setReports((items) => items.filter((item) => item.id !== id));
  };

  const saveUser = (nextUser) => {
    setUser(nextUser);
    window.localStorage.setItem("um-fixhub-user", JSON.stringify(nextUser));
  };

  const markNoticeAsRead = (noticeId) => {
    setReadNoticeIds((ids) => (ids.includes(noticeId) ? ids : [...ids, noticeId]));
  };

  const logout = (path) => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("um-fixhub-user");
    navigate(path);
  };

  const unreadNoticeCount = updates.filter((notice) => !readNoticeIds.includes(notice.id)).length;

  if (route.name === "landing") return <LandingPage onNavigate={navigate} />;
  if (route.name === "login") return <LoginPage onNavigate={navigate} onLogin={(loggedInUser) => {
    saveUser(loggedInUser);
    navigate(loggedInUser.role === "admin" ? "/admin" : "/dashboard");
  }} />;
  if (route.name === "signup") return <SignUpPage onNavigate={navigate} onSignup={(newUser) => {
    saveUser(newUser);
    navigate(newUser.role === "admin" ? "/admin" : "/dashboard");
  }} />;
  if (route.name === "admin") return <AdminPanel reports={reports} user={user} onUpdateStatus={updateReport} onUpdateAssignment={updateAssignment} onUserUpdate={saveUser} onLogout={() => logout("/login")} />;

  return <div className="min-h-screen bg-[#f5f7fb] text-slate-900 lg:flex">
    <Navbar activeKey={activeKey} user={user} unreadNoticeCount={unreadNoticeCount} onNavigate={navigate} />
    <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
      {route.name === "dashboard" && <Dashboard reports={reports} updates={updates} readNoticeIds={readNoticeIds} onRead={markNoticeAsRead} onNavigate={navigate} />}
      {route.name === "categories" && <IssueCategories onBack={() => navigate("/dashboard")} onSelect={selectCategory} />}
      {route.name === "report" && <ReportIssue category={selectedCategory} onBack={() => navigate("/report-issue")} onSubmit={submitReport} />}
      {route.name === "editReport" && <ReportIssue report={reports.find((report) => report.id === route.id)} onBack={() => navigate("/my-reports")} onSubmit={submitReport} />}
      {route.name === "submitted" && <SubmissionConfirmation report={lastSubmittedReport} onDashboard={() => navigate("/dashboard")} onTrack={() => navigate("/my-reports")} />}
      {route.name === "reports" && <MyReports reports={reports} onNavigate={navigate} onDelete={deleteReport} />}
      {route.name === "reportDetail" && <ReportDetail report={reports.find((report) => report.id === route.id)} onBack={() => navigate("/my-reports")} />}
      {route.name === "updates" && <div className="mx-auto max-w-xl"><CampusUpdates updates={updates} showAll readNoticeIds={readNoticeIds} onRead={markNoticeAsRead} /></div>}
      {route.name === "profile" && <Profile user={user} reports={reports} onLogout={() => logout("/login")} onUserUpdate={saveUser} />}
    </main>
  </div>;
}

function Dashboard({ reports, updates, readNoticeIds, onRead, onNavigate }) {
  return <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 lg:grid-cols-3">
    <div className="space-y-8 lg:col-span-2"><HeroCard onNavigate={onNavigate} /><RecentReports reports={reports.slice(0, 3)} onNavigate={onNavigate} /></div>
    <div className="space-y-6"><CampusUpdates updates={updates} readNoticeIds={readNoticeIds} onRead={onRead} onViewAll={() => onNavigate("/updates")} /><ActivityCard reports={reports} /><EmergencyCard /></div>
  </div>;
}