import { useRef, useState } from "react";
import { BookOpen, CalendarDays, FileText, LogOut, Mail, MapPin, Pencil, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import api from "./lib/api";

function deriveDisplay(user) {
  const fullName = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  const parts = fullName.trim().split(/\s+/);
  const initials = user.initials || (parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "U");
  return { fullName, initials };
}

function formatMemberSince(value) {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString([], { month: "long", year: "numeric" });
}

export default function Profile({ user, reports, onLogout, onUserUpdate, accountType = "Student" }) {
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef(null);
  const resolved = reports.filter((report) => report.status === "resolved").length;
  const { fullName, initials } = deriveDisplay(user);
  const studentId = user.student_id || user.studentId;
  const memberSince = formatMemberSince(user.created_at);

  const updatePhoto = async (event) => {
    const [file] = event.target.files;
    if (!file) return;

    setPhotoError("");
    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const { data } = await api.post("/profile/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUserUpdate?.(data);
    } catch (err) {
      setPhotoError(err.response?.data?.message || "Could not upload photo.");
    } finally {
      setUploading(false);
    }
  };

  return <section className="mx-auto max-w-5xl">
    <p className="text-sm font-bold uppercase tracking-widest text-[#b40012]">{accountType} account</p>
    <h1 className="mt-2 text-3xl font-extrabold tracking-tight">My Profile</h1>
    <p className="mt-2 text-slate-600">Manage your account information and view your reporting activity.</p>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
      <article className="rounded-3xl bg-[#09090b] p-7 text-white shadow-xl shadow-black/20">
        <div className="mx-auto w-fit text-center">
          {user.avatar_url ? <img src={user.avatar_url} alt="Profile" className="h-28 w-28 rounded-full border-4 border-white/20 object-cover" /> : <span className="grid h-28 w-28 place-items-center rounded-full border-4 border-white/20 bg-gradient-to-br from-[#7f1022] via-[#b40012] to-slate-700 text-2xl font-extrabold">{initials}</span>}
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#c45b69] hover:text-white" title="Change profile photo">
            <Pencil className="h-3.5 w-3.5" />{uploading ? "Uploading..." : "Edit"}
          </button>
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={updatePhoto} />
          {photoError && <p className="mt-2 text-xs font-bold text-[#f87171]">{photoError}</p>}
        </div>
        <h2 className="mt-5 text-2xl font-extrabold">{fullName}</h2>
        <p className="mt-1 text-sm text-slate-300">{accountType} · University of Mindanao</p>
        <div className="mt-7 space-y-4 border-t border-white/10 pt-6 text-sm text-slate-200">
          <p className="flex gap-3"><Mail className="h-5 w-5 text-[#b84052]" />{user.email}</p>
          {user.program && <p className="flex gap-3"><BookOpen className="h-5 w-5 text-[#b84052]" />{user.program}</p>}
          {user.campus && <p className="flex gap-3"><MapPin className="h-5 w-5 text-[#b84052]" />{user.campus}</p>}
        </div>
        <button onClick={onLogout} className="mt-14 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-extrabold text-[#8c1022] hover:bg-[#7f1022] hover:text-white"><LogOut className="h-4 w-4" />Log out</button>
      </article>
      <div className="space-y-6">
        <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-lg font-extrabold">Account information</h2>
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            {studentId && <Info label="Student ID" value={studentId} />}
            <Info label="Account type" value={accountType} />
            {user.campus && <Info label="Campus" value={user.campus} />}
            {memberSince && <Info label="Member since" value={memberSince} icon={CalendarDays} />}
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
        <TwoFactorSettings user={user} onUserUpdate={onUserUpdate} />
      </div>
    </div>
  </section>;
}

function TwoFactorSettings({ user, onUserUpdate }) {
  const [setupData, setSetupData] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const startSetup = async () => {
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/2fa/generate");
      setSetupData(data);
    } catch (err) {
      setError("Could not start setup. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const confirmSetup = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.post("/2fa/confirm", { code });
      setSetupData(null);
      setCode("");
      onUserUpdate?.({ ...user, two_factor_enabled: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code.");
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    try {
      await api.post("/2fa/disable");
      onUserUpdate?.({ ...user, two_factor_enabled: false });
    } catch (err) {
      setError("Could not disable 2FA. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
    <h2 className="text-lg font-extrabold">Two-Factor Authentication</h2>
    <p className="mt-2 text-sm text-slate-600">Add an extra layer of security using an authenticator app.</p>

    {user.two_factor_enabled && !setupData && <div className="mt-4 flex items-center justify-between rounded-2xl bg-green-50 p-4">
      <span className="text-sm font-bold text-green-700">Enabled</span>
      <button onClick={disable} disabled={busy} className="text-sm font-bold text-[#b40012]">Disable</button>
    </div>}

    {!user.two_factor_enabled && !setupData && <button onClick={startSetup} disabled={busy} className="mt-4 rounded-xl bg-[#b40012] px-5 py-3 text-sm font-extrabold text-white">
      {busy ? "Starting..." : "Enable Two-Factor Authentication"}
    </button>}

    {setupData && <form onSubmit={confirmSetup} className="mt-4 space-y-4">
      <p className="text-sm text-slate-600">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):</p>
      <div className="flex justify-center rounded-2xl bg-slate-50 p-6"><QRCodeSVG value={setupData.otpauth_url} size={180} /></div>
      <p className="text-xs text-slate-400">Or enter this key manually: <span className="font-mono">{setupData.secret}</span></p>
      <label className="block text-sm font-bold">Enter the 6-digit code to confirm
        <input required value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} inputMode="numeric" placeholder="123456" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50" />
      </label>
      {error && <p className="text-sm font-bold text-[#b40012]">{error}</p>}
      <div className="flex gap-3">
        <button type="button" onClick={() => { setSetupData(null); setCode(""); }} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600">Cancel</button>
        <button type="submit" disabled={busy} className="rounded-xl bg-[#b40012] px-5 py-3 text-sm font-extrabold text-white">{busy ? "Confirming..." : "Confirm & Enable"}</button>
      </div>
    </form>}

    {error && !setupData && <p className="mt-2 text-sm font-bold text-[#b40012]">{error}</p>}
  </article>;
}

function Info({ label, value }) {
  return <div><dt className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-1 font-semibold text-slate-700">{value}</dd></div>;
}

function Stat({ icon: Icon, value, label }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><Icon className="h-5 w-5 text-[#b40012]" /><p className="mt-4 text-2xl font-extrabold">{value}</p><p className="mt-1 text-xs font-medium text-slate-500">{label}</p></div>;
}