import { MapPin } from "lucide-react";
import Icon from "./Icon";
import { statusStyles } from "./mockData";

export default function RecentReports({ reports, onNavigate }) {
  return <section className="flex flex-1 flex-col">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-extrabold">Your Recent Reports</h2>
      <button onClick={() => onNavigate("/my-reports")} className="text-sm font-bold text-[#b40012]">View All Reports</button>
    </div>
    <div className="flex-1 divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-sm">
      {reports.length === 0 && <p className="p-8 text-center text-sm text-slate-400">No reports yet. Submit one to see it here.</p>}
      {reports.map((r) => {
        const s = statusStyles[r.status] || statusStyles.submitted;
        return <a key={r.id} href={"/my-reports/" + r.id} onClick={(e) => { e.preventDefault(); onNavigate("/my-reports/" + r.id); }} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50">
          <div className="flex min-w-0 items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-orange-100"><Icon name={r.icon} className="h-5 w-5 text-[#b40012]" /></span>
            <div className="min-w-0">
              <b className="block truncate">{r.title}</b>
              <p className="mt-1 flex gap-1 text-sm text-slate-500"><MapPin className="h-4 w-4 shrink-0" />{r.location}</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${s.bg} ${s.text}`}>{s.label}</span>
        </a>;
      })}
    </div>
  </section>;
}