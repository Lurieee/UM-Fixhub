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
import { LandingPage, LoginPage, SignUpPage } from "./AuthPages";
import IssueCategories from "./IssueCategories";
import SubmissionConfirmation from "./SubmissionConfirmation";
import { activityStats, campusUpdates, currentUser, recentReports as initialReports } from "./mockData";

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

  const editMatch = path.match(/^\/my-reports\/(\d+)\/edit$/);
  if (editMatch) return { name: "editReport", id: Number(editMatch[1]) };

  const match = path.match(/^\/my-reports\/(\d+)$/);
  return match ? { name: "reportDetail", id: Number(match[1]) } : { name: "landing" };
}

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));
  const [reports, setReports] = useState(initialReports);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem("um-fixhub-user")) || currentUser;
    } catch {
      return currentUser;
    }
  });
  const [updates, setUpdates] = useState(campusUpdates);
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

  useEffect(() => {
    const handleAdminNotice = (event) => {
      const notice = event.detail;
      if (!notice?.id || !notice.title || !notice.body) return;
      setUpdates((items) => [notice, ...items.filter((item) => item.id !== notice.id)]);
    };
    window.addEventListener("fixhub:new-notice", handleAdminNotice);
    return () => window.removeEventListener("fixhub:new-notice", handleAdminNotice);
  }, []);

  const activeKey = useMemo(() => {
    if (["categories", "report", "editReport", "submitted"].includes(route.name)) return "report";
    if (route.name === "dashboard") return "dashboard";
    if (route.name === "updates") return "updates";
    return "reports";
  }, [route.name]);

  const submitReport = (report) => {
    setReports((items) => [report, ...items]);
    navigate("/report-submitted");
  };

  const updateReport = (id, status) => {
    setReports((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const deleteReport = (id) => {
    setReports((items) => items.filter((item) => item.id !== id));
  };

  const saveUser = (nextUser) => {
    setUser(nextUser);
    window.localStorage.setItem("um-fixhub-user", JSON.stringify(nextUser));
  };

  const restoreUser = () => {
    try {
      const savedUser = JSON.parse(window.localStorage.getItem("um-fixhub-user"));
      if (savedUser) setUser(savedUser);
    } catch {
      // The default user remains in place when no saved account is available.
    }
  };

  const markNoticeAsRead = (noticeId) => {
    setReadNoticeIds((ids) => (ids.includes(noticeId) ? ids : [...ids, noticeId]));
  };

  const unreadNoticeCount = updates.filter((notice) => !readNoticeIds.includes(notice.id)).length;

  if (route.name === "landing") return <LandingPage onNavigate={navigate} />;
  if (route.name === "login") return <LoginPage onNavigate={navigate} onLogin={restoreUser} />;
  if (route.name === "signup") return <SignUpPage onNavigate={navigate} onSignup={saveUser} />;

  return <div className="min-h-screen bg-[#f5f7fb] text-slate-900 lg:flex">
    <Navbar activeKey={activeKey} user={user} unreadNoticeCount={unreadNoticeCount} onNavigate={navigate} />
    <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
      {route.name === "dashboard" && <Dashboard reports={reports} updates={updates} readNoticeIds={readNoticeIds} onRead={markNoticeAsRead} onNavigate={navigate} />}
      {route.name === "categories" && <IssueCategories onBack={() => navigate("/dashboard")} onSelect={() => navigate("/report-issue/form")} />}
      {route.name === "report" && <ReportIssue onBack={() => navigate("/report-issue")} onSubmit={submitReport} />}
      {route.name === "editReport" && <ReportIssue report={reports.find((report) => report.id === route.id)} onBack={() => navigate("/my-reports")} onSubmit={(updatedReport) => { setReports((items) => items.map((report) => report.id === updatedReport.id ? updatedReport : report)); navigate("/my-reports"); }} />}
      {route.name === "submitted" && <SubmissionConfirmation onDashboard={() => navigate("/dashboard")} onTrack={() => navigate("/my-reports")} />}
      {route.name === "reports" && <MyReports reports={reports} onNavigate={navigate} onDelete={deleteReport} />}
      {route.name === "reportDetail" && <ReportDetail report={reports.find((report) => report.id === route.id)} onBack={() => navigate("/my-reports")} onUpdate={updateReport} />}
      {route.name === "updates" && <div className="mx-auto max-w-xl"><CampusUpdates updates={updates} showAll readNoticeIds={readNoticeIds} onRead={markNoticeAsRead} /></div>}
      {route.name === "profile" && <Profile user={user} reports={reports} onLogout={() => navigate("/login")} />}
    </main>
  </div>;
}

function Dashboard({ reports, updates, readNoticeIds, onRead, onNavigate }) {
  return <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 lg:grid-cols-3">
    <div className="space-y-8 lg:col-span-2"><HeroCard onNavigate={onNavigate} /><RecentReports reports={reports.slice(0, 3)} onNavigate={onNavigate} /></div>
    <div className="space-y-6"><CampusUpdates updates={updates} readNoticeIds={readNoticeIds} onRead={onRead} onViewAll={() => onNavigate("/updates")} /><ActivityCard stats={activityStats} /><EmergencyCard /></div>
  </div>;
}
