"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const SPLIT_RE = /[.\n\r,]+/;

export default function DemoPage() {
  const [subject, setSubject] = useState("Client conversation receipt");
  const [bullets, setBullets] = useState([
    "Confirm project scope",
    "3 rounds of revisions",
    "Brand assets due Friday",
  ]);
  const [amount, setAmount] = useState("99");
  const [due, setDue] = useState("");
  const [requireOtp, setRequireOtp] = useState(true);
  const [otp, setOtp] = useState(() =>
    String(Math.floor(Math.random() * 900000) + 100000)
  );
  const [clientView, setClientView] = useState<any>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [scheduleAt, setScheduleAt] = useState("");
  const [scheduled, setScheduled] = useState<
    { id: string; at: string; status: string; url: string }[]
  >([]);
  const recRef = useRef<any>(null);
  const mountedRef = useRef(true);
  const [recState, setRecState] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [demoPlaying, setDemoPlaying] = useState(false);

  const DIALOGUE = [
    {
      spk: "Sam",
      text: "Hey Taylor, quick recap of our call. We'll refresh the homepage and pricing pages and tidy the navigation.",
    },
    {
      spk: "Taylor",
      text: "Great. I'd like the first draft before the webinar if possible.",
    },
    {
      spk: "Sam",
      text: "We'll include three rounds of revisions. Please send the brand assets by Friday.",
    },
    {
      spk: "Taylor",
      text: "Done. Budget at one thousand five hundred dollars is approved.",
    },
    {
      spk: "Sam",
      text: "Perfect. Let's target next Monday for the first milestone. I'll send a conversation receipt with a one-time code for sign-off.",
    },
  ];

  const fullScript = DIALOGUE.map((d) => d.spk + ": " + d.text).join(" ");

  useEffect(() => () => { mountedRef.current = false; }, []);

  function randToken(n = 24) {
    const s =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let o = "";
    for (let i = 0; i < n; i++) o += s[Math.floor(Math.random() * s.length)];
    return o;
  }

  function formatUSD(n: string | number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(n || 0));
  }

  function bytesToDataUrl(file: File): Promise<string> {
    return new Promise((r) => {
      const fr = new FileReader();
      fr.onload = () => r(fr.result as string);
      fr.readAsDataURL(file);
    });
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await bytesToDataUrl(f);
    setFilePreview(url);
  }

  function addBullet() {
    setBullets([...bullets, ""]);
  }
  function updateBullet(i: number, v: string) {
    const n = [...bullets];
    n[i] = v;
    setBullets(n);
  }
  function removeBullet(i: number) {
    setBullets(bullets.filter((_, x) => x !== i));
  }

  function sttAvailable(): boolean {
    return typeof window !== "undefined" && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  function startVoice() {
    const SRClass = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SRClass) {
      alert("Your browser doesn't support live transcription.");
      return;
    }
    const r = new SRClass();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    r.onresult = (e: any) => {
      let t = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        t += e.results[i][0].transcript;
      }
      setTranscript(t);
    };
    r.onend = () => setRecState("idle");
    r.onerror = () => setRecState("idle");
    r.start();
    recRef.current = r;
    setRecState("recording");
  }

  function stopVoice() {
    if (recRef.current) {
      try {
        recRef.current.stop();
      } catch {}
      recRef.current = null;
    }
    setRecState("idle");
  }

  function buildReceipt(overrideBullets?: string[]) {
    return {
      token: randToken(20),
      subject,
      bullets: overrideBullets ?? bullets.filter(Boolean),
      amountUSD: amount,
      due,
      requireOtp,
      otp: requireOtp ? otp : null,
      visuals: filePreview ? [{ id: 1, url: filePreview }] : [],
      scheduled,
    };
  }

  function finalizeFromScript(script: string) {
    const lines = script
      .split(SPLIT_RE)
      .map((x) => x.trim())
      .filter(Boolean);
    setTranscript(script);
    setBullets(lines);
    setClientView({ receipt: buildReceipt(lines), state: "sent" });
  }

  function applyTranscript() {
    if (!transcript.trim()) return;
    if (bullets.some((b) => b.trim())) {
      if (!window.confirm("This will overwrite your existing bullets. Continue?")) return;
    }
    finalizeFromScript(transcript);
  }

  function sendDemo() {
    setClientView({ receipt: buildReceipt(), state: "sent" });
  }

  function scheduleVisual() {
    if (!filePreview || !scheduleAt) return;
    const s = {
      id: crypto.randomUUID(),
      at: scheduleAt,
      status: "pending",
      url: filePreview,
    };
    const next = [...scheduled, s];
    setScheduled(next);
    if (clientView)
      setClientView({
        ...clientView,
        receipt: { ...clientView.receipt, scheduled: next },
      });
  }

  function pickVoice(pref: string): SpeechSynthesisVoice | null {
    try {
      const vs: SpeechSynthesisVoice[] = window.speechSynthesis?.getVoices() ?? [];
      if (!vs.length) return null;
      const rx =
        pref === "female"
          ? /(Female|Samantha|Zira|Nova|Karen|Moira|Fiona)/i
          : /(Male|Daniel|Alex|Matthew|Arthur|Fred)/i;
      return vs.find((v) => rx.test(v.name) || rx.test(v.voiceURI)) ?? vs[0] ?? null;
    } catch {
      return null;
    }
  }

  function playDemoCall() {
    try {
      setDemoPlaying(true);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        let i = 0;
        const speakNext = () => {
          if (i >= DIALOGUE.length) {
            setDemoPlaying(false);
            finalizeFromScript(fullScript);
            return;
          }
          const seg = DIALOGUE[i++];
          const u = new SpeechSynthesisUtterance(seg.text);
          const v = pickVoice(seg.spk === "Sam" ? "male" : "female");
          if (v) u.voice = v;
          u.lang = "en-US";
          u.rate = seg.spk === "Sam" ? 1.03 : 1.0;
          u.pitch = seg.spk === "Sam" ? 1.0 : 1.1;
          u.onend = () => {
            if (!mountedRef.current) {
              window.speechSynthesis.cancel();
              return;
            }
            setTimeout(speakNext, 160);
          };
          window.speechSynthesis.speak(u);
        };
        speakNext();
      } else {
        finalizeFromScript(fullScript);
        setDemoPlaying(false);
      }
    } catch {
      setDemoPlaying(false);
      finalizeFromScript(fullScript);
    }
  }

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      let ch = false;
      const next = scheduled.map((x) => {
        if (x.status === "pending" && new Date(x.at) <= now) {
          ch = true;
          return { ...x, status: "sent" };
        }
        return x;
      });
      if (ch) {
        setScheduled(next);
        if (clientView)
          setClientView({
            ...clientView,
            receipt: { ...clientView.receipt, scheduled: next },
          });
      }
    }, 1000);
    return () => clearInterval(t);
  }, [scheduled, clientView]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            AgreeMint
          </Link>
          <Link
            href="/pricing"
            className="px-3 py-2 rounded-xl border bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
          >
            Subscribe
          </Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
          Live demo
        </h1>
        <p className="text-slate-600 mb-8">
          Experience how AgreeMint turns voice into signed client agreement receipts.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Owner pane */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Owner: voice → agreement</div>
              <span className="text-xs text-slate-500">USD pricing</span>
            </div>

            <div className="rounded-xl border p-3 bg-emerald-50/40">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className={
                    "rounded-xl border px-3 py-2 text-sm font-medium " +
                    (demoPlaying
                      ? "bg-emerald-600 text-white"
                      : "bg-white hover:bg-slate-50")
                  }
                  onClick={playDemoCall}
                  disabled={demoPlaying}
                >
                  {demoPlaying ? "Playing demo…" : "Play demo call"}
                </button>
                <button
                  className={
                    "rounded-xl border px-3 py-2 text-sm font-medium " +
                    (recState === "recording"
                      ? "bg-emerald-600 text-white"
                      : "bg-white hover:bg-slate-50")
                  }
                  onClick={recState === "recording" ? stopVoice : startVoice}
                >
                  {recState === "recording" ? "Stop" : "Start"} live voice
                </button>
                <button
                  className="rounded-xl border px-3 py-2 text-sm font-medium bg-white hover:bg-slate-50"
                  onClick={applyTranscript}
                  disabled={!transcript.trim()}
                >
                  Insert into bullets
                </button>
              </div>
              <textarea
                aria-label="Transcript"
                className="w-full rounded-lg border border-emerald-200 px-3 py-2 mt-3 text-sm"
                rows={4}
                placeholder="Live transcript or demo text appears here…"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />
              <p className="text-xs text-slate-600 mt-1">
                Play the prepared call or speak live; we'll generate the receipt.
              </p>
            </div>

            <div className="grid gap-3 text-sm mt-4">
              <label>
                Subject
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 mt-1"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </label>

              <div>
                <div className="mb-1">Bullets</div>
                <div className="space-y-2">
                  {bullets.map((b, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2"
                        value={b}
                        onChange={(e) => updateBullet(i, e.target.value)}
                      />
                      <button
                        className="rounded-xl border px-3 py-2 bg-white hover:bg-slate-50 text-sm"
                        onClick={() => removeBullet(i)}
                      >
                        −
                      </button>
                    </div>
                  ))}
                  <button
                    className="rounded-xl border px-3 py-2 bg-white hover:bg-slate-50 text-sm"
                    onClick={addBullet}
                  >
                    + Add bullet
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label>
                  Amount ({formatUSD(amount)})
                  <input
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 mt-1"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </label>
                <label>
                  Due date
                  <input
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 mt-1"
                    type="date"
                    value={due}
                    onChange={(e) => setDue(e.target.value)}
                  />
                </label>
              </div>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={requireOtp}
                  onChange={(e) => setRequireOtp(e.target.checked)}
                />
                Require OTP on client ack
              </label>

              {requireOtp && (
                <label>
                  OTP
                  <input
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 mt-1 font-mono text-lg tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </label>
              )}

              <div className="border rounded-xl p-3">
                <div className="font-medium mb-2">
                  Visual attachment & scheduled delivery
                </div>
                <input type="file" accept="image/*" onChange={handleFile} />
                {filePreview && (
                  <div className="mt-3 grid md:grid-cols-2 gap-3 items-start">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={filePreview}
                      loading="lazy"
                      alt="visual attachment for client sign-off"
                      className="rounded-lg border max-h-40 object-contain"
                    />
                    <div>
                      <label>
                        Send at
                        <input
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 mt-1"
                          type="datetime-local"
                          value={scheduleAt}
                          onChange={(e) => setScheduleAt(e.target.value)}
                        />
                      </label>
                      <button
                        className="rounded-xl border px-3 py-2 bg-white hover:bg-slate-50 mt-2 text-sm"
                        onClick={scheduleVisual}
                      >
                        Schedule
                      </button>
                      <div className="text-xs text-slate-600 mt-2">
                        {scheduled.length
                          ? scheduled
                              .map(
                                (x) =>
                                  `${new Date(x.at).toLocaleString()} (${x.status})`
                              )
                              .join(", ")
                          : "No schedules yet"}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                className="inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium shadow-sm bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={sendDemo}
              >
                Send receipt
              </button>
            </div>
          </div>

          {/* Client pane */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="font-semibold mb-2">Client: signing preview</div>
            {!clientView && (
              <div className="text-slate-500 text-sm text-center py-12">
                No receipt yet. Click "Play demo call" or "Send receipt" to preview
                what your client sees.
              </div>
            )}
            {clientView && (
              <div className="text-sm">
                <div className="text-xl font-semibold mb-2">
                  {clientView.receipt.subject}
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {clientView.receipt.bullets.map((b: string, i: number) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <div className="mt-3">
                  Amount: <b>{formatUSD(clientView.receipt.amountUSD)}</b>
                  {clientView.receipt.due && (
                    <span className="text-slate-500">
                      {" "}
                      · Due {clientView.receipt.due}
                    </span>
                  )}
                </div>

                {clientView.receipt.visuals?.length > 0 && (
                  <div className="mt-3">
                    <div className="font-medium mb-1">Attached visual</div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={clientView.receipt.visuals[0].url}
                      loading="lazy"
                      alt="attachment"
                      className="rounded-lg border max-h-40 object-contain"
                    />
                  </div>
                )}

                {clientView.state === "sent" && (
                  <div className="mt-4 flex gap-2 items-center">
                    {clientView.receipt.requireOtp && (
                      <input
                        placeholder="Enter OTP"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        onChange={(e) => (clientView.otpInput = e.target.value)}
                      />
                    )}
                    <button
                      className="rounded-xl border px-3 py-2 bg-white hover:bg-slate-50 text-sm"
                      onClick={() => {
                        if (
                          clientView.receipt.requireOtp &&
                          clientView.otpInput !== clientView.receipt.otp
                        ) {
                          alert("Incorrect OTP. Please check the code and try again.");
                          return;
                        }
                        setClientView({ ...clientView, state: "ack" });
                      }}
                    >
                      Acknowledge ✅
                    </button>
                    <button
                      className="rounded-xl border px-3 py-2 bg-white hover:bg-slate-50 text-sm"
                      onClick={() =>
                        setClientView({ ...clientView, state: "disputed" })
                      }
                    >
                      Dispute
                    </button>
                  </div>
                )}

                <div className="mt-3 text-xs">
                  <span
                    className={
                      "inline-flex px-2 py-0.5 rounded-full font-medium " +
                      (clientView.state === "ack"
                        ? "bg-emerald-100 text-emerald-700"
                        : clientView.state === "disputed"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-700")
                    }
                  >
                    Status: {clientView.state === "ack" ? "Signed ✅" : clientView.state === "disputed" ? "Disputed ⚡" : clientView.state}
                  </span>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-50 border text-xs text-slate-500">
                  This is a conversation receipt — not a legally binding contract.
                  OTP provides lightweight identity confirmation. Always follow your
                  jurisdiction's rules.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
