"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Head from "next/head";

const DIALOGUE = [
  { spk: "Sarah", role: "Freelance Designer", voice: "en-US-AvaNeural", text: "Hey Mike, just to recap our call. We'll refresh the homepage and pricing pages, and tidy up the navigation." },
  { spk: "Mike", role: "Startup Founder", voice: "en-US-AndrewNeural", text: "Sounds good. I'd love the first draft before next week's webinar if that's possible." },
  { spk: "Sarah", role: "Freelance Designer", voice: "en-US-AvaNeural", text: "Absolutely. We'll include three rounds of revisions. Please send the brand assets by Friday so we can hit the ground running." },
  { spk: "Mike", role: "Startup Founder", voice: "en-US-AndrewNeural", text: "Done. The budget at one thousand five hundred dollars is approved and ready to go." },
  { spk: "Sarah", role: "Freelance Designer", voice: "en-US-AvaNeural", text: "Perfect. Let's target next Monday for the first milestone. I'll send a conversation receipt with a one-time code for sign-off." },
];

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
  const [audioCache, setAudioCache] = useState<Record<number, string>>({});
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

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

  const receipt = {
    id: randToken(),
    createdAt: new Date().toISOString(),
    status: "pending",
    clientName: "Mike Ross",
    clientEmail: "mike@acme.co",
    subject,
    scopeSummary: bullets,
    amount: Number(amount || 0),
    currency: "USD",
    due: due || undefined,
    file: filePreview || undefined,
    otp: requireOtp ? otp : undefined,
    token: randToken(),
    signUrl: "",
    disputeUrl: "",
  };

  useEffect(() => {
    const token = randToken();
    setClientView({
      ...receipt,
      token,
      signUrl: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/sign/${token}?mode=sign`,
      disputeUrl: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/sign/${token}?mode=dispute`,
    });
  }, [subject, bullets.join("|"), amount, due, filePreview, requireOtp, otp]);

  const startRecording = () => {
    setRecState("recording");
    setTranscript("");
    const recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!recognition) { setRecState("error"); return; }
    const r = new recognition();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    r.onresult = (e: any) => {
      const arr = Array.from(e.results || []);
      const text = arr.map((x: any) => x[0].transcript).join(" ");
      setTranscript(text);
    };
    r.onerror = () => setRecState("error");
    r.onend = () => { if (recRef.current) recRef.current.start(); };
    recRef.current = r;
    r.start();
  };

  const stopRecording = () => { recRef.current?.stop(); recRef.current = null; setRecState("stopped"); };

  const recRef = useRef<any>(null);

  const createReceipt = async () => {
    try {
      const res = await fetch("/api/receipts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(receipt) });
      const data = await res.json();
      if (data.ok && clientView) {
        const updated = { ...clientView, id: data.id };
        setClientView(updated);
        setRecState("created");
      }
    } catch { setRecState("error"); }
  };

  const schedule = async () => {
    if (!scheduleAt) return;
    const id = randToken(12);
    setScheduled([...scheduled, { id, at: scheduleAt, status: "pending", url: `/receipts/${id}` }]);
    setScheduleAt("");
  };

  const generateAudio = async () => {
    setGeneratingAudio(true);
    const cache: Record<number, string> = {};
    for (let i = 0; i < DIALOGUE.length; i++) {
      try {
        const res = await fetch("/api/tts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: DIALOGUE[i].text, voice: DIALOGUE[i].voice }) });
        if (!res.ok) throw new Error("TTS failed");
        const blob = await res.blob();
        cache[i] = URL.createObjectURL(blob);
      } catch { /* skip on failure */ }
    }
    if (mountedRef.current) { setAudioCache(cache); setGeneratingAudio(false); }
  };

  const playDemo = async () => {
    if (Object.keys(audioCache).length === 0) await generateAudio();
    if (Object.keys(audioCache).length === 0) return;
    setDemoPlaying(true);
    for (let i = 0; i < DIALOGUE.length; i++) {
      if (!mountedRef.current) break;
      if (!audioCache[i]) continue;
      setActiveLine(i);
      const audio = new Audio(audioCache[i]);
      audioRef.current = audio;
      await new Promise((r) => { audio.onended = r; audio.onerror = r; audio.play().catch(() => r(undefined)); });
      await new Promise((r) => setTimeout(r, 400));
    }
    setActiveLine(null);
    setDemoPlaying(false);
  };

  const stopDemo = () => { audioRef.current?.pause(); setDemoPlaying(false); setActiveLine(null); };

  const otpValid = otpInput === otp;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Head><title>Demo — MintAgree</title></Head>

      {/* Nav */}
      <nav className="border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur fixed top-0 inset-x-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-zinc-100 tracking-tight">MintAgree</Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">Log in</Link>
            <Link href="/register" className="text-sm bg-zinc-100 text-zinc-950 px-3 py-1.5 rounded-md font-medium hover:bg-white transition-colors">Get started</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-20">

        {/* Hero pitch */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 text-xs font-medium text-teal-300 bg-teal-500/10 rounded-full border border-teal-500/20 mb-4">Live demo</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">See how agreements become receipts</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">A real voice conversation, captured and turned into a signed receipt with one-tap approval.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT: Call UI */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Conversation</h2>
              <div className="flex items-center gap-2">
                {generatingAudio && (
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" /> Generating voices…
                  </span>
                )}
                {!demoPlaying ? (
                  <button onClick={playDemo} disabled={generatingAudio} className="flex items-center gap-2 text-sm bg-teal-500 text-zinc-950 px-4 py-2 rounded-lg font-medium hover:bg-teal-400 transition-colors disabled:opacity-40">
                    <PlayIcon /> {Object.keys(audioCache).length ? "Play again" : "Play human voices"}
                  </button>
                ) : (
                  <button onClick={stopDemo} className="flex items-center gap-2 text-sm bg-zinc-800 text-zinc-100 px-4 py-2 rounded-lg font-medium hover:bg-zinc-700 transition-colors">
                    <PauseIcon /> Stop
                  </button>
                )}
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-5">
              {DIALOGUE.map((line, i) => (
                <div key={i} className={`flex gap-4 transition-opacity ${activeLine !== null && activeLine !== i ? "opacity-40" : "opacity-100"}`}>
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${line.spk === "Sarah" ? "bg-teal-500/20 text-teal-300" : "bg-indigo-500/20 text-indigo-300"}`}>
                      {line.spk[0]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-zinc-200">{line.spk}</span>
                      <span className="text-xs text-zinc-600">{line.role}</span>
                      {activeLine === i && demoPlaying && (
                        <span className="flex items-center gap-0.5">
                          <span className="w-1 h-3 bg-teal-400 rounded-full animate-[bounce_1s_infinite]" />
                          <span className="w-1 h-3 bg-teal-400 rounded-full animate-[bounce_1.1s_infinite]" />
                          <span className="w-1 h-3 bg-teal-400 rounded-full animate-[bounce_1.2s_infinite]" />
                        </span>
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed ${activeLine === i ? "text-zinc-100" : "text-zinc-400"}`}>{line.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recording */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-zinc-300">Transcribe your own call</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${recState === "recording" ? "bg-red-500/20 text-red-300" : recState === "created" ? "bg-emerald-500/20 text-emerald-300" : "bg-zinc-800 text-zinc-500"}`}>
                  {recState === "idle" ? "Ready" : recState === "recording" ? "Recording…" : recState === "stopped" ? "Stopped" : recState === "created" ? "Receipt created" : "Error"}
                </span>
              </div>
              {transcript && (
                <div className="bg-zinc-950 rounded-lg border border-zinc-800/60 p-3 mb-3">
                  <p className="text-sm text-zinc-300 leading-relaxed">{transcript}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                {recState === "idle" ? (
                  <button onClick={startRecording} className="flex items-center gap-2 text-sm bg-zinc-800 text-zinc-100 px-3 py-2 rounded-lg hover:bg-zinc-700 transition-colors">
                    <MicIcon /> Start recording
                  </button>
                ) : recState === "recording" ? (
                  <button onClick={stopRecording} className="flex items-center gap-2 text-sm bg-red-500/20 text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/30 transition-colors">
                    <SquareIcon /> Stop
                  </button>
                ) : (
                  <button onClick={createReceipt} className="text-sm bg-teal-500 text-zinc-950 px-3 py-2 rounded-lg font-medium hover:bg-teal-400 transition-colors">
                    Create receipt
                  </button>
                )}
              </div>
            </div>

            {/* Live editor */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-300">Edit receipt details</h3>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Subject</label>
                <input className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-teal-500/50" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Scope bullets</label>
                <div className="space-y-2">
                  {bullets.map((b, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-teal-500 mt-2 text-xs">●</span>
                      <input className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-teal-500/50" value={b} onChange={(e) => updateBullet(i, e.target.value)} />
                      <button onClick={() => removeBullet(i)} className="text-zinc-600 hover:text-red-400 text-xs px-2">✕</button>
                    </div>
                  ))}
                  <button onClick={addBullet} className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1">+ Add bullet</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Amount (USD)</label>
                  <input type="number" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-teal-500/50" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Due date</label>
                  <input type="date" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-teal-500/50" value={due} onChange={(e) => setDue(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Attachment</label>
                <input type="file" className="text-xs text-zinc-400 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-zinc-800 file:text-zinc-200" onChange={handleFile} />
                {filePreview && <img src={filePreview} alt="Preview" className="mt-2 rounded-lg max-h-28 border border-zinc-800" />}
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="text-xs text-zinc-500">Require OTP for sign-off</label>
                <button onClick={() => setRequireOtp(!requireOtp)} className={`relative w-10 h-5 rounded-full transition-colors ${requireOtp ? "bg-teal-500" : "bg-zinc-700"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${requireOtp ? "translate-x-5" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Client preview */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-white">Client receives this</h2>
            {clientView ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl shadow-black/40">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <CheckIcon className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-100">{clientView.subject}</p>
                      <p className="text-xs text-zinc-500">From Sarah • Just now</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${clientView.status === "signed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                    {clientView.status === "signed" ? "Signed" : "Pending"}
                  </span>
                </div>

                <div className="bg-zinc-950 rounded-xl border border-zinc-800/60 p-4 mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <DocIcon className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs font-medium text-zinc-400">Agreement scope</span>
                  </div>
                  <ul className="space-y-2">
                    {clientView.scopeSummary?.map((b: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                        <span className="text-teal-500 mt-1 text-[10px]">●</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-zinc-950 rounded-xl border border-zinc-800/60 p-4">
                    <p className="text-xs text-zinc-500 mb-1">Amount</p>
                    <p className="text-xl font-bold text-white font-mono">{formatUSD(clientView.amount)}</p>
                  </div>
                  <div className="bg-zinc-950 rounded-xl border border-zinc-800/60 p-4">
                    <p className="text-xs text-zinc-500 mb-1">{clientView.otp ? "Sign-off code" : "Reference"}</p>
                    {clientView.otp ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-teal-400 font-mono tracking-widest">{clientView.otp}</span>
                        <span className="text-[10px] text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">OTP</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-zinc-400 font-mono">{clientView.token.slice(0, 8)}…</span>
                    )}
                  </div>
                </div>

                {clientView.file && (
                  <div className="mb-5">
                    <img src={clientView.file} alt="Attachment" className="rounded-xl border border-zinc-800 max-h-40 object-cover" />
                  </div>
                )}

                <div className="flex gap-3">
                  <Link href={clientView.signUrl} className="flex-1 text-center py-2.5 rounded-xl bg-teal-500 text-zinc-950 text-sm font-semibold hover:bg-teal-400 transition-colors">
                    Sign agreement
                  </Link>
                  <Link href={clientView.disputeUrl} className="flex-1 text-center py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 transition-colors">
                    Raise dispute
                  </Link>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-800/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Client verification</p>
                      <div className="flex gap-1">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <input key={i} maxLength={1} className="w-8 h-10 bg-zinc-950 border border-zinc-700 rounded text-center text-sm text-white focus:border-teal-500 focus:outline-none" value={otpInput[i] || ""} onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d?$/.test(val)) {
                              const next = otpInput.split(""); next[i] = val;
                              setOtpInput(next.join(""));
                              if (val && i < 5) (e.target.parentElement?.children[i + 1] as HTMLElement)?.focus();
                            }
                          }} />
                        ))}
                      </div>
                    </div>
                    {otpValid && <span className="text-emerald-400 text-xs font-medium">✓ Verified</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900/40 border border-dashed border-zinc-800 rounded-2xl p-10 text-center">
                <DocIcon className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500 text-sm">Preview will appear here</p>
              </div>
            )}

            {/* Schedule */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-zinc-300 mb-3">Schedule follow-up</h3>
              <div className="flex gap-2">
                <input type="datetime-local" className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-teal-500/50" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} />
                <button onClick={schedule} className="text-sm bg-zinc-800 text-zinc-200 px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors font-medium">Schedule</button>
              </div>
              {scheduled.length > 0 && (
                <div className="mt-3 space-y-2">
                  {scheduled.map((s) => (
                    <div key={s.id} className="flex items-center justify-between text-sm bg-zinc-950 rounded-lg px-3 py-2 border border-zinc-800/60">
                      <span className="text-zinc-400">{new Date(s.at).toLocaleString()}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${s.status === "pending" ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"}`}>{s.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayIcon() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>; }
function PauseIcon() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>; }
function MicIcon() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="23"/></svg>; }
function SquareIcon() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12"/></svg>; }
function CheckIcon({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 5 5L20 7"/></svg>; }
function DocIcon({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>; }
