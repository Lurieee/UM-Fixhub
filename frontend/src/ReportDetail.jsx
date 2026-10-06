import { ArrowLeft, MapPin, Paperclip, UserRound } from "lucide-react";
import Icon from "./Icon";

const STATUS_LABEL = { submitted: "Submitted", under_review: "Under Review", awaiting_confirmation: "Awaiting Confirmation", resolved: "Resolved" };
const STATUS_TONE = {
  submitted: "bg-slate-100 text-slate-600",
  under_review: "bg-blue-100 text-blue-600",
  awaiting_confirmation: "bg-orange-100 text-orange-600",
  resolved: "bg-emerald-100 text-emerald-700",
};

export default function ReportDetail({ report, onBack, onUpdateStatus }) {
  if (!report) return <p className="text-center text-slate-500">Report not found</p>;

  const statusKey = report.status || "submitted";

  const confirmResolve = () => {
    if (window.confirm("Confirm the issue has been fixed and close this report?")) {
      onUpdateStatus?.(report.id, "resolved");
    }
  };

  const confirmReopen = () => {
    if (window.confirm("Send this report back for more work? It will return to Under Review.")) {
      onUpdateStatus?.(report.id, "under_review");
    }
  };

  return <section className="mx-auto max-w-6xl">
    <header className="-mx-10 -mt-10 mb-7 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-7">
      <div className="flex items-center gap-3">
        <button onClick={onBack}><ArrowLeft className="h-6 w-6" /></button>
        <b className="text-lg">Report Detail</b>
        <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${STATUS_TONE[statusKey]}`}>{STATUS_LABEL[statusKey]}</span>
      </div>
    </header>
    <div className="grid gap-5 lg:grid-cols-[1.8fr_.85fr]">
      <div className="space-y-5">
        <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex justify-between border-b border-slate-100 pb-5">
            <div>
              <h1 className="text-3xl font-extrabold">{report.title}</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><MapPin className="h-4 w-4" />{report.location}{report.room ? ` · Room ${report.room}` : ""}</p>
            </div>
            <p className="text-right text-xs font-bold uppercase text-slate-400">Report ID<b className="mt-1 block text-base text-slate-900">#{report.id}</b></p>
          </div>
          <div className="grid gap-4 border-b border-slate-100 py-5 text-sm sm:grid-cols-3">
            <p><small className="block font-bold uppercase text-slate-400">Category</small><span className="mt-2 flex items-center gap-2 font-bold"><Icon name={report.icon} className="h-4 w-4 text-[#b40012]" />{report.category}</span></p>
            <p><small className="block font-bold uppercase text-slate-400">Date Submitted</small><b className="mt-2 block">{report.createdAt}</b></p>
            <p><small className="block font-bold uppercase text-slate-400">Urgency</small><b className="mt-2 block text-[#b40012]">● {report.urgency ? report.urgency.charAt(0).toUpperCase() + report.urgency.slice(1) : "Not set"}</b></p>
          </div>
          <h2 className="mt-7 text-sm font-extrabold uppercase">Description</h2>
          <p className="mt-3 leading-6 text-slate-600">{report.description}</p>
          <h2 className="mt-7 text-sm font-extrabold uppercase">Attached evidence</h2>
          <div className="mt-4 flex gap-3">
            {report.photoUri
              ? <img src={report.photoUri} alt="Reported issue" className="h-24 w-32 rounded-xl object-cover" />
              : <span className="grid h-24 w-32 place-items-center rounded-xl border-2 border-dashed border-slate-200 text-slate-400"><Paperclip /></span>}
          </div>
        </article>

        {statusKey === "awaiting_confirmation" && (
          <article className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
            <h2 className="text-sm font-extrabold text-orange-800">Facilities marked this as fixed</h2>
            <p className="mt-2 text-sm text-orange-700">Is the issue actually resolved? Confirm to close it, or send it back if it's not fixed yet.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={confirmResolve} className="rounded-xl bg-[#b40012] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#8c1022]">Confirm Fix &amp; Resolve</button>
              <button onClick={confirmReopen} className="rounded-xl border border-orange-300 bg-white px-5 py-3 text-sm font-extrabold text-orange-700 hover:bg-orange-100">Not Fixed — Reopen</button>
            </div>
          </article>
        )}
      </div>
      <aside className="space-y-5">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-extrabold uppercase">Tracking timeline</h2>
          <div className="mt-6 space-y-7 border-l-2 border-slate-200 pl-6 text-sm">
            <p className="relative font-bold before:absolute before:-left-[34px] before:grid before:h-7 before:w-7 before:place-items-center before:rounded-full before:bg-[#b40012] before:text-white before:content-['✓']">
              Report Submitted<small className="mt-1 block font-normal text-slate-400">{report.createdAt}</small>
            </p>
            <p className={["under_review", "awaiting_confirmation", "resolved"].includes(statusKey) ? "font-bold text-blue-600" : "text-slate-300"}>
              Under Review<small className="mt-1 block font-normal text-slate-400">{report.underReviewAt ? new Date(report.underReviewAt).toLocaleDateString([], { month: "short", day: "numeric" }) : "Not yet"}</small>
            </p>
            <p className={["awaiting_confirmation", "resolved"].includes(statusKey) ? "font-bold text-orange-500" : "text-slate-300"}>
              Awaiting Confirmation<small className="mt-1 block font-normal text-slate-400">{report.awaitingConfirmationAt ? new Date(report.awaitingConfirmationAt).toLocaleDateString([], { month: "short", day: "numeric" }) : "Not yet"}</small>
            </p>
            <p className={statusKey === "resolved" ? "font-bold text-emerald-600" : "text-slate-300"}>
              Resolved<small className="mt-1 block">{report.resolvedAt ? new Date(report.resolvedAt).toLocaleDateString([], { month: "short", day: "numeric" }) : "Pending"}</small>
            </p>
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-extrabold uppercase">Assigned to</h2>
          <p className="mt-5 flex items-center gap-3 font-bold"><span className="grid h-10 w-10 place-items-center rounded-full bg-slate-200"><UserRound className="h-5 w-5" /></span>{report.assignedTo || "Not yet assigned"}</p>
        </article>
      </aside>
    </div>
  </section>;
}