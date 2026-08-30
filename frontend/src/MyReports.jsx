import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, EllipsisVertical, MapPin, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Icon from "./Icon";
import { statusStyles } from "./mockData";

export default function MyReports({ reports, onNavigate, onDelete }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [notice, setNotice] = useState("");
  const list = useMemo(() => reports.filter((report) => (filter === "all" || report.status === filter) && report.title.toLowerCase().includes(query.toLowerCase())), [reports, filter, query]);

  const deleteReport = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    onDelete(id);
    setOpenMenu(null);
  };

  const toggleMenu = (report) => {
    setOpenMenu(openMenu === report.id ? null : report.id);
    if (!canEdit(report)) setNotice(editRestrictionMessage(report));
    else setNotice("");
  };

  return <section>
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="text-3xl font-extrabold">My Submitted Reports</h1><p className="mt-1 text-slate-500">Track and manage all your campus maintenance requests.</p></div>
      <button onClick={() => onNavigate("/report-issue")} className="w-full rounded-2xl bg-[#b40012] px-6 py-3.5 font-bold text-white shadow-lg shadow-red-900/15 sm:w-auto"><Plus className="mr-2 inline h-5 w-5" />New Report</button>
    </div>
    <div className="mb-9 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2">
      {["all", "in_progress", "resolved", "submitted"].map((key) => <button key={key} onClick={() => setFilter(key)} className={`rounded-xl px-5 py-2.5 text-sm font-bold ${filter === key ? "bg-[#b40012] text-white" : "text-slate-600"}`}>{key === "all" ? "All Reports" : key === "in_progress" ? "In Progress" : key === "resolved" ? "Resolved" : "Drafts"}</button>)}
      <label className="relative w-full sm:ml-auto sm:w-auto"><Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reports..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 text-sm outline-none focus:border-red-300 sm:w-56" /></label>
    </div>
    {notice && <div role="alert" className="mb-5 flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800"><span>{notice}</span><button onClick={() => setNotice("")} className="font-bold">Dismiss</button></div>}
    <div className="hidden grid-cols-[2.2fr_.85fr_.8fr_.85fr_40px] gap-4 px-5 pb-3 text-xs font-bold uppercase tracking-widest text-slate-400 md:grid"><span>Issue Details</span><span>Location</span><span>Date Submitted</span><span>Status</span></div>
    <div className="space-y-3">
      {list.map((report) => <ReportRow key={report.id} report={report} canEdit={canEdit(report)} isOpen={openMenu === report.id} onToggleMenu={() => toggleMenu(report)} onNavigate={onNavigate} onDelete={deleteReport} />)}
    </div>
    {!list.length && <p className="py-12 text-center text-slate-400">No reports match your search.</p>}
    <div className="mt-8 flex justify-end gap-2"><button type="button" disabled aria-label="Previous page" className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-400 disabled:cursor-not-allowed"><ChevronLeft className="h-5 w-5" /></button><button type="button" aria-current="page" className="grid h-10 w-10 place-items-center rounded-xl bg-[#b40012] text-sm font-bold text-white shadow-sm shadow-red-900/20">1</button><button type="button" disabled aria-label="Next page" className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-400 disabled:cursor-not-allowed"><ChevronRight className="h-5 w-5" /></button></div>
  </section>;
}

function ReportRow({ report, canEdit: editable, isOpen, onToggleMenu, onNavigate, onDelete }) {
  const style = statusStyles[report.status];
  return <a href={`/my-reports/${report.id}`} onClick={(event) => { event.preventDefault(); onNavigate(`/my-reports/${report.id}`); }} className="grid items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-3.5 shadow-sm md:grid-cols-[2.2fr_.85fr_.8fr_.85fr_40px]">
    <div className="flex min-w-0 items-center gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-orange-100"><Icon name={report.icon} className="h-5 w-5 text-[#b40012]" /></span><div className="min-w-0"><b>{report.title}</b><p className="mt-0.5 truncate text-sm text-slate-500">{report.description}</p></div></div>
    <p className="flex gap-1 text-sm"><MapPin className="h-4 w-4" />{report.location}</p>
    <time className="text-sm text-slate-400">{report.createdAt}</time>
    <span className={`w-fit rounded-full px-3 py-2 text-xs font-bold ${style.bg} ${style.text}`}>{style.label}</span>
    <div onClick={(event) => event.stopPropagation()}>
      <button type="button" aria-label="Report actions" onClick={(event) => { event.preventDefault(); onToggleMenu(); }} className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><EllipsisVertical className="h-5 w-5" /></button>
      {isOpen && <div className="mt-1 w-28 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
        <button type="button" disabled={!editable} onClick={(event) => { event.preventDefault(); event.stopPropagation(); onNavigate(`/my-reports/${report.id}/edit`); }} className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs font-semibold ${editable ? "text-slate-700 hover:bg-slate-50" : "cursor-not-allowed bg-slate-100 text-slate-400 shadow-inner"}`}><Pencil className="h-3.5 w-3.5" />Edit</button>
        <button type="button" onClick={(event) => onDelete(event, report.id)} className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" />Delete</button>
      </div>}
    </div>
  </a>;
}

function canEdit(report) {
  if (report.status !== "submitted") return false;
  const submittedAt = report.submittedAt || Date.parse(report.createdAt);
  return Number.isFinite(submittedAt) && Date.now() - submittedAt <= 10 * 60 * 1000;
}

function editRestrictionMessage(report) {
  if (report.status === "in_progress") return "This report can no longer be edited because maintenance is already in progress.";
  if (report.status === "resolved") return "This report can no longer be edited because it has already been resolved.";
  return "This report can no longer be edited because it was submitted more than 10 minutes ago.";
}
