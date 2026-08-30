import { useRef, useState } from "react";
import { BookOpen, CalendarDays, FileText, LogOut, Mail, MapPin, Pencil, ShieldCheck } from "lucide-react";

export default function Profile({ user, reports, onLogout }) {
  const [photoUrl, setPhotoUrl] = useState("");
  const fileInputRef = useRef(null);
  const resolved = reports.filter((report) => report.status === "resolved").length;

  const updatePhoto = (event) => {
    const [file] = event.target.files;
    if (file) setPhotoUrl(URL.createObjectURL(file));
  };

  return <section className="mx-auto max-w-5xl">
    <p className="text-sm font-bold uppercase tracking-widest text-[#b40012]">Student account</p>
    <h1 className="mt-2 text-3xl font-extrabold tracking-tight">My Profile</h1>
    <p className="mt-2 text-slate-600">Manage your account information and view your reporting activity.</p>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
      <article className="rounded-3xl bg-[#09090b] p-7 text-white shadow-xl shadow-black/20">
        <div className="mx-auto w-fit text-center">
          {photoUrl ? <img src={photoUrl} alt="Profile preview" className="h-28 w-28 rounded-full border-4 border-white/20 object-cover" /> : <span className="grid h-28 w-28 place-items-center rounded-full border-4 border-white/20 bg-gradient-to-br from-[#7f1022] via-[#b40012] to-slate-700 text-2xl font-extrabold">{user.initials}</span>}
          <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#c45b69] hover:text-white" title="Change profile photo">
            <Pencil className="h-3.5 w-3.5" />Edit
          </button>
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={updatePhoto} />
        </div>
        <h2 className="mt-5 text-2xl font-extrabold">{user.firstName} {user.lastName}</h2>
        <p className="mt-1 text-sm text-slate-300">Student · University of Mindanao</p>
        <div className="mt-7 space-y-4 border-t border-white/10 pt-6 text-sm text-slate-200">
          <p className="flex gap-3"><Mail className="h-5 w-5 text-[#b84052]" />{user.email}</p>
          <p className="flex gap-3"><BookOpen className="h-5 w-5 text-[#b84052]" />{user.program}</p>
          <p className="flex gap-3"><MapPin className="h-5 w-5 text-[#b84052]" />{user.campus}</p>
        </div>
        <button onClick={onLogout} className="mt-14 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-extrabold text-[#8c1022] hover:bg-[#7f1022] hover:text-white"><LogOut className="h-4 w-4" />Log out</button>
      </article>
      <div className="space-y-6">
        <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-lg font-extrabold">Account information</h2>
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <Info label="Student ID" value={user.studentId} />
            <Info label="Account type" value="Student" />
            <Info label="Campus" value={user.campus} />
            <Info label="Member since" value="August 2026" icon={CalendarDays} />
          </dl>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-lg font-extrabold">Your maintenance activity</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Stat icon={FileText} value={reports.length} label="Reports submitted" />
            <Stat icon={ShieldCheck} value={reports.filter((report) => report.status === "in_progress").length} label="Currently in progress" />
            <Stat icon={ShieldCheck} value={resolved} label="Issues resolved" />
          </div>
        </article>
      </div>
    </div>
  </section>;
}

function Info({ label, value }) {
  return <div><dt className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-1 font-semibold text-slate-700">{value}</dd></div>;
}

function Stat({ icon: Icon, value, label }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><Icon className="h-5 w-5 text-[#b40012]" /><p className="mt-4 text-2xl font-extrabold">{value}</p><p className="mt-1 text-xs font-medium text-slate-500">{label}</p></div>;
}
