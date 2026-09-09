export default function ActivityCard({ reports }) {
  const totalFixed = reports.filter((r) => r.status === "resolved").length;
  const active = reports.filter((r) => r.status === "in_progress").length;
  const total = reports.length;
  const campusSafetyScore = total ? Math.round((totalFixed / total) * 100) : 100;

  return <section className="bg-white rounded-2xl p-6 shadow-sm">
    <h2 className="text-lg font-extrabold">Your Activity</h2>
    <div className="grid grid-cols-2 gap-4 my-5">
      <div className="rounded-xl bg-slate-50 py-5 text-center"><b className="block text-3xl text-[#b40012]">{totalFixed}</b><small className="uppercase text-slate-400 font-bold">Total Fixed</small></div>
      <div className="rounded-xl bg-slate-50 py-5 text-center"><b className="block text-3xl text-orange-500">{active}</b><small className="uppercase text-slate-400 font-bold">Active</small></div>
    </div>
    <p className="text-sm">Your Resolution Rate <b className="float-right text-emerald-600">{campusSafetyScore}%</b></p>
    <div className="mt-2 h-2 rounded bg-slate-100"><span className="block h-full rounded bg-emerald-600" style={{ width: campusSafetyScore + "%" }} /></div>
  </section>;
}