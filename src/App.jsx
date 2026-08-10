import { useState, useMemo } from "react";

const CONFIG = {
  bachelor: "Daniel",
  tagline: "Romantic. Punctual. Fully booked by Thursday.",
  price: 75,
  durationMin: 90,
  location: "Wine bar of his choosing",
  moneroAddress: "85ghUA3X2THUKkaPo8ohYu5zGvzDE5GMwCZCcJgmTcq3GTSZLAfeJfGDn9i9VJMPTmVpkvqbVE9PpEZkGbn6iU9r3Tu5cAe",
};

const TAKEN = {
  3: [{ time: "7:00 PM", by: "Paige" }],
  8: [{ time: "6:00 PM", by: "Maddie" }, { time: "8:00 PM", by: "Brooke" }],
  14: [{ time: "7:00 PM", by: "Morgan" }],
  17: [{ time: "4:00 PM", by: "Kendall" }, { time: "7:00 PM", by: "Chloe" }],
  22: [{ time: "6:00 PM", by: "Sydney" }],
};

const SLOTS = ["4:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"];
const LEADERBOARD = ["Paige", "Maddie", "Brooke", "Morgan", "Kendall", "Chloe", "Sydney"];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..900,100&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
.bd-root{--ink:#1d1b26;--paper:#fdfcfa;--rose:#c0264b;--rose-dark:#8e1236;--blush:#fbeef1;--line:#e6e1dc;--mute:#79737e;--ok:#2e7d5b;font-family:'Inter',sans-serif;color:var(--ink);background:var(--paper);min-height:100vh;display:flex;justify-content:center;padding:24px 16px 64px}
.bd-root *{box-sizing:border-box}
.bd-shell{width:100%;max-width:430px}
.bd-brand{display:flex;align-items:baseline;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:20px}
.bd-brand h1{font-family:'Fraunces',serif;font-weight:500;font-size:20px;margin:0;letter-spacing:-0.01em}
.bd-brand span{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--mute)}
.bd-card{border:1px solid var(--line);border-radius:14px;background:#fff;padding:24px}
.bd-display{font-family:'Fraunces',serif;font-weight:560;letter-spacing:-0.02em;line-height:1.05;margin:0}
.bd-eyebrow{font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:var(--rose);margin-bottom:10px}
.bd-mute{color:var(--mute);font-size:14px;line-height:1.55}
.bd-btn{width:100%;border:none;border-radius:10px;padding:14px 18px;background:var(--rose);color:#fff;font:600 15px 'Inter',sans-serif;cursor:pointer;transition:background .15s ease,transform .1s ease}
.bd-btn:hover{background:var(--rose-dark)}
.bd-btn:active{transform:scale(.985)}
.bd-btn[disabled]{background:var(--line);color:var(--mute);cursor:not-allowed}
.bd-btn.ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}
.bd-field{margin-bottom:14px}
.bd-field label{display:block;font-size:12px;font-weight:600;margin-bottom:6px}
.bd-field input,.bd-field textarea{width:100%;border:1px solid var(--line);border-radius:8px;padding:11px 12px;font:400 14px 'Inter',sans-serif;background:var(--paper)}
.bd-field input:focus,.bd-field textarea:focus{outline:2px solid var(--rose);outline-offset:0;border-color:transparent}
.bd-demand{display:flex;align-items:center;gap:8px;margin:16px 0;font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--rose-dark);background:var(--blush);border-radius:8px;padding:9px 12px}
.bd-dot{width:7px;height:7px;border-radius:50%;background:var(--rose);animation:bd-pulse 1.6s infinite}
@keyframes bd-pulse{50%{opacity:.35}}
.bd-cal{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:14px}
.bd-cal .dow{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--mute);text-align:center;padding:4px 0}
.bd-day{aspect-ratio:1;border:1px solid transparent;border-radius:9px;background:transparent;font:500 13px 'Inter',sans-serif;color:var(--ink);cursor:pointer;position:relative}
.bd-day:hover:not([disabled]){border-color:var(--rose)}
.bd-day[disabled]{color:#cfc9c4;cursor:default}
.bd-day.sel{background:var(--rose);color:#fff}
.bd-day .tick{position:absolute;bottom:5px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:var(--rose)}
.bd-day.sel .tick{background:#fff}
.bd-slot{display:flex;justify-content:space-between;align-items:center;width:100%;border:1px solid var(--line);border-radius:10px;padding:13px 14px;margin-bottom:8px;background:#fff;font:500 14px 'Inter',sans-serif;cursor:pointer}
.bd-slot:hover:not([disabled]){border-color:var(--rose)}
.bd-slot.sel{border-color:var(--rose);background:var(--blush)}
.bd-slot[disabled]{cursor:not-allowed;color:var(--mute);background:var(--paper)}
.bd-slot .who{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--mute)}
.bd-rank{list-style:none;margin:14px 0 0;padding:0}
.bd-rank li{display:flex;justify-content:space-between;padding:9px 2px;border-bottom:1px dashed var(--line);font-size:14px}
.bd-rank li span:last-child{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--mute)}
.bd-total{display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:13px;padding:10px 2px;border-top:1px solid var(--ink);margin-top:8px}
.bd-xmr-box{background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:14px;margin:14px 0;word-break:break-all;font-family:'IBM Plex Mono',monospace;font-size:11px;line-height:1.6;display:block;text-decoration:none;color:inherit}
.bd-copy-btn{width:100%;border:1px solid var(--line);border-radius:10px;padding:11px;background:transparent;color:var(--ink);font:500 13px 'IBM Plex Mono',monospace;cursor:pointer;margin-bottom:10px}
.bd-copy-btn:active{background:var(--blush)}
.bd-copy-confirm{color:var(--ok);font-family:'IBM Plex Mono',monospace;font-size:11px;text-align:center;height:16px;margin-bottom:10px}
.bd-pass{border:1px solid var(--ink);border-radius:14px;overflow:hidden}
.bd-pass-top{background:var(--ink);color:var(--paper);padding:18px 20px}
.bd-pass-top .bd-eyebrow{color:#f2a9bc;margin-bottom:4px}
.bd-pass-body{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
.bd-pass-body .k{font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--mute)}
.bd-pass-body .v{font-weight:600;font-size:14px;margin-top:2px}
.bd-perf{border-top:2px dashed var(--line);margin:0 14px}
.bd-pass-foot{padding:14px 20px;font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--mute)}
.bd-note{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--mute);text-align:center;margin-top:18px}
.bd-back{background:none;border:none;color:var(--mute);font:500 12px 'Inter',sans-serif;cursor:pointer;padding:0;margin-bottom:14px}
.bd-back:hover{color:var(--ink)}
h2.bd-display{font-size:26px;margin-bottom:6px}
`;

const MONTH = "July 2026";
const FIRST_DOW = 3;
const DAYS = 31;
const TODAY = 24;

export default function DateBooking() {
  const [step, setStep] = useState("profile");
  const [applicant, setApplicant] = useState({ name: "", pitch: "" });
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [copied, setCopied] = useState(false);
  const confirmation = useMemo(
    () => "LV-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
    []
  );
  const takenForDay = TAKEN[day] || [];
  const back = (to) => () => setStep(to);

  const copyAddress = () => {
    navigator.clipboard.writeText(CONFIG.moneroAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadICS = () => {
    const [hhmm, period] = time.split(" ");
    let hr = parseInt(hhmm.split(":")[0]);
    if (period === "PM" && hr !== 12) hr += 12;
    if (period === "AM" && hr === 12) hr = 0;
    const startHr = String(hr).padStart(2, "0");
    const endMin = hr * 60 + 90;
    const endHr = String(Math.floor(endMin / 60)).padStart(2, "0");
    const endMn = String(endMin % 60).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//datebookingcalendar//EN",
      "BEGIN:VEVENT",
      `UID:${confirmation}@datebookingcalendar.netlify.app`,
      `SUMMARY:Date with ${CONFIG.bachelor} — ${applicant.name}`,
      `DTSTART:202607${d}T${startHr}0000`,
      `DTEND:202607${d}T${endHr}${endMn}00`,
      `LOCATION:${CONFIG.location}`,
      "DESCRIPTION:No refunds. No second chances. HR is watching.",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
    a.download = `date-with-${CONFIG.bachelor.toLowerCase()}.ics`;
    a.click();
  };

  return (
    <div className="bd-root">
      <style>{css}</style>
      <div className="bd-shell">
        <header className="bd-brand">
          <h1>Reserve&nbsp;{CONFIG.bachelor}</h1>
          <span>love is dead™</span>
        </header>

        {step === "profile" && (
          <div className="bd-card">
            <div className="bd-eyebrow">Now accepting applicants</div>
            <h2 className="bd-display" style={{ fontSize: 34 }}>
              Book a date<br />with {CONFIG.bachelor}
            </h2>
            <p className="bd-mute" style={{ marginTop: 10 }}>{CONFIG.tagline}</p>
            <div className="bd-demand">
              <span className="bd-dot" />
              {LEADERBOARD.length} people booked this month — demand is high
            </div>
            <ul className="bd-rank">
              <li><span>Duration</span><span>{CONFIG.durationMin} min</span></li>
              <li><span>Venue</span><span>{CONFIG.location}</span></li>
              <li><span>Reservation fee</span><span>${CONFIG.price}.00 XMR</span></li>
            </ul>
            <div style={{ height: 18 }} />
            <button className="bd-btn" onClick={() => setStep("apply")}>
              Apply for a reservation
            </button>
          </div>
        )}

        {step === "apply" && (
          <div className="bd-card">
            <button className="bd-back" onClick={back("profile")}>← Back</button>
            <div className="bd-eyebrow">Round 1 · Application</div>
            <h2 className="bd-display">Tell {CONFIG.bachelor} why</h2>
            <p className="bd-mute" style={{ marginBottom: 16 }}>
              Applications are reviewed instantly by a rigorous process (there is no process).
            </p>
            <div className="bd-field">
              <label htmlFor="bd-name">Your name</label>
              <input id="bd-name" value={applicant.name}
                onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                placeholder="First name" />
            </div>
            <div className="bd-field">
              <label htmlFor="bd-pitch">Your opening argument</label>
              <textarea id="bd-pitch" rows={3} value={applicant.pitch}
                onChange={(e) => setApplicant({ ...applicant, pitch: e.target.value })}
                placeholder="Keep it under one restraining order" />
            </div>
            <button className="bd-btn" disabled={!applicant.name.trim()}
              onClick={() => setStep("round2")}>
              Submit application
            </button>
          </div>
        )}

        {step === "round2" && (
          <div className="bd-card" style={{ textAlign: "center", padding: "40px 24px" }}>
            <div className="bd-eyebrow">Application reviewed</div>
            <h2 className="bd-display" style={{ fontSize: 30 }}>
              Congrats, {applicant.name}!<br />You made it to the<br />second round
            </h2>
            <p className="bd-mute" style={{ margin: "14px 0 22px" }}>
              Everyone makes it to the second round. That's the business model.
            </p>
            <button className="bd-btn" onClick={() => setStep("calendar")}>
              Choose a date
            </button>
          </div>
        )}

        {step === "calendar" && (
          <div className="bd-card">
            <button className="bd-back" onClick={back("round2")}>← Back</button>
            <div className="bd-eyebrow">Round 2 · Scheduling</div>
            <h2 className="bd-display">{MONTH}</h2>
            <div className="bd-cal">
              {["S","M","T","W","T","F","S"].map((d, i) => (
                <div className="dow" key={i}>{d}</div>
              ))}
              {Array.from({ length: FIRST_DOW }).map((_, i) => <div key={"pad"+i} />)}
              {Array.from({ length: DAYS }).map((_, i) => {
                const d = i + 1;
                const past = d <= TODAY;
                const fullyTaken = (TAKEN[d] || []).length >= SLOTS.length;
                return (
                  <button key={d} disabled={past || fullyTaken}
                    className={"bd-day" + (day === d ? " sel" : "")}
                    onClick={() => { setDay(d); setTime(null); }}>
                    {d}
                    {TAKEN[d] && !past && <span className="tick" />}
                  </button>
                );
              })}
            </div>
            <p className="bd-note">· = another applicant already holds a slot that day</p>
            <div style={{ height: 12 }} />
            <button className="bd-btn" disabled={!day} onClick={() => setStep("time")}>
              {day ? `Continue — July ${day}` : "Select a day"}
            </button>
          </div>
        )}

        {step === "time" && (
          <div className="bd-card">
            <button className="bd-back" onClick={back("calendar")}>← Back</button>
            <div className="bd-eyebrow">July {day} · Select a time</div>
            <h2 className="bd-display">Available slots</h2>
            <div style={{ height: 12 }} />
            {SLOTS.map((t) => {
              const claimed = takenForDay.find((x) => x.time === t);
              return (
                <button key={t} disabled={!!claimed}
                  className={"bd-slot" + (time === t ? " sel" : "")}
                  onClick={() => setTime(t)}>
                  <span>{t}</span>
                  <span className="who">{claimed ? `taken · ${claimed.by}` : `${CONFIG.durationMin} min`}</span>
                </button>
              );
            })}
            <div style={{ height: 8 }} />
            <button className="bd-btn" disabled={!time} onClick={() => setStep("pay")}>
              Reserve {time || "a slot"}
            </button>
          </div>
        )}

        {step === "pay" && (
          <div className="bd-card">
            <button className="bd-back" onClick={back("time")}>← Back</button>
            <div className="bd-eyebrow">Final round · Payment</div>
            <h2 className="bd-display">Reserve your spot</h2>
            <ul className="bd-rank">
              <li><span>Date with {CONFIG.bachelor}</span><span>July {day}, {time}</span></li>
              <li><span>Applicant</span><span>{applicant.name}</span></li>
            </ul>
            <div className="bd-total"><span>TOTAL DUE</span><span>${CONFIG.price}.00 XMR</span></div>
            <div style={{ height: 14 }} />
            <p className="bd-mute" style={{ marginBottom: 4 }}>Send payment to this Monero address:</p>
            <a href={"monero:" + CONFIG.moneroAddress} className="bd-xmr-box">
              {CONFIG.moneroAddress}
            </a>
            <button className="bd-copy-btn" onClick={copyAddress}>
              {copied ? "✓ Copied" : "Copy address"}
            </button>
            <div className="bd-copy-confirm">{copied ? "Address copied to clipboard" : ""}</div>
            <button className="bd-btn" onClick={() => setStep("done")}>
              I've sent the payment
            </button>
            <p className="bd-note">Tap the address above to open your Monero wallet.</p>
          </div>
        )}

        {step === "done" && (
          <div>
            <div className="bd-pass">
              <div className="bd-pass-top">
                <div className="bd-eyebrow">Reservation confirmed</div>
                <h2 className="bd-display" style={{ color: "inherit", fontSize: 24 }}>
                  {applicant.name} × {CONFIG.bachelor}
                </h2>
              </div>
              <div className="bd-pass-body">
                <div><div className="k">Date</div><div className="v">July {day}, 2026</div></div>
                <div><div className="k">Time</div><div className="v">{time}</div></div>
                <div><div className="k">Venue</div><div className="v">{CONFIG.location}</div></div>
                <div><div className="k">Confirmation</div><div className="v">{confirmation}</div></div>
              </div>
              <div className="bd-perf" />
              <div className="bd-pass-foot">
                NON-REFUNDABLE · NON-TRANSFERABLE · LOVE IS DEAD
              </div>
            </div>
            <div style={{ height: 12 }} />
            <button className="bd-btn ghost" onClick={downloadICS}>
              Add to calendar (.ics)
            </button>
            <div style={{ height: 8 }} />
            <button className="bd-btn ghost" onClick={() => {
              setStep("profile"); setDay(null); setTime(null);
              setApplicant({ name: "", pitch: "" });
            }}>
              Book another applicant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
