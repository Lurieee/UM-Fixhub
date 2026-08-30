import { useRef, useState } from "react";
import { ArrowLeft, Armchair, Building2, Camera, Send } from "lucide-react";

export default function ReportIssue({ onBack, onSubmit, report: existingReport }) {
  const [location, setLocation] = useState(existingReport?.location || "");
  const [room, setRoom] = useState(existingReport?.room || "");
  const [description, setDescription] = useState(existingReport?.description || "");
  const [urgency, setUrgency] = useState(existingReport?.urgency || "medium");
  const [photoName, setPhotoName] = useState("");
  const photoInputRef = useRef(null);
  const submit = (event) => {
    event.preventDefault();
    const submittedAt = existingReport?.submittedAt || Date.now();
    onSubmit({ ...existingReport, id: existingReport?.id || submittedAt, title: description.split("\n")[0] || "New Report", location: location || "Unknown", room, icon: existingReport?.icon || "wrench", status: existingReport?.status || "submitted", description, urgency, createdAt: existingReport?.createdAt || "Just now", submittedAt });
  };
  return <section className="mx-auto max-w-[650px] rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
    <div className="mb-8 flex items-center gap-3"><button onClick={onBack} aria-label="Back" className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#b40012]"><ArrowLeft className="h-5 w-5" /></button><div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step 2 of 2</p><h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{existingReport ? "Edit report" : "Report an issue"}</h1></div></div>
    <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50/70 p-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-[#b40012]"><Armchair /></span><p><small className="block text-[10px] font-bold uppercase tracking-widest text-[#b40012]">Issue category</small><b className="text-slate-800">Furniture</b></p><button type="button" onClick={onBack} className="ml-auto text-sm font-bold text-[#b40012]">Change</button></div>
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-3"><label className="text-sm font-bold sm:col-span-2">Where is the issue?<span className="relative mt-2 block"><Building2 className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" /><input required value={location} onChange={(event) => setLocation(event.target.value)} placeholder="PS Building" className="w-full rounded-xl border border-slate-200 py-3 pl-10 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50" /></span></label><label className="text-sm font-bold">Room No.<input value={room} onChange={(event) => setRoom(event.target.value)} placeholder="302" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-center outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50" /></label></div>
      <div className="text-sm font-bold">Add a photo<input ref={photoInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={(event) => setPhotoName(event.target.files?.[0]?.name || "")} /><button type="button" onClick={() => photoInputRef.current?.click()} className="mt-2 flex min-h-36 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-200 bg-red-50/30 px-4 text-center text-[#b40012] hover:border-[#b40012] hover:bg-red-50"><Camera className="mb-3 h-7 w-7" /><b>{photoName || "Take a photo or upload one"}</b><small className="mt-1 text-slate-400">{photoName ? "Photo selected — click to choose another" : "JPEG or PNG, up to 10MB"}</small></button></div>
      <label className="block text-sm font-bold">Describe the issue<textarea required value={description} onChange={(event) => setDescription(event.target.value)} rows={5} className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-4 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50" placeholder="Describe the problem so our maintenance team can help." /></label>
      <div><p className="mb-2 text-sm font-bold">Urgency level</p><div className="grid grid-cols-3 rounded-xl bg-slate-100 p-1.5">{[["low", "Low"], ["medium", "Medium"], ["high", "High"]].map(([key, label]) => <button type="button" key={key} onClick={() => setUrgency(key)} className={`rounded-lg py-3 text-sm font-bold ${urgency === key ? "bg-[#b40012] text-white shadow" : "text-slate-500"}`}>{label}</button>)}</div></div>
      <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#b40012] py-4 text-lg font-extrabold text-white shadow-lg shadow-red-900/15"><Send className="h-5 w-5" />{existingReport ? "Save changes" : "Submit report"}</button>
    </form>
  </section>;
}
