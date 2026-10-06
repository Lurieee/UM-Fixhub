import { useState } from "react";
import { X } from "lucide-react";

const CONTACTS = [
  {
    category: "Fire Department",
    entries: [
      { name: "Davao City Central Fire Station", numbers: ["224-0524"] },
      { name: "S.I.R Fire Station", numbers: ["296-1779"] },
      { name: "Talomo Fire Station", numbers: ["297-2427", "222324"] },
      { name: "Davao Volunteers", numbers: ["226-4835"] },
      { name: "Bangoy", numbers: ["221-0221"] },
    ],
  },
  {
    category: "Police Station",
    entries: [
      { name: "Davao City Police Office", numbers: ["09258233276"] },
      { name: "Sta. Ana Police Station", numbers: ["233-4884", "09985987055"] },
      { name: "San Pedro Police Station", numbers: ["226-4835", "09985987057"] },
      { name: "PNP Camp Leonor (DCPO)", numbers: ["226-8911"] },
      { name: "Talomo Police Station", numbers: ["297-1598", "09194439634"] },
      { name: "DCPO - Technical Support (IED)", numbers: ["283-3769", "296-2359"] },
      { name: "Ecoland Police Station 15", numbers: ["09123611960"] },
    ],
  },
  {
    category: "Communication Response Center",
    entries: [
      { name: "Davao City Communication Response Center", numbers: ["911"] },
    ],
  },
  {
    category: "Hospitals",
    entries: [
      { name: "Davao Medical Hospital", numbers: ["227-2731"] },
      { name: "Davao Doctors Hospital", numbers: ["221-2101"] },
      { name: "Brokenshire Hospital", numbers: ["305-3170"] },
      { name: "San Pedro Hospital", numbers: ["222-6100"] },
    ],
  },
  {
    category: "Utilities & City Services",
    entries: [
      { name: "Davao City Water District", numbers: ["227-9400"] },
      { name: "Davao Light & Power Company", numbers: ["229-3572"] },
      { name: "City Disaster Office", numbers: ["295-2387"] },
      { name: "City Transport & Traffic Management", numbers: ["298-3602"] },
      { name: "Traffic Group", numbers: ["296-0771"] },
    ],
  },
];

function telHref(number) {
  return `tel:${number.replace(/[^\d]/g, "")}`;
}

export default function EmergencyCard() {
  const [open, setOpen] = useState(false);

  return <>
    <section className="rounded-2xl bg-slate-900 p-6 text-white">
      <h2 className="font-extrabold">Need immediate help?</h2>
      <p className="my-2 text-sm text-slate-400">For urgent security issues or building emergencies.</p>
      <a href="tel:911" className="block rounded-xl bg-[#b40012] py-3 text-center text-sm font-bold">Contact Emergency Services</a>
      <button type="button" onClick={() => setOpen(true)} className="mt-2 block w-full rounded-xl border border-white/15 py-3 text-center text-sm font-bold text-slate-200 hover:bg-white/5">View All Emergency Contacts</button>
    </section>

    {open && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" onMouseDown={() => setOpen(false)}>
      <article className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-5">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Emergency Contacts</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-1 text-xs text-slate-400">Davao City emergency and utility hotlines</p>

        <div className="mt-5 space-y-6">
          {CONTACTS.map((group) => (
            <div key={group.category}>
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#b40012]">{group.category}</h3>
              <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-100">
                {group.entries.map((entry) => (
                  <li key={entry.name} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                    <span className="text-slate-700">{entry.name}</span>
                    <span className="flex shrink-0 flex-wrap justify-end gap-x-2 gap-y-1">
                      {entry.numbers.map((number) => (
                        <a key={number} href={telHref(number)} className="font-bold text-[#b40012] hover:underline">{number}</a>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </article>
    </div>}
  </>;
}