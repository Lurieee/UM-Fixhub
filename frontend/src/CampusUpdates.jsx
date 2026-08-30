import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Icon from "./Icon";

export default function CampusUpdates({ updates, onViewAll, showAll = false, readNoticeIds = [], onRead }) {
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && setSelectedNotice(null);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const viewNotice = (notice) => {
    onRead?.(notice.id);
    setSelectedNotice(notice);
  };

  const displayedUpdates = showAll ? updates : updates.slice(0, 2);
  const unreadCount = updates.filter((notice) => !readNoticeIds.includes(notice.id)).length;
  return <section className="rounded-2xl bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-extrabold">{showAll ? "All Campus Updates" : "Campus Updates"}</h2>{showAll && <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#b40012]">{unreadCount} unread</span>}</div>
    <div className="space-y-3">{displayedUpdates.map((notice) => {
      const isRead = readNoticeIds.includes(notice.id);
      return <button key={notice.id} type="button" onClick={() => viewNotice(notice)} className={`relative flex w-full gap-3 rounded-xl border p-4 text-left transition hover:border-red-200 hover:shadow-sm ${isRead ? "border-slate-200 bg-white" : "border-orange-200 bg-orange-50"}`}>
        {!isRead && <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#d41929]" aria-label="Unread" />}
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white"><Icon name={notice.icon} className="h-4 w-4 text-[#b40012]" /></span>
        <span className="min-w-0"><b className="block pr-4 text-sm">{notice.title}</b><span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-500">{notice.body}</span><small className="mt-2 block text-[10px] font-bold uppercase tracking-wide text-slate-400">{notice.date}</small></span>
      </button>;
    })}</div>
    {onViewAll && <button onClick={onViewAll} className="mt-4 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:border-red-200 hover:text-[#b40012]">View All Updates</button>}
    {selectedNotice && <NoticeModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />}
  </section>;
}

function NoticeModal({ notice, onClose }) {
  return <div role="dialog" aria-modal="true" aria-labelledby="notice-title" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" onMouseDown={onClose}>
    <article className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8" onMouseDown={(event) => event.stopPropagation()}>
      <div className="flex items-start justify-between gap-5"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-50 text-[#b40012]"><Icon name={notice.icon} className="h-6 w-6" /></span><button type="button" onClick={onClose} aria-label="Close notice" className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
      <p className="mt-6 text-xs font-extrabold uppercase tracking-[.16em] text-[#b40012]">Campus notice · {notice.date}</p>
      <h2 id="notice-title" className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">{notice.title}</h2>
      <div className="mt-5 whitespace-pre-line text-[15px] leading-7 text-slate-600">{notice.content || notice.body}</div>
      <button type="button" onClick={onClose} className="mt-7 w-full rounded-xl bg-[#b40012] py-3.5 text-sm font-bold text-white">Got it</button>
    </article>
  </div>;
}
