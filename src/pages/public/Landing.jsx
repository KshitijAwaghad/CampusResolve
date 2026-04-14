import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck, Sparkles, Timer } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ThemeToggle from "../../components/ui/ThemeToggle";

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10">
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>
      <div className="pointer-events-none absolute -left-20 top-16 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-lime-300/30 blur-3xl" />

      <div className="relative mx-auto grid min-h-[88vh] max-w-7xl items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-brand-300">
            <Sparkles size={14} /> Campus Resolve
          </p>
          <h1 className="mt-5 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Campus grievance management,
            <span className="block bg-gradient-to-r from-brand-600 to-cyan-400 bg-clip-text text-transparent">smart, fast, accountable.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-600 dark:text-slate-300">
            Smart prioritization, SLA timers, escalation alerts, and role-focused command centers for every stakeholder.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login">
              <Button className="px-6 py-3 text-base">Enter Platform</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" className="px-6 py-3 text-base">Create Account</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="animate-float">
            <p className="text-xs uppercase tracking-widest text-slate-500">Active Complaints</p>
            <p className="mt-2 text-4xl font-extrabold">128</p>
            <p className="mt-1 text-sm text-emerald-600">+12% this week</p>
          </Card>
          <Card className="animate-float [animation-delay:220ms]">
            <p className="text-xs uppercase tracking-widest text-slate-500">Escalation SLA</p>
            <p className="mt-2 text-4xl font-extrabold">97%</p>
            <p className="mt-1 text-sm text-brand-600">Within deadline</p>
          </Card>
          <Card className="sm:col-span-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">What makes this smart?</p>
              <ArrowUpRight className="text-brand-600" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/80 p-3 dark:bg-slate-800/70">
                <ShieldCheck size={16} className="text-brand-600" />
                <p className="mt-2 text-sm font-semibold">AI Priority Engine</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 dark:bg-slate-800/70">
                <Timer size={16} className="text-orange-500" />
                <p className="mt-2 text-sm font-semibold">Live SLA Timer</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 dark:bg-slate-800/70">
                <Sparkles size={16} className="text-lime-600" />
                <p className="mt-2 text-sm font-semibold">Escalation Intelligence</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Landing;
