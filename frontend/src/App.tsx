import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { checkApiHealth } from "./api/client";

type ConnectionState = "checking" | "connected" | "offline";

function ConnectionCard() {
  const [state, setState] = useState<ConnectionState>("checking");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState("checking");
    void checkApiHealth()
      .then(() => active && setState("connected"))
      .catch(() => active && setState("offline"));
    return () => {
      active = false;
    };
  }, [attempt]);

  const label = {
    checking: "Checking connection",
    connected: "API is responding",
    offline: "API is unavailable",
  }[state];

  return (
    <section className="flex min-h-[124px] items-center justify-between gap-5 rounded-xl border border-[#dce7dc] bg-[#edf3eb] px-7 py-6 max-[620px]:flex-col max-[620px]:items-start max-[620px]:p-5" aria-labelledby="connection-title">
      <div className="flex items-center gap-[17px] max-[620px]:items-start max-[620px]:gap-3">
        <div className="grid size-[42px] shrink-0 place-items-center rounded-full border border-[#cfdfd1] bg-[#f8fbf6] max-[620px]:size-[34px]" aria-hidden="true">
          <span className={`size-[9px] rounded-full ${indicatorStyles[state]}`} />
        </div>
        <div>
          <p className="mb-1.5 text-[10px] font-bold tracking-[.13em] text-[#6d8374]">LOCAL API</p>
          <h2 id="connection-title" className="mb-1 text-base font-semibold tracking-tight text-[#172c2a]">{label}</h2>
          <p className="m-0 text-xs leading-relaxed text-[#697a70]" role="status" aria-live="polite">
            {state === "connected" && "Your backend is ready for the next setup step."}
            {state === "checking" && "Checking the Express health route…"}
            {state === "offline" && "Start the backend in its terminal, then try again."}
          </p>
        </div>
      </div>
      <button
        className="inline-flex min-h-[38px] items-center justify-center rounded-lg border border-[#cbd9ca] bg-[#f8fbf6] px-[15px] text-xs font-semibold text-[#35594c] transition-colors hover:border-[#97b8a2] hover:bg-[#fffefa] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#e09a6f] disabled:cursor-wait disabled:opacity-70 max-[620px]:ml-[46px]"
        type="button"
        onClick={() => setAttempt((value) => value + 1)}
        disabled={state === "checking"}
      >
        {state === "checking" ? "Checking…" : "Check again"}
      </button>
    </section>
  );
}

function Workspace() {
  return (
    <div className="min-h-screen bg-[#f5f5f1] font-sans text-[#172c2a]">
      <aside className="fixed inset-y-0 left-0 z-10 flex w-[248px] flex-col bg-[#172c2a] px-[18px] pt-7 pb-5 text-[#f5f5f1] max-[820px]:w-[210px] max-[620px]:static max-[620px]:h-auto max-[620px]:w-full max-[620px]:px-[18px] max-[620px]:pt-[15px] max-[620px]:pb-3" aria-label="Main navigation">
        <Link className="mb-[58px] ml-[5px] inline-flex w-fit items-center gap-[11px] max-[620px]:mb-[15px] max-[620px]:ml-0" to="/" aria-label="SalesGenie AI home">
          <span className="grid size-[34px] place-items-center rounded-[11px] bg-[#b5d3bf] text-[19px] font-bold tracking-[-1px] text-[#16463f]" aria-hidden="true">S</span>
          <span className="text-[15px] font-semibold tracking-[-.35px]">SalesGenie<span className="ml-[5px] text-[11px] font-semibold tracking-[.08em] text-[#a8c6b4]">AI</span></span>
        </Link>

        <div className="mb-3 ml-[10px] text-[10px] font-bold tracking-[.13em] text-[#91a29a] max-[620px]:hidden">WORKSPACE</div>
        <nav className="max-[620px]:flex">
          <Link className="flex min-h-[43px] items-center gap-3 rounded-lg bg-[#29403b] px-3 text-[13px] font-semibold text-[#fffefa] max-[620px]:min-h-[34px] max-[620px]:px-[10px] max-[620px]:text-xs" to="/" aria-current="page">
            <span className="size-[7px] rounded-full border border-[#a5c6b4] bg-[#a5c6b4]" aria-hidden="true" />
            Overview
          </Link>
        </nav>

        <div className="mt-auto flex items-start gap-2.5 border-t border-[#304540] px-2 pt-[14px] pb-[5px] max-[620px]:hidden">
          <span className="mt-[3px] size-[7px] rounded-full bg-[#90bda3] shadow-[0_0_0_3px_#314b40]" aria-hidden="true" />
          <div>
            <strong className="mb-1 block text-[11px] font-semibold text-[#e6ece7]">Local project</strong>
            <span className="block text-[10px] text-[#9aaba2]">Development workspace</span>
          </div>
        </div>
      </aside>

      <main className="ml-[248px] min-h-screen max-[820px]:ml-[210px] max-[620px]:ml-0">
        <header className="flex h-[66px] items-center justify-between border-b border-[#e8e9e4] bg-[#fffefa]/70 px-12 max-[820px]:px-7 max-[620px]:h-[52px] max-[620px]:px-[18px]">
          <span className="text-[11px] text-[#71807a]">Workspace <span className="px-2 text-[#b4bcb5]" aria-hidden="true">/</span> Overview</span>
          <span className="rounded-[5px] border border-[#d9e3d9] px-[9px] py-1.5 text-[9px] font-bold tracking-[.09em] text-[#54705f] max-[620px]:text-[8px]">UNIVERSITY PROJECT</span>
        </header>

        <div className="mx-auto w-full max-w-[1080px] px-12 pt-[62px] pb-7 max-[820px]:px-7 max-[820px]:pt-12 max-[620px]:px-[18px] max-[620px]:pt-9">
          <div className="mb-[34px] flex items-center justify-between gap-[30px] max-[620px]:items-start max-[620px]:gap-2.5 max-[620px]:mb-[26px]">
            <div>
              <p className="mb-3 text-[10px] font-bold tracking-[.13em] text-[#126d63]">SALES WORKSPACE</p>
              <h1 className="mb-[13px] max-w-[580px] text-[clamp(30px,3.3vw,43px)] leading-[1.1] font-medium tracking-[-1.65px] text-[#172c2a] max-[620px]:text-[32px] max-[620px]:tracking-[-1.2px]">
                Good work starts with the right customer.
              </h1>
              <p className="mb-0 max-w-[520px] text-sm leading-[1.7] text-[#6d7975] max-[620px]:text-[13px]">
                Build a clear customer profile, find promising leads, and review every message before it goes out.
              </p>
            </div>
            <div className="relative size-[116px] shrink-0 rounded-full border border-[#dfe7de] max-[820px]:size-[86px] max-[620px]:mt-[5px] max-[620px]:size-[55px]" aria-hidden="true">
              <span className="absolute inset-3 rounded-full border border-[#e2e9e1] max-[620px]:inset-[7px]" />
              <span className="absolute inset-[25px] rounded-full border border-[#d7e4d9] max-[820px]:inset-[18px] max-[620px]:inset-[14px]" />
              <span className="absolute top-1/2 left-1/2 h-px w-[34px] origin-left -rotate-90 bg-[#91b4a0] max-[820px]:w-[25px] max-[620px]:w-[17px]" />
              <span className="absolute top-1/2 left-1/2 h-px w-[34px] origin-left rotate-[30deg] bg-[#91b4a0] max-[820px]:w-[25px] max-[620px]:w-[17px]" />
              <span className="absolute top-1/2 left-1/2 h-px w-[34px] origin-left rotate-[150deg] bg-[#91b4a0] max-[820px]:w-[25px] max-[620px]:w-[17px]" />
              <span className="absolute top-1/2 left-1/2 size-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#126d63] shadow-[0_0_0_5px_#e2eee4] max-[620px]:size-[6px] max-[620px]:shadow-[0_0_0_3px_#e2eee4]" />
            </div>
          </div>

          <ConnectionCard />

          <section className="mt-[49px] max-[620px]:mt-9" aria-labelledby="workflow-title">
            <div className="mb-4 flex items-end justify-between gap-5 max-[620px]:items-start max-[620px]:flex-col max-[620px]:gap-2">
              <div>
                <p className="mb-2 text-[10px] font-bold tracking-[.13em] text-[#126d63]">THE WORKFLOW</p>
                <h2 id="workflow-title" className="m-0 text-xl font-semibold tracking-[-.5px] text-[#172c2a]">One step at a time</h2>
              </div>
              <span className="mb-0.5 text-[11px] text-[#87918a] max-[820px]:max-w-[180px] max-[820px]:text-right max-[620px]:max-w-none max-[620px]:text-left">Feature screens will arrive as each part is built.</span>
            </div>
            <ol className="m-0 list-none rounded-[10px] border border-[#e5e8e1] bg-[#fffefa] p-0">
              <li className="grid min-h-[77px] grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-[14px] px-5 py-[13px] max-[620px]:grid-cols-[28px_minmax(0,1fr)] max-[620px]:gap-2 max-[620px]:px-3">
                <span className="text-[11px] font-bold tracking-[.06em] text-[#88a795]">01</span>
                <div><strong className="mb-1 block text-xs font-semibold text-[#263c35]">Define your customer</strong><span className="block text-[11px] text-[#849088] max-[620px]:leading-relaxed">Business profile and ideal customer profile</span></div>
                <span className="rounded bg-[#e8f1e8] px-[7px] py-[5px] text-[8px] font-extrabold tracking-[.1em] text-[#41735a] max-[620px]:col-start-2 max-[620px]:justify-self-start">UP NEXT</span>
              </li>
              <li className="grid min-h-[77px] grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-[14px] border-t border-[#edf0ea] px-5 py-[13px] max-[620px]:grid-cols-[28px_minmax(0,1fr)] max-[620px]:gap-2 max-[620px]:px-3">
                <span className="text-[11px] font-bold tracking-[.06em] text-[#88a795]">02</span>
                <div><strong className="mb-1 block text-xs font-semibold text-[#263c35]">Find the right leads</strong><span className="block text-[11px] text-[#849088] max-[620px]:leading-relaxed">Evidence based matching and qualification</span></div>
                <span className="rounded bg-[#f1f2ef] px-[7px] py-[5px] text-[8px] font-extrabold tracking-[.1em] text-[#8b948d] max-[620px]:col-start-2 max-[620px]:justify-self-start">LATER</span>
              </li>
              <li className="grid min-h-[77px] grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-[14px] border-t border-[#edf0ea] px-5 py-[13px] max-[620px]:grid-cols-[28px_minmax(0,1fr)] max-[620px]:gap-2 max-[620px]:px-3">
                <span className="text-[11px] font-bold tracking-[.06em] text-[#88a795]">03</span>
                <div><strong className="mb-1 block text-xs font-semibold text-[#263c35]">Review before outreach</strong><span className="block text-[11px] text-[#849088] max-[620px]:leading-relaxed">Grounded drafts and simulated replies</span></div>
                <span className="rounded bg-[#f1f2ef] px-[7px] py-[5px] text-[8px] font-extrabold tracking-[.1em] text-[#8b948d] max-[620px]:col-start-2 max-[620px]:justify-self-start">LATER</span>
              </li>
            </ol>
          </section>

          <footer className="mt-11 flex justify-between border-t border-[#e6e9e2] pt-4 text-[10px] text-[#919a93] max-[620px]:mt-8">
            <span>SalesGenie AI</span><span>Local development build</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

function MissingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-[30px] text-center">
      <span className="mb-7 grid size-[34px] place-items-center rounded-[11px] bg-[#b5d3bf] text-[19px] font-bold text-[#16463f]" aria-hidden="true">S</span>
      <p className="mb-2.5 text-[10px] font-bold tracking-[.13em] text-[#126d63]">PAGE NOT FOUND</p>
      <h1 className="mb-[22px] text-[29px] font-semibold tracking-[-.8px]">This page isn’t here yet.</h1>
      <Link className="inline-flex min-h-[38px] items-center justify-center rounded-lg bg-[#126d63] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#0d514b] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#e09a6f]" to="/">Return to overview</Link>
    </main>
  );
}

const indicatorStyles: Record<ConnectionState, string> = {
  checking: "bg-[#b78a47] shadow-[0_0_0_4px_#f4ead3]",
  connected: "bg-[#27866e] shadow-[0_0_0_4px_#dceee0]",
  offline: "bg-[#bc6b53] shadow-[0_0_0_4px_#f6e4d8]",
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Workspace />} />
        <Route path="*" element={<MissingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
