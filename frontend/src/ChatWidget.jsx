import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import api from "./lib/api";

export default function ChatWidget({ onUseDraft }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", text: "Hi! I'm the UM FixHub campus assistant. Ask me anything, or I can help you check your reports or draft a new one." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setSending(true);

    try {
      const { data } = await api.post("/chat", { message: text, history });
      setMessages((prev) => [...prev, { role: "model", text: data.reply, draft: data.draft || null }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "model", text: "Sorry, something went wrong. Try again." }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#b40012] text-white shadow-lg shadow-red-900/25 hover:bg-[#8c1022]"
        aria-label="Open campus assistant"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[480px] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="bg-[#b40012] px-4 py-3">
            <p className="text-sm font-bold text-white">Campus Assistant</p>
            <p className="text-xs text-red-100">Ask questions or draft a report</p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "bg-[#b40012] text-white" : "bg-slate-100 text-slate-800"}`}>
                  <p className="whitespace-pre-wrap leading-5">{m.text}</p>
                  {m.draft && (
                    <button
                      onClick={() => { onUseDraft(m.draft); setOpen(false); }}
                      className="mt-2 w-full rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#b40012] hover:bg-red-50"
                    >
                      Use this draft →
                    </button>
                  )}
                </div>
              </div>
            ))}
            {sending && <div className="text-xs text-slate-400">Thinking...</div>}
          </div>

          <div className="flex items-center gap-2 border-t border-slate-200 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-300"
            />
            <button
              onClick={send}
              disabled={sending}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#b40012] text-white disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}