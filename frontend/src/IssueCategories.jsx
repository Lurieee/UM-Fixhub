import { useState } from "react";
import { Armchair, ArrowLeft, Building2, Droplet, Search, Sparkles, Zap, CircleHelp } from "lucide-react";

const items = [
  [Zap, "Electrical", "Lights, outlets, power outages, and wiring issues."],
  [Droplet, "Plumbing", "Leaks, faucets, toilets, and water pressure problems."],
  [Armchair, "Furniture", "Desks, chairs, whiteboards, and storage repairs."],
  [Building2, "Infrastructure", "Walkways, doors, walls, and structural maintenance."],
  [Sparkles, "Cleanliness", "Spills, overflowing bins, and sanitation requests."],
  [CircleHelp, "Other", "Any different issue that doesn't fit the above."],
];

export default function IssueCategories({ onBack, onSelect }) {
  const [query, setQuery] = useState("");
  const filtered = items.filter(([, title, text]) => `${title} ${text}`.toLowerCase().includes(query.toLowerCase()));

  return <section className="mx-auto max-w-5xl">
    <header className="mb-9 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex items-center gap-3"><button onClick={onBack} aria-label="Back to dashboard" className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-[#b40012]"><ArrowLeft className="h-4 w-4" /></button><span><small className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">New request</small><b className="text-base">Maintenance report</b></span></div>
      <label className="relative w-full sm:w-auto"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-red-300 sm:w-56" placeholder="Search categories..." /></label>
    </header>
    <div className="text-center">
      <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#b40012]">Step 1 of 2</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">What needs attention?</h1>
      <p className="mt-2 text-slate-600">Choose the category that best matches the issue you found.</p>
      <div className="mt-9 grid gap-5 text-left md:grid-cols-3">
        {filtered.map(([Icon, title, text]) => <button key={title} onClick={() => onSelect(title)} className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-red-200 hover:shadow-md">
          <div className="flex justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-[#b40012]"><Icon className="h-6 w-6" /></span><span className="text-3xl text-slate-200 transition group-hover:text-[#b40012]">›</span></div>
          <h2 className="mt-5 text-lg font-extrabold">{title}</h2>
          <p className="mt-2 text-sm leading-5 text-slate-600">{text}</p>
        </button>)}
      </div>
      {filtered.length === 0 && <p className="mt-9 text-slate-400">No categories match "{query}".</p>}
      <p className="mt-10 text-sm text-slate-400">Can't find the right fit? Choose "Other" and tell us what you noticed.</p>
    </div>
  </section>;
}