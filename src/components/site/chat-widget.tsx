"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Send,
  ShieldAlert,
  UserRoundPlus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ChatLink = { label: string; href: string };
type ChatMessage = {
  id: string;
  role: "visitor" | "assistant" | "system";
  content: string;
  links?: ChatLink[];
};

type ServiceOption = { id: string; title: string };
type View = "chat" | "lead" | "appointment";
type Language = "en" | "te";

const MESSAGES_KEY = "al_chat_messages_v1";
const SESSION_KEY = "al_chat_session_v1";
const LANG_KEY = "al_chat_language_v1";

function id() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function ChatWidget({
  brandName,
  welcomeEn,
  welcomeTe,
  whatsappLink,
  whatsappEnabled,
  services,
}: {
  brandName: string;
  welcomeEn: string;
  welcomeTe: string;
  whatsappLink: string;
  whatsappEnabled: boolean;
  services: ServiceOption[];
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("chat");
  const [language, setLanguage] = useState<Language>("en");
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submittingForm, setSubmittingForm] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Restore session and conversation from this browser.
  useEffect(() => {
    let existing = localStorage.getItem(SESSION_KEY);
    if (!existing) {
      existing = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `sess-${id()}`;
      localStorage.setItem(SESSION_KEY, existing);
    }
    setSessionId(existing);

    const storedLanguage = localStorage.getItem(LANG_KEY);
    const initialLanguage: Language = storedLanguage === "te" ? "te" : "en";
    setLanguage(initialLanguage);

    try {
      const stored = localStorage.getItem(MESSAGES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.slice(-60));
          setHydrated(true);
          return;
        }
      }
    } catch {
      // Ignore corrupt local history and start a fresh welcome.
    }
    setMessages([
      {
        id: id(),
        role: "assistant",
        content: initialLanguage === "te" ? welcomeTe : welcomeEn,
      },
    ]);
    setHydrated(true);
  }, [welcomeEn, welcomeTe]);

  useEffect(() => {
    if (!hydrated || messages.length === 0) return;
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages.slice(-60)));
  }, [messages, hydrated]);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, language);
  }, [language]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
      inputRef.current?.focus();
    }, 80);
    return () => window.clearTimeout(timer);
  }, [open, messages, loading, quickReplies, view]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function switchLanguage(next: Language) {
    if (next === language) return;
    setLanguage(next);
    setQuickReplies([]);
    setMessages((current) => [
      ...current,
      {
        id: id(),
        role: "system",
        content:
          next === "te"
            ? "భాష తెలుగుకు మార్చబడింది. మీ ప్రశ్నను టైప్ చేయండి."
            : "Language switched to English. Type your question below.",
      },
    ]);
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading || !sessionId) return;
    setError(null);
    setInput("");
    setMessages((current) => [...current, { id: id(), role: "visitor", content: trimmed }]);
    setLoading(true);
    setQuickReplies([]);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: trimmed, language }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        reply?: string;
        mode?: string;
        links?: ChatLink[];
        quickReplies?: string[];
        error?: string;
      };
      if (!response.ok || !data.ok || !data.reply) {
        throw new Error(data.error || "The assistant is unavailable right now.");
      }
      setMessages((current) => [
        ...current,
        { id: id(), role: "assistant", content: data.reply as string, links: data.links },
      ]);
      setQuickReplies(data.quickReplies ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitLead(formData: FormData) {
    setError(null);
    setSubmittingForm(true);
    try {
      const response = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          serviceId: formData.get("serviceId") || "",
          message: formData.get("message") || "",
          consent: formData.get("consent") === "on",
        }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not submit your enquiry.");
      setFormSuccess(data.message || "Thank you — our team will review your enquiry.");
      setMessages((current) => [
        ...current,
        {
          id: id(),
          role: "assistant",
          content: data.message || "Thank you — our team will review your enquiry.",
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your enquiry.");
    } finally {
      setSubmittingForm(false);
    }
  }

  async function submitAppointment(formData: FormData) {
    setError(null);
    setSubmittingForm(true);
    try {
      const response = await fetch("/api/chat/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          serviceId: formData.get("serviceId") || "",
          preferredDate: formData.get("preferredDate"),                          preferredTime: formData.get("preferredTime"),
                          mode: formData.get("mode"),
                          notes: formData.get("notes") || "",
                          consent: formData.get("consent") === "on",
                        }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not request an appointment.");
      setFormSuccess(data.message || "Appointment request received.");
      setMessages((current) => [
        ...current,
        {
          id: id(),
          role: "assistant",
          content: data.message || "Appointment request received. Our team will confirm availability.",
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not request an appointment.");
    } finally {
      setSubmittingForm(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Chat with ${brandName}`}
          className={cn(
            "fixed right-[max(1.25rem,env(safe-area-inset-right))] z-30 flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-navy-900 text-gold-300 shadow-[0_8px_24px_-6px_rgba(11,27,51,0.55)] transition-transform hover:scale-105 sm:right-[max(1.5rem,env(safe-area-inset-right))]",
            whatsappEnabled
              ? "bottom-[calc(max(1.25rem,env(safe-area-inset-bottom))+4rem)] sm:bottom-[calc(max(1.5rem,env(safe-area-inset-bottom))+4rem)]"
              : "bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))]",
          )}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-gold-500" aria-hidden="true" />
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label={`${brandName} website assistant`}
          aria-modal="false"
          className="fixed inset-x-2 bottom-2 z-50 flex h-[min(38rem,calc(100dvh-1rem))] flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-[0_24px_70px_-20px_rgba(11,27,51,0.5)] sm:inset-x-auto sm:bottom-4 sm:right-4 sm:h-[min(38rem,calc(100dvh-2rem))] sm:w-[24.5rem]"
        >
          <div className="flex items-center justify-between gap-2 bg-navy-950 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center border border-gold-400/50 bg-navy-900 font-display text-sm text-gold-300">
                AL
                <span className="absolute -bottom-px -right-px h-1.5 w-1.5 bg-gold-500" />
              </span>
              <div>
                <p className="text-[0.8rem] font-semibold leading-tight">{brandName} Assistant</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[0.62rem] text-white/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {language === "te" ? "వెబ్ సహాయకుడు" : "Website assistant"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex rounded border border-white/15 p-0.5 text-[0.6rem] font-semibold">
                <button
                  type="button"
                  onClick={() => switchLanguage("en")}
                  className={cn("rounded px-1.5 py-0.5", language === "en" ? "bg-white/15 text-white" : "text-white/40")}
                  aria-pressed={language === "en"}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => switchLanguage("te")}
                  className={cn("rounded px-1.5 py-0.5", language === "te" ? "bg-white/15 text-white" : "text-white/40")}
                  aria-pressed={language === "te"}
                >
                  తె
                </button>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {view === "chat" ? (
            <>
              <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-ivory px-3.5 py-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === "visitor" ? "justify-end" : "justify-start",
                    )}
                  >
                    {message.role === "system" ? (
                      <p className="mx-auto rounded-full bg-navy-100 px-3 py-1 text-center text-[0.65rem] text-navy-500">
                        {message.content}
                      </p>
                    ) : (
                      <div
                        className={cn(
                          "max-w-[85%] rounded-xl px-3.5 py-2.5 text-[0.78rem] leading-[1.55] shadow-sm",
                          message.role === "visitor"
                            ? "rounded-br-sm bg-navy-900 text-white"
                            : "rounded-bl-sm border border-navy-100 bg-white text-navy-700",
                        )}
                      >
                        <p className="whitespace-pre-line">{message.content}</p>
                        {message.links && message.links.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {message.links.map((link) =>
                              link.href.startsWith("http") ? (
                                <a
                                  key={`${message.id}-${link.label}`}
                                  href={link.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded-full border border-gold-300 bg-gold-50 px-2.5 py-1 text-[0.65rem] font-medium text-gold-800 hover:bg-gold-100"
                                >
                                  {link.label} ↗
                                </a>
                              ) : (
                                <Link
                                  key={`${message.id}-${link.label}`}
                                  href={link.href}
                                  onClick={() => setOpen(false)}
                                  className="rounded-full border border-gold-300 bg-gold-50 px-2.5 py-1 text-[0.65rem] font-medium text-gold-800 hover:bg-gold-100"
                                >
                                  {link.label}
                                </Link>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start" aria-live="polite">
                    <div className="flex items-center gap-1.5 rounded-xl rounded-bl-sm border border-navy-100 bg-white px-3.5 py-3">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-300 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-300 [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-300 [animation-delay:300ms]" />
                    </div>
                  </div>
                )}

                {error && (
                  <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[0.7rem] text-red-700">
                    {error}
                  </p>
                )}

                {quickReplies.length > 0 && !loading && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        type="button"
                        onClick={() => sendMessage(reply)}
                        className="rounded-full border border-navy-200 bg-white px-3 py-1.5 text-[0.68rem] font-medium text-navy-600 transition-colors hover:border-gold-400 hover:text-navy-900"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-navy-100 bg-white px-3 pb-3 pt-2">
                <div className="mb-2 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setView("lead");
                      setFormSuccess(null);
                      setError(null);
                    }}
                    className="inline-flex items-center gap-1 rounded border border-navy-200 px-2 py-1 text-[0.63rem] font-medium text-navy-500 hover:border-gold-300 hover:text-navy-800"
                  >
                    <UserRoundPlus className="h-3 w-3" />
                    {language === "te" ? "విచారణ" : "Enquiry"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setView("appointment");
                      setFormSuccess(null);
                      setError(null);
                    }}
                    className="inline-flex items-center gap-1 rounded border border-navy-200 px-2 py-1 text-[0.63rem] font-medium text-navy-500 hover:border-gold-300 hover:text-navy-800"
                  >
                    <CalendarClock className="h-3 w-3" />
                    {language === "te" ? "సంప్రదింపు" : "Consultation"}
                  </button>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded border border-navy-200 px-2 py-1 text-[0.63rem] font-medium text-navy-500 hover:border-gold-300 hover:text-navy-800"
                  >
                    WhatsApp ↗
                  </a>
                </div>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void sendMessage(input);
                  }}
                  className="flex items-end gap-2"
                >
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value.slice(0, 2000))}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void sendMessage(input);
                      }
                    }}
                    rows={1}
                    placeholder={language === "te" ? "మీ ప్రశ్నను టైప్ చేయండి…" : "Type your question…"}
                    aria-label="Message"
                    className="max-h-24 min-h-[2.4rem] flex-1 resize-none rounded-lg border border-navy-200 px-3 py-2 text-[0.78rem] text-navy-800 placeholder:text-navy-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                    className="flex h-[2.4rem] w-[2.4rem] shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white transition-colors hover:bg-navy-800 disabled:opacity-40"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </form>
                <p className="mt-1.5 flex items-start gap-1 text-[0.56rem] leading-3 text-navy-400">
                  <ShieldAlert className="mt-px h-2.5 w-2.5 shrink-0" />
                  {language === "te"
                    ? "డెమో సహాయకుడు. నిజమైన వ్యక్తిగత సమాచారం ఇవ్వవద్దు."
                    : "Demo assistant. Do not enter real personal or financial information."}
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col overflow-y-auto bg-white px-4 py-4">
              <button
                type="button"
                onClick={() => {
                  setView("chat");
                  setError(null);
                  setFormSuccess(null);
                }}
                className="mb-3 inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-navy-500 hover:text-navy-800"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {language === "te" ? "చాట్‌కు తిరిగి" : "Back to chat"}
              </button>
              <h3 className="font-display text-xl font-semibold text-navy-950">
                {view === "lead"
                  ? language === "te" ? "విచారణ పంపండి" : "Send an enquiry"
                  : language === "te" ? "సంప్రదింపు అభ్యర్థన" : "Request a consultation"}
              </h3>
              <p className="mt-1 text-[0.72rem] leading-5 text-navy-500">
                {view === "lead"
                  ? "Our team will review your details and respond. Fields marked * are required."
                  : "Tell us a preferred date and time. We will confirm availability by phone or email."}
              </p>

              {formSuccess ? (
                <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
                  <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-600" />
                  <p className="mt-2 text-[0.8rem] font-medium text-emerald-900">{formSuccess}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSuccess(null);
                      setView("chat");
                    }}
                    className="mt-3 text-[0.72rem] font-semibold text-emerald-800 underline"
                  >
                    Return to chat
                  </button>
                </div>
              ) : (
                <form
                  className="mt-4 space-y-2.5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    void (view === "lead" ? submitLead(formData) : submitAppointment(formData));
                  }}
                >
                  <input
                    name="name"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Full name *"
                    className="h-9 w-full rounded-md border border-navy-200 px-3 text-[0.78rem] focus:border-gold-500 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      name="phone"
                      required
                      placeholder="Phone *"
                      className="h-9 w-full rounded-md border border-navy-200 px-3 text-[0.78rem] focus:border-gold-500 focus:outline-none"
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Email *"
                      className="h-9 w-full rounded-md border border-navy-200 px-3 text-[0.78rem] focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  <select
                    name="serviceId"
                    defaultValue=""
                    className="h-9 w-full rounded-md border border-navy-200 bg-white px-2 text-[0.76rem] text-navy-600 focus:border-gold-500 focus:outline-none"
                  >
                    <option value="">Service of interest</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                  {view === "appointment" ? (
                    <>
                      <div className="grid grid-cols-2 gap-2.5">
                        <input
                          name="preferredDate"
                          type="date"
                          required
                          min={today}
                          className="h-9 w-full rounded-md border border-navy-200 px-2 text-[0.76rem] focus:border-gold-500 focus:outline-none"
                        />
                        <input
                          name="preferredTime"
                          required
                          placeholder="Preferred time *"
                          className="h-9 w-full rounded-md border border-navy-200 px-2.5 text-[0.76rem] focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                      <select
                        name="mode"
                        defaultValue="PHONE"
                        className="h-9 w-full rounded-md border border-navy-200 bg-white px-2 text-[0.76rem] text-navy-600 focus:border-gold-500 focus:outline-none"
                      >
                        <option value="PHONE">Phone consultation</option>
                        <option value="VIDEO">Video consultation</option>
                        <option value="IN_PERSON">In-person meeting</option>
                      </select>
                      <textarea
                        name="notes"
                        rows={2}
                        placeholder="Brief context (optional)"
                        className="w-full resize-none rounded-md border border-navy-200 px-2.5 py-2 text-[0.76rem] focus:border-gold-500 focus:outline-none"
                      />
                      <label className="flex items-start gap-2 text-[0.62rem] leading-4 text-navy-500">
                        <input type="checkbox" name="consent" required className="mt-0.5 accent-navy-900" />
                        <span>
                          I agree that {brandName} may contact me about this consultation request and
                          I have read the{" "}
                          <Link href="/legal/privacy-policy" className="underline hover:text-navy-800">
                            Privacy Policy
                          </Link>
                          .
                        </span>
                      </label>
                    </>
                  ) : (
                    <>
                      <textarea
                        name="message"
                        rows={3}
                        placeholder="Briefly describe what you need *"
                        required
                        minLength={10}
                        className="w-full resize-none rounded-md border border-navy-200 px-2.5 py-2 text-[0.76rem] focus:border-gold-500 focus:outline-none"
                      />
                      <label className="flex items-start gap-2 text-[0.62rem] leading-4 text-navy-500">
                        <input type="checkbox" name="consent" required className="mt-0.5 accent-navy-900" />
                        <span>
                          I agree that {brandName} may contact me about this enquiry. I have read the{" "}
                          <Link href="/legal/privacy-policy" className="underline hover:text-navy-800">
                            Privacy Policy
                          </Link>
                          . Please do not include passwords, OTPs or bank credentials.
                        </span>
                      </label>
                    </>
                  )}
                  {error && (
                    <p className="rounded border border-red-200 bg-red-50 px-2.5 py-1.5 text-[0.68rem] text-red-700">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submittingForm}
                    className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-navy-900 text-[0.75rem] font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
                  >
                    {submittingForm ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    {view === "lead" ? "Send enquiry" : "Request consultation"}
                  </button>
                  <p className="text-center text-[0.56rem] leading-3 text-navy-400">
                    Demo only — this form does not store, email or deliver your details.
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
