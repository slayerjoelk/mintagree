"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Head from "next/head";

const SPLIT_RE = /[.\n\r,]+/;

const DIALOGUE = [
  { spk: "Sam", text: "Hey Taylor, quick recap of our call. We'll refresh the homepage and pricing pages and tidy the navigation." },
  { spk: "Taylor", text: "Great. I'd like the first draft before the webinar if possible." },
  { spk: "Sam", text: "We'll include three rounds of revisions. Please send the brand assets by Friday." },
  { spk: "Taylor", text: "Done. Budget at one thousand five hundred dollars is approved." },
  { spk: "Sam", text: "Perfect. Let's target next Monday for the first milestone. I'll send a conversation receipt with a one-time code for sign-off." },
];

const fullScript = DIALOGUE.map((d) => d.spk + ": " + d.text).join(" ");

export default function DemoPage() {
  const [subject, setSubject] = useState("Client conversation receipt");
  const [bullets, setBullets] = useState(["Confirm project scope", "3 rounds of revisions", "Brand assets due Friday"]);
  const [amount, setAmount] = useState("99");
  const [due, setDue] = useState("");
  const [requireOtp, setRequireOtp] = useState(true);
  const [otp, setOtp] = useState(() => String(Math.floor(Math.random() * 900000) + 100000));
  const [clientView, setClientView] = useState<any>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [scheduleAt, setScheduleAt] = useState("");
  const [scheduled, setScheduled] = useState<{ id: string; at: string; status: string; url: string }[]>([]);
  const [recState, setRecState] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const recRef = useRef<any>(null);
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  // Load voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices();
      // Prefer natural-sounding voices (Google, Apple, Microsoft)
      const ranked = [...all].sort((a, b) => {
        const aScore = (a.name.match(/Google|Apple|Samantha|Karen|Daniel|Microsoft/gi)?.length || 0) +
          (a.localService ? 2 : 0);
        const bScore = (b.name.match(/Google|Apple|Samantha|Karen|Daniel|Microsoft/gi)?.length || 0) +
          (b.localService ? 2 : 0);
        return bScore - aScore;
      });
      setVoices(ranked);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const randToken = useCallback((n = 24) => {
    const s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let o = "";
    for (let i = 0; i < n; i++) o += s[Math.floor(Math.random() * s.length)];
    return o;
  }, []);

  const formatUSD = (n: string | number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n || 0));

  const bytesToDataUrl = (file: File): Promise<string> =>
    new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result as string); fr.readAsDataURL(file); });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFilePreview(await bytesToDataUrl(f));
  };

  const addBullet = () => setBullets([...bullets, ""]);
  const updateBullet = (i: number, v: string) => { const n = [...bullets]; n[i] = v; setBullets(n); };
  const removeBullet = (i: number) => setBullets(bullets.filter((_, x) => x !== i));

  const sttAvailable = () => typeof window !== "undefined" && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const startVoice = () => {
    const SRClass = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SRClass) { alert("Your browser doesn't support live transcription."); return; }
    const r = new SRClass();
    r.continuous = true; r.interimResults = true; r.lang = "en-US";
    r.onresult = (e: any) => { let t = ""; for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript; setTranscript(t); };
    r.onend = () => setRecState("idle");
    r.onerror = () => setRecState("idle");
    r.start();
    recRef.current = r;
    setRecState("recording");
  };

  const stopVoice = () => {
    if (recRef.current) { try { recRef.current.stop(); } catch {} recRef.current = null; }
    setRecState("idle");
  };

  const buildReceipt = (overrideBullets?: string[]) => ({
    token: randToken(20), subject, bullets: overrideBullets ?? bullets.filter(Boolean),
    amountUSD: amount, due, requireOtp, otp: requireOtp ? otp : null,
    visuals: filePreview ? [{ id: 1, url: filePreview }] : [], scheduled,
  });

  const finalizeFromScript = (script: string) => {
    const lines = script.split(SPLIT_RE).map((x) => x.trim()).filter(Boolean);
    setTranscript(script); setBullets(lines); setClientView({ receipt: buildReceipt(lines), state: "sent" });
  };

  const applyTranscript = () => {
    if (!transcript.trim()) return;
    if (bullets.some((b) => b.trim())) {
      if (!window.confirm("This will overwrite your existing bullets. Continue?")) return;
    }
    finalizeFromScript(transcript);
  };

  const sendDemo = () => { setOtpInput(""); setClientView({ receipt: buildReceipt(), state: "sent" }); };

  const scheduleVisual = () => {
    if (!filePreview || !scheduleAt) return;
    const s = { id: crypto.randomUUID(), at: scheduleAt, status: "pending", url: filePreview };
    const next = [...scheduled, s]; setScheduled(next);
    if (clientView) setClientView({ ...clientView, receipt: { ...clientView.receipt, scheduled: next } });
  };

  const pickVoice = (pref: string): SpeechSynthesisVoice | null => {
    if (!voices.length) return null;
    if (pref === "female") {
      const candidates = voices.filter(v => /Google US English|en-US|Samantha|Karen|Victoria|Moira|Tessa|Kate|Serena|Fiona|Ava|Zira/i.test(v.name));
      return candidates[0] ?? voices[0];
    }
    const candidates = voices.filter(v => /Google UK English Male|Daniel|Tom|Arthur|Fred|Microsoft David|Microsoft James|en-GB/i.test(v.name));
    return candidates[0] ?? voices.find(v => !/(female|zira|samantha|karen|moira|victoria)/i.test(v.name)) ?? voices[0];
  };

  const playDemoCall = () => {
    try {
      setDemoPlaying(true);
      setOtpInput("");
      if (!("speechSynthesis" in window)) { setDemoPlaying(false); finalizeFromScript(fullScript); return; }
      window.speechSynthesis.cancel();
      let i = 0;
      const speakNext = () => {
        if (i >= DIALOGUE.length) { setDemoPlaying(false); finalizeFromScript(fullScript); return; }
        const seg = DIALOGUE[i++];
        const u = new SpeechSynthesisUtterance(seg.text);
        const v = pickVoice(seg.spk === "Sam" ? "male" : "female");
        if (v) { u.voice = v; }
        u.lang = "en-US";
        // More natural-sounding settings
        u.rate = 0.95;
        u.pitch = seg.spk === "Sam" ? 0.95 : 1.08;
        u.volume = 1;
        u.onend = () => {
          if (!mountedRef.current) { window.speechSynthesis.cancel(); return; }
          setTimeout(speakNext, 400);
        };
        window.speechSynthesis.speak(u);
      };
      speakNext();
    } catch { setDemoPlaying(false); finalizeFromScript(fullScript); }
  };

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      let ch = false;
      const next = scheduled.map((x) => {
        if (x.status === "pending" && new Date(x.at) <= now) { ch = true; return { ...x, status: "sent" }; }
        return x;
      });
      if (ch) { setScheduled(next); if (clientView) setClientView({ ...clientView, receipt: { ...clientView.receipt, scheduled: next } }); }
    }, 1000);
    return () => clearInterval(t);
  }, [scheduled, clientView]);

  const btnCls = "inline-flex items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors";
  const inputCls = "w-full rounded-lg border border-white/10 bg-zinc-800/80 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-mint/30 transition-colors";
  const labelCls = "block text-xs font-medium text-zinc-400 mb-1.5";

  return (
    <>
      <Head>
        <title>MintAgree Demo — Try It Live</title>
      </Head>
      <main className="min-h-screen bg-zinc-950">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold text-white">
              <span className="w-2 h-2 rounded-full bg-mint" />
              MintAgree
            </Link>
            <Link href="/pricing" className="px-4 py-2 rounded-lg bg-mint text-zinc-950 text-sm font-semibold hover:bg-mint-hover transition-colors">
              Subscribe
            </Link>
          </div>
        </header>

        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Live demo</h1>
            <p className="text-zinc-400">Experience how MintAgree turns voice into signed client agreement receipts.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Owner pane */}
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-mint/10 border border-mint/20 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">Owner</div>
                    <div className="text-xs text-zinc-500">Voice → agreement</div>
                  </div>
                </div>
                <span className="text-xs text-zinc-600 font-medium px-2 py-1 rounded-md bg-zinc-800">USD</span>
              </div>

              {/* Voice controls */}
              <div className="rounded-xl border border-white/5 bg-zinc-800/40 p-4 mb-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <button
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      demoPlaying ? "bg-mint text-zinc-950 border-mint" : "bg-zinc-800 border-white/10 text-zinc-200 hover:bg-zinc-700"
                    }`}
                    onClick={playDemoCall}
                    disabled={demoPlaying}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    {demoPlaying ? "Playing demo…" : "Play demo call"}
                  </button>

                  <button
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      recState === "recording"
                        ? "bg-red-500/10 border-red-500/30 text-red-400"
                        : "bg-zinc-800 border-white/10 text-zinc-200 hover:bg-zinc-700"
                    }`}
                    onClick={recState === "recording" ? stopVoice : startVoice}
                  >
                    <span className={`w-2 h-2 rounded-full ${recState === "recording" ? "bg-red-400 animate-pulse" : "bg-zinc-500"}`} />
                    {recState === "recording" ? "Stop" : "Start"} live voice
                  </button>

                  <button
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
                    onClick={applyTranscript}
                    disabled={!transcript.trim()}
                  >
                    Insert into bullets
                  </button>
                </div>

                <textarea
                  aria-label="Transcript"
                  className={inputCls}
                  rows={3}
                  placeholder="Live transcript or demo text appears here…"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                />

                <p className="text-xs text-zinc-600 mt-2">
                  Play the prepared call or speak live; we&apos;ll generate the receipt.
                </p>

                {voices.length > 0 && (
                  <p className="text-xs text-zinc-600 mt-1">
                    Using{" "}
                    <span className="text-mint">
                      {voices[0]?.name ?? "system default"}
                    </span>{" "}
                    voice for demo.
                  </p>
                )}
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <label className={labelCls}>Subject</label>
                  <input className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>

                <div>
                  <label className={labelCls}>Bullets</label>
                  <div className="space-y-2">
                    {bullets.map((b, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <span className="text-zinc-600 text-xs w-5 shrink-0">{i + 1}.</span>
                        <input className={inputCls} value={b} onChange={(e) => updateBullet(i, e.target.value)} />
                        <button className="rounded-lg border border-white/10 px-2.5 py-2 text-zinc-500 hover:text-red-400 hover:border-red-500/30 transition-colors shrink-0" onClick={() => removeBullet(i)}>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                      onClick={addBullet}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add bullet
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Amount ({formatUSD(amount)})</label>
                    <input className={inputCls} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Due date</label>
                    <input className={inputCls} type="date" value={due} onChange={(e) => setDue(e.target.value)} />
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${requireOtp ? "bg-mint" : "bg-zinc-700"}`}
                    onClick={() => setRequireOtp(!requireOtp)}
                    role="switch"
                    aria-checked={requireOtp}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${requireOtp ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <span className="text-sm text-zinc-400">Require OTP on client ack</span>
                </div>

                {requireOtp && (
                  <div>
                    <label className={labelCls}>OTP</label>
                    <input
                      className={`${inputCls} font-mono text-base tracking-[0.15em]`}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                )}

                {/* Attachments */}
                <div className="rounded-xl border border-white/5 bg-zinc-800/40 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                    <span className="text-sm font-medium text-zinc-300">Visual attachment & scheduled delivery</span>
                  </div>

                  <input type="file" accept="image/*" onChange={handleFile} className="text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-zinc-300 file:text-sm file:hover:bg-zinc-700 file:transition-colors" />

                  {filePreview && (
                    <div className="mt-4 grid md:grid-cols-2 gap-3 items-start">
                      <img src={filePreview} loading="lazy" alt="visual attachment" className="rounded-lg border border-white/10 max-h-40 object-contain" />
                      <div className="space-y-3">
                        <div>
                          <label className={labelCls}>Send at</label>
                          <input className={inputCls} type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} />
                        </div>
                        <button className={btnCls} onClick={scheduleVisual}>Schedule</button>
                        <div className="text-xs text-zinc-500">
                          {scheduled.length
                            ? scheduled.map((x) => `${new Date(x.at).toLocaleString()} (${x.status})`).join(", ")
                            : "No schedules yet"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className="w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold bg-mint text-zinc-950 hover:bg-mint-hover transition-all shadow-glow active:scale-[0.98]"
                  onClick={sendDemo}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 2L11 13" />
                    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                  Send receipt
                </button>
              </div>
            </div>

            {/* Client pane */}
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-mint/10 border border-mint/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">Client</div>
                  <div className="text-xs text-zinc-500">Signing preview</div>
                </div>
              </div>

              {!clientView && (
                <div className="text-zinc-500 text-sm text-center py-16 flex flex-col items-center gap-3">
                  <svg className="w-10 h-10 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <div>No receipt yet.</div>
                  <div className="text-xs text-zinc-600">Click &quot;Play demo call&quot; or &quot;Send receipt&quot; to preview what your client sees.</div>
                </div>
              )}

              {clientView && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/5 bg-zinc-800/40 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Conversation Receipt</span>
                      <span className="text-xs font-mono text-zinc-600">#{clientView.receipt.token.slice(0, 6).toUpperCase()}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-3">{clientView.receipt.subject}</h3>

                    <ul className="space-y-2">
                      {clientView.receipt.bullets.map((b: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-mint shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-zinc-500">Amount</div>
                        <div className="text-white font-mono font-semibold">{formatUSD(clientView.receipt.amountUSD)}</div>
                      </div>
                      {clientView.receipt.due && (
                        <div>
                          <div className="text-xs text-zinc-500">Due date</div>
                          <div className="text-white font-mono">{clientView.receipt.due}</div>
                        </div>
                      )}
                    </div>

                    {clientView.receipt.visuals?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <div className="text-xs text-zinc-500 mb-2">Attached visual</div>
                        <img src={clientView.receipt.visuals[0].url} loading="lazy" alt="attachment" className="rounded-lg border border-white/10 max-h-36 object-contain" />
                      </div>
                    )}

                    {clientView.receipt.requireOtp && (
                      <div className="mt-4 p-3 rounded-lg bg-mint/5 border border-mint/10 flex items-center justify-between">
                        <div className="text-sm text-zinc-400">
                          One-time code:{" "}
                          <span className="text-mint font-mono font-bold tracking-[0.15em] text-lg">{clientView.receipt.otp}</span>
                        </div>
                        <span className="text-xs text-zinc-600">Share this with your client</span>
                      </div>
                    )}
                  </div>

                  {clientView.state === "sent" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {clientView.receipt.requireOtp && (
                          <input
                            placeholder="Enter OTP"
                            className={`${inputCls} w-auto`}
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                          />
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium bg-mint text-zinc-950 hover:bg-mint-hover transition-colors"
                          onClick={() => {
                            if (clientView.receipt.requireOtp && otpInput !== clientView.receipt.otp) {
                              alert("Incorrect OTP. Please check the code and try again.");
                              return;
                            }
                            setClientView({ ...clientView, state: "ack" });
                          }}
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Acknowledge
                        </button>
                        <button
                          className={btnCls}
                          onClick={() => setClientView({ ...clientView, state: "disputed" })}
                        >
                          <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                          </svg>
                          Dispute
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium " +
                        (clientView.state === "ack"
                          ? "bg-teal-900/30 text-teal-300 border border-teal-500/20"
                          : clientView.state === "disputed"
                          ? "bg-red-900/30 text-red-400 border border-red-500/20"
                          : "bg-zinc-800 text-zinc-400 border border-white/5")
                      }
                    >
                      {clientView.state === "ack" && (
                        <>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Signed
                        </>
                      )}
                      {clientView.state === "disputed" && (
                        <>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                          </svg>
                          Disputed
                        </>
                      )}
                      {clientView.state === "sent" && "Awaiting signature"}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-800/30 border border-white/5 text-xs text-zinc-500">
                    This is a conversation receipt — not a legally binding contract. OTP provides lightweight identity confirmation. Always follow your jurisdiction&apos;s rules.
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
