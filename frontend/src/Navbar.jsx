import { Bell, FileText, Home, PlusCircle } from "lucide-react";

const links = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: Home },
  { key: "report", label: "New Report", href: "/report-issue", icon: PlusCircle },
  { key: "reports", label: "My Reports", href: "/my-reports", icon: FileText },
  { key: "updates", label: "Updates", href: "/updates", icon: Bell },
];

function deriveDisplay(user) {
  const fullName = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  const parts = fullName.trim().split(/\s+/);
  const initials = user.initials || (parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "U");
  return { fullName, initials };
}

function Avatar({ user, initials, className }) {
  if (user.avatar_url) {
    return <img src={user.avatar_url} alt={initials} className={`${className} object-cover`} />;
  }
  return <span className={`${className} grid place-items-center bg-slate-900 text-xs font-bold text-white`}>{initials}</span>;
}

export default function Navbar({ activeKey, user, unreadNoticeCount = 0, onNavigate }) {
  const { fullName, initials } = deriveDisplay(user);

  return <aside className="z-20 w-full border-b border-slate-200/80 bg-white/95 p-3 backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[282px] lg:shrink-0 lg:flex-col lg:gap-4 lg:border-b-0 lg:border-r lg:bg-[#f8fafc] lg:p-4">
    <div className="relative flex justify-center rounded-2xl bg-white px-3 py-1.5 shadow-lg shadow-slate-950/5 transition-shadow hover:shadow-[0_10px_26px_rgba(128,0,32,0.26)] lg:px-3 lg:py-2">
      <button type="button" onClick={() => onNavigate("/dashboard")} className="flex items-center justify-center" aria-label="Go to dashboard"><img src="/um-fixhub-logo-cropped.png" alt="UM FixHub" className="h-auto w-[180px] object-contain sm:w-[210px] lg:w-[220px]" /></button>
      <button onClick={() => onNavigate("/profile")} className="absolute right-3 top-1/2 -translate-y-1/2 lg:hidden" aria-label="Open profile">
        <Avatar user={user} initials={initials} className="h-9 w-9 rounded-full" />
      </button>
    </div>
    <nav className="mt-3 flex gap-2 overflow-x-auto rounded-xl bg-[#7f1022] p-3 shadow-lg shadow-red-950/10 scrollbar-none lg:mt-0 lg:block lg:flex-1 lg:space-y-3 lg:rounded-2xl lg:p-4">
      {links.map(({ key, label, href, icon: Icon }) => <a key={key} href={href} onClick={(event) => { event.preventDefault(); onNavigate(href); }} className={`relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold lg:mb-0 lg:gap-3 lg:rounded-xl lg:px-4 lg:py-3 lg:text-sm ${activeKey === key ? "bg-white text-[#8c1022] shadow-sm" : "text-red-100 hover:bg-white/10 hover:text-white"}`}>
        <Icon className="h-5 w-5" />{label}{key === "updates" && unreadNoticeCount > 0 && <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#d41929] p-0 text-center text-[10px] font-extrabold leading-none text-white lg:right-2 lg:top-2">{unreadNoticeCount > 9 ? "9+" : unreadNoticeCount}</span>}
      </a>)}
    </nav>
    <div className="mt-auto hidden rounded-2xl bg-[#7f1022] p-4 shadow-lg shadow-red-950/10 lg:block">
      <button onClick={() => onNavigate("/profile")} className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-white hover:bg-white/10">
        <Avatar user={user} initials={initials} className="h-10 w-10 rounded-full" />
        <span><b className="block text-sm">{fullName}</b><small className="text-red-100">Student</small></span>
      </button>
    </div>
  </aside>;
}