import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import {
  Terminal,
  Copy,
  Check,
  Code,
  Sparkles,
  Cpu,
  Globe,
  ArrowRight,
  Zap,
  BookOpen,
  RotateCcw,
  ChevronRight,
  Shield,
  Layers3,
} from "lucide-react";

// Package Manager commands
const INSTALL_COMMANDS = {
  npm: "npm install -g @vibe-code/cli",
  bun: "bun add -g @vibe-code/cli",
  pnpm: "pnpm add -g @vibe-code/cli",
  yarn: "yarn global add @vibe-code/cli",
  npx: "npx @vibe-code/cli",
};

type PackageManager = keyof typeof INSTALL_COMMANDS;

// Terminal simulation script step structure
interface TerminalStep {
  text: string;
  delay: number; // ms delay before typing/showing this line
  isInput?: boolean; // if true, animate typing character by character
  type?: "input" | "success" | "warning" | "info" | "normal";
}

const TERMINAL_SCRIPT: TerminalStep[] = [
  {
    text: "npm install -g @vibe-code/cli",
    delay: 800,
    isInput: true,
    type: "input",
  },
  { text: "✔ Installed @vibe-code/cli v1.0.0", delay: 600, type: "success" },
  { text: "vibecode", delay: 800, isInput: true, type: "input" },
  { text: "====================================", delay: 200, type: "normal" },
  { text: "🚀 Vibe Code CLI v1.0.0", delay: 100, type: "info" },
  { text: "Waiting for device authorization...", delay: 200, type: "normal" },
  {
    text: "Open: http://localhost:3000/device?code=ABCD-EFGH",
    delay: 300,
    type: "info",
  },
  { text: "✔ Device Authorized successfully!", delay: 1000, type: "success" },
  { text: "====================================", delay: 100, type: "normal" },
  {
    text: "? Describe the website you want to build:",
    delay: 400,
    type: "normal",
  },
  {
    text: "Build a beautiful landing page for a coffee shop with a dark neon vibe and a booking form.",
    delay: 500,
    isInput: true,
    type: "input",
  },
  { text: "⌛ Starting agent execution turn...", delay: 600, type: "info" },
  {
    text: "✔ Created safe container VM [e2b-sandbox-cafe]",
    delay: 800,
    type: "success",
  },
  {
    text: "✔ Wrote file: src/index.html (HTML5 template)",
    delay: 400,
    type: "success",
  },
  {
    text: "✔ Wrote file: src/style.css (Tailwind & custom styling)",
    delay: 400,
    type: "success",
  },
  {
    text: "✔ Running command: npm install Lucide Icons...",
    delay: 600,
    type: "info",
  },
  {
    text: "✔ Active compilation preview server started",
    delay: 300,
    type: "success",
  },
  {
    text: "🔗 Live Preview URL: https://e2b-sandbox-cafe.e2b.dev",
    delay: 400,
    type: "success",
  },
  { text: "====================================", delay: 200, type: "normal" },
  {
    text: "Done! Describe edits or press Ctrl+C to quit.",
    delay: 500,
    type: "success",
  },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Install command selection
  const [activePm, setActivePm] = useState<PackageManager>("npm");
  const [copied, setCopied] = useState(false);

  // Terminal Simulator states
  const [terminalLines, setTerminalLines] = useState<
    Array<{ text: string; type: string }>
  >([]);
  const [currentTypingText, setCurrentTypingText] = useState("");
  const [simRunning, setSimRunning] = useState(true);
  const [simKey, setSimKey] = useState(0); // to reset simulator

  // Documentation sections state
  const [activeDocTab, setActiveDocTab] = useState<
    "quickstart" | "commands" | "sandbox" | "shortcuts" | "pricing"
  >("quickstart");

  // Handle Command Copy
  const handleCopy = () => {
    navigator.clipboard.writeText(INSTALL_COMMANDS[activePm]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Terminal simulator execution
  useEffect(() => {
    if (!simRunning) return;

    let isMounted = true;
    setTerminalLines([]);
    setCurrentTypingText("");

    const runScript = async () => {
      // Small pause at the start
      await new Promise((r) => setTimeout(r, 600));

      for (let i = 0; i < TERMINAL_SCRIPT.length; i++) {
        if (!isMounted) return;
        const step = TERMINAL_SCRIPT[i];

        if (step.isInput) {
          // Animate character typing
          const promptChar = step.type === "input" && i > 2 ? "> " : "$ ";
          let typed = "";
          for (let c = 0; c < step.text.length; c++) {
            if (!isMounted) return;
            typed += step.text[c];
            setCurrentTypingText(promptChar + typed);
            await new Promise((r) => setTimeout(r, 30 + Math.random() * 25));
          }
          // Push completed input line
          setTerminalLines((prev) => [
            ...prev,
            { text: promptChar + step.text, type: "input" },
          ]);
          setCurrentTypingText("");
        } else {
          // Just show the line after delay
          await new Promise((r) => setTimeout(r, step.delay));
          if (!isMounted) return;
          setTerminalLines((prev) => [
            ...prev,
            { text: step.text, type: step.type || "normal" },
          ]);
        }
      }
    };

    runScript();

    return () => {
      isMounted = false;
    };
  }, [simRunning, simKey]);

  const restartSimulation = () => {
    setSimKey((prev) => prev + 1);
    setSimRunning(true);
  };

  return (
    <div className="dark bg-[#030014] text-slate-100 min-h-screen font-sans antialiased overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-200">
      {/* Background Glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[5%] w-[450px] h-[450px] rounded-full bg-fuchsia-600/10 blur-[130px]" />
        <div className="absolute top-[40%] left-[20%] w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5 bg-[#030014]/70 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-75 blur group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-[#090714] p-1.5 rounded-lg border border-white/10 flex items-center justify-center">
                <Terminal className="h-5 w-5 text-violet-400" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-violet-300">
              VIBE CODE
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#install"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Installation
            </a>
            <a
              href="#documentation"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Documentation
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/20 border border-violet-500/30 transition-all duration-300 px-5 rounded-lg text-sm"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Button
                  onClick={() => navigate("/signup")}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/20 border border-violet-500/30 transition-all duration-300 px-5 rounded-lg text-sm"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-300 text-xs font-semibold tracking-wide">
              <Sparkles className="h-3.5 w-3.5" />
              <span>The Future of Terminal-First Web Building</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Build Web Apps
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 drop-shadow-md">
                At the Speed of Vibe.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Vibe Code is a terminal-based AI website builder. Prompt, iterate,
              and deploy using a real-time agent console running on React and
              OpenTUI inside safe sandboxed VMs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a href="#documentation">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 shadow-xl shadow-violet-600/20 border border-violet-500/40 px-8 py-6 text-base rounded-xl transition-all duration-300">
                  <BookOpen className="mr-2.5 h-5 w-5 text-violet-200" />
                  Read Documentation
                </Button>
              </a>
              <a href="#install">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-white font-medium px-8 py-6 text-base rounded-xl transition-all duration-300"
                >
                  <Terminal className="mr-2.5 h-5 w-5 text-slate-400" />
                  Install CLI
                </Button>
              </a>
            </div>

            <div className="flex justify-center lg:justify-start items-center gap-8 pt-4 text-slate-500 text-sm">
              <div className="flex items-center gap-1.5">
                <Zap className="h-4.5 w-4.5 text-amber-500" />
                <span>Zero configuration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-4.5 w-4.5 text-emerald-500" />
                <span>Isolated E2B Sandboxes</span>
              </div>
            </div>
          </div>

          {/* Right Column: Terminal Simulation */}
          <div className="lg:col-span-6 w-full max-w-xl mx-auto lg:max-w-none">
            <div className="relative group">
              {/* Outer Glow wrapper */}
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-20 blur-xl group-hover:opacity-30 transition duration-1000" />

              {/* Terminal Box */}
              <div className="relative rounded-xl border border-white/10 bg-[#070512] shadow-2xl overflow-hidden font-mono text-xs sm:text-sm text-slate-300 flex flex-col h-[380px] sm:h-[420px]">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#0B0A1A] border-b border-white/5 select-none">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold tracking-wider flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-slate-600" />
                    vibecode-session
                  </span>
                  <button
                    onClick={restartSimulation}
                    className="p-1 rounded bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    title="Replay Simulation"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Terminal Content */}
                <div className="flex-1 p-4 overflow-y-auto space-y-2 flex flex-col justify-start align-left text-left min-h-0 select-text">
                  {terminalLines.map((line, idx) => {
                    let colorClass = "text-slate-300";
                    if (line.type === "input")
                      colorClass = "text-violet-300 font-semibold";
                    else if (line.type === "success")
                      colorClass = "text-emerald-400";
                    else if (line.type === "warning")
                      colorClass = "text-amber-400";
                    else if (line.type === "info") colorClass = "text-sky-400";

                    return (
                      <div
                        key={idx}
                        className={`whitespace-pre-wrap ${colorClass}`}
                      >
                        {line.text}
                      </div>
                    );
                  })}

                  {/* Current typing text */}
                  {currentTypingText && (
                    <div className="text-violet-300 font-semibold whitespace-pre-wrap flex items-center">
                      <span>{currentTypingText}</span>
                      <span className="w-2 h-4 ml-1 bg-violet-400 animate-pulse inline-block" />
                    </div>
                  )}

                  {/* Idle/Finished cursor */}
                  {!currentTypingText && (
                    <div className="text-slate-500 flex items-center">
                      <span>$ </span>
                      <span className="w-2 h-4 ml-1 bg-slate-500 animate-pulse inline-block" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLI Installation Command Section */}
      <section
        id="install"
        className="border-t border-white/5 bg-[#05030e]/40 py-20 relative"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Install the Vibe Code CLI
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg">
              Get up and running with a single global terminal command. Supports
              all major package managers.
            </p>
          </div>

          {/* Interactive Install Box */}
          <div className="max-w-xl mx-auto">
            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-[#0B0A1A] p-1.5 rounded-t-xl gap-1">
              {(Object.keys(INSTALL_COMMANDS) as PackageManager[]).map((pm) => (
                <button
                  key={pm}
                  onClick={() => {
                    setActivePm(pm);
                    setCopied(false);
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activePm === pm
                      ? "bg-violet-600/20 text-violet-300 border border-violet-500/20 shadow-inner"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>

            {/* Code Line */}
            <div className="flex items-center justify-between bg-[#080712] border-x border-b border-white/10 p-4 rounded-b-xl font-mono text-sm sm:text-base relative group">
              <span className="text-violet-400 pr-4 select-none">$</span>
              <span className="flex-1 text-left text-slate-100 break-all select-all font-medium">
                {INSTALL_COMMANDS[activePm]}
              </span>
              <button
                onClick={handleCopy}
                className="ml-4 p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                title="Copy Command"
              >
                {copied ? (
                  <Check className="h-4.5 w-4.5 text-emerald-400 animate-scale-in" />
                ) : (
                  <Copy className="h-4.5 w-4.5 text-slate-400 group-hover:scale-105 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="py-24 border-t border-white/5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16"
      >
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            Designed for Developers Who Value Speed
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Vibe Code bridges the gap between AI generation and absolute
            developer terminal control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="relative rounded-xl border border-white/5 bg-[#090715]/60 p-8 space-y-5 hover:border-violet-500/20 hover:bg-[#0c0a1f]/80 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">OpenTUI Dashboard</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Fully interactive Terminal User Interface built on React. No
              complex configs, just beautiful UI windows directly in your SSH,
              shell, or default terminal.
            </p>
          </div>

          {/* Card 2 */}
          <div className="relative rounded-xl border border-white/5 bg-[#090715]/60 p-8 space-y-5 hover:border-fuchsia-500/20 hover:bg-[#0c0a1f]/80 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-lg bg-fuchsia-600/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">E2B Sandboxing</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every website project triggers an isolated micro-virtual machine
              sandbox. Safe, secure package execution, preview hosting, and
              environment setup.
            </p>
          </div>

          {/* Card 3 */}
          <div className="relative rounded-xl border border-white/5 bg-[#090715]/60 p-8 space-y-5 hover:border-indigo-500/20 hover:bg-[#0c0a1f]/80 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Instant Deployment</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Watch your application build live with automatic code-interpreter
              preview hooks. Get production-ready code with complete static
              server deployment instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Documentation Panel */}
      <section
        id="documentation"
        className="border-t border-white/5 bg-[#05030f]/60 py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
              Documentation & Guides
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Learn how to configure, authenticate, and use the Vibe Code CLI to
              build projects.
            </p>
          </div>

          {/* Doc Panel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Doc Sidebar */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 p-1.5 bg-[#0B0A1A] border border-white/5 rounded-xl">
              {[
                {
                  id: "quickstart",
                  label: "Quick Start Guide",
                  icon: Sparkles,
                },
                { id: "commands", label: "Commands & Execution", icon: Code },
                { id: "sandbox", label: "E2B & Sandboxing", icon: Layers3 },
                { id: "shortcuts", label: "TUI Shortcuts", icon: Terminal },
                { id: "pricing", label: "Credits & Billing", icon: Zap },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const active = activeDocTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDocTab(tab.id as any)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg text-left whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                      active
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/10 border border-violet-500/30"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <TabIcon
                      className={`h-4.5 w-4.5 ${active ? "text-white" : "text-slate-500"}`}
                    />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Right Doc Main Display */}
            <div className="lg:col-span-8 bg-[#090715]/40 border border-white/5 rounded-2xl p-6 sm:p-8 text-left min-h-[380px] shadow-lg flex flex-col justify-between">
              {activeDocTab === "quickstart" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>Quick Start Guide</span>
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Follow these steps to write and execute code in Vibe Code
                      instantly.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/20 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        1
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">
                          Install the CLI client
                        </h4>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          Install the module globally:{" "}
                          <code className="bg-[#0B0A1A] border border-white/10 px-1.5 py-0.5 rounded text-violet-400 font-mono text-[11px]">
                            npm install -g @vibe-code/cli
                          </code>
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/20 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        2
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">
                          Log in and Authenticate
                        </h4>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          Run{" "}
                          <code className="bg-[#0B0A1A] border border-white/10 px-1.5 py-0.5 rounded text-violet-400 font-mono text-[11px]">
                            vibecode
                          </code>
                          . If not authenticated, the CLI prints an
                          authorization URL and opens it in your default
                          browser. Enter or confirm the OTP code.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/20 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        3
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">
                          Prompt & Create
                        </h4>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          Provide your initial website prompt. The streaming
                          agent constructs the sandbox, designs files, and
                          returns a live sandbox deployment link!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDocTab === "commands" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">
                      Commands & Environment
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Vibe Code CLI can be launched with options to toggle
                      endpoint parameters.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-[#0B0A1A] border border-white/5 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="font-mono text-violet-300 text-xs font-semibold">
                          vibecode
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Default Mode
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Launches the interactive OpenTUI application client.
                        Automatically loads cached credentials from{" "}
                        <code className="bg-white/5 border border-white/5 px-1 py-0.5 rounded font-mono text-[11px]">
                          ~/.vibecode/auth.json
                        </code>
                        .
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-[#0B0A1A] border border-white/5 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="font-mono text-violet-300 text-xs font-semibold">
                          API_URL=http://... vibecode
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Environment Variable Override
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Redirects CLI connection requests to a custom local or
                        hosted server instance instead of default portal
                        routing.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeDocTab === "sandbox" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">
                      E2B Isolated VM Runtime
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Every code build task runs inside an isolated E2B Sandbox
                      environment.
                    </p>
                  </div>

                  <div className="space-y-4 text-sm text-slate-400 space-y-3 leading-relaxed">
                    <p className="text-xs">
                      <strong className="text-white">Why E2B?</strong> Rather
                      than interpreting code locally on your development machine
                      (which poses security risks and configuration issues), the
                      agent provisions dockerized virtual sandboxes on E2B cloud
                      nodes.
                    </p>
                    <p className="text-xs">
                      <strong className="text-white">Live Execution:</strong>{" "}
                      The agent can install packages (npm/bun), write
                      configurations, and boot live HTTP preview servers. The
                      live URL connects back instantly to your terminal screen.
                    </p>
                    <p className="text-xs">
                      <strong className="text-white">Project Files:</strong>{" "}
                      File configurations and directories generated during the
                      multi-turn session are persistent inside that sandbox as
                      long as the prompt builder session remains active.
                    </p>
                  </div>
                </div>
              )}

              {activeDocTab === "shortcuts" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">
                      TUI Workspace Controls
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      OpenTUI intercepts specific bindings to control screen
                      layouts. Here are the key combinations:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B0A1A] border border-white/5">
                      <span className="text-xs text-slate-300 font-semibold">
                        Enter
                      </span>
                      <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px] shadow-sm">
                        Send Prompt
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B0A1A] border border-white/5">
                      <span className="text-xs text-slate-300 font-semibold">
                        Tab
                      </span>
                      <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px] shadow-sm">
                        Switch focus
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B0A1A] border border-white/5">
                      <span className="text-xs text-slate-300 font-semibold">
                        Esc
                      </span>
                      <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px] shadow-sm">
                        Unfocus inputs
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B0A1A] border border-white/5">
                      <span className="text-xs text-slate-300 font-semibold">
                        Ctrl + C
                      </span>
                      <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px] shadow-sm">
                        Exit CLI
                      </kbd>
                    </div>
                  </div>
                </div>
              )}

              {activeDocTab === "pricing" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">
                      Credits & Subscription Management
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Understand how usage counts work and how you can manage
                      premium quotas.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
                    <p>
                      Each agent run requires execution resources (LLM
                      completion calls and sandbox host uptime). Active accounts
                      receive initial credits.
                    </p>
                    <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-600/5 text-violet-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          Out of Credits?
                        </h4>
                        <p className="text-slate-400 text-xs">
                          Upgrade to the Pro tier for unlimited builds and
                          priority sandboxes.
                        </p>
                      </div>
                      <Link to="/signup" className="shrink-0">
                        <Button className="bg-violet-600 text-white hover:bg-violet-500 text-xs font-semibold px-4 rounded-lg">
                          Upgrade Account
                          <ChevronRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                    <p>
                      Already subscibed? Log in, navigate to your dashboard, and
                      select{" "}
                      <strong className="text-white">
                        Manage Subscription
                      </strong>{" "}
                      to launch the Stripe portal to cancel, review billing
                      history, or update payment information.
                    </p>
                  </div>
                </div>
              )}

              {/* Doc Footer */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 mt-6">
                <span>Looking for advanced deployment guides?</span>
                <a
                  href="#install"
                  className="text-violet-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  Go to top
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#02010a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="h-4 w-4 text-violet-400" />
            <span className="text-sm font-semibold tracking-wider">
              VIBE CODE © {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs text-slate-600">
            State-of-the-art AI terminal builder powered by E2B and OpenAI.
          </p>
          <div className="flex gap-6 text-xs text-slate-400 font-medium">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#install" className="hover:text-white transition-colors">
              Install
            </a>
            <a
              href="#documentation"
              className="hover:text-white transition-colors"
            >
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
