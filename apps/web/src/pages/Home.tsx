import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Terminal, Copy, Check, LogOut, LayoutDashboard } from "lucide-react";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm install -g @vibe-code/cli");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Navigation */}
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono font-bold text-lg">
            <Terminal className="h-5 w-5" />
            <span>VIBE CODE</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-1.5"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 space-y-12 w-full">
        {/* Hero */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Build Web Apps at the Speed of Vibe
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Vibe Code is a terminal-first AI website builder. Prompt, iterate,
            and deploy using a real-time agent console inside safe sandboxed
            VMs.
          </p>
        </div>

        {/* Installation Command */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Install CLI</CardTitle>
            <CardDescription>
              Install the global package to start building from your local
              terminal.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <code className="flex-1 bg-muted p-2 rounded text-sm font-mono break-all text-left">
              npm install -g @vibe-code-cli/cli
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              title="Copy command"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>OpenTUI Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Fully interactive Terminal User Interface built on React. No
                complex configs, just beautiful UI windows directly in your
                terminal.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>E2B Sandboxing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Every website project triggers an isolated micro-virtual machine
                sandbox for secure package execution and hosting.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instant Deployment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Watch your application build live with automatic
                code-interpreter preview hooks and get production-ready
                deployments instantly.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto bg-card">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-muted-foreground space-y-2">
          <p>VIBE CODE © {new Date().getFullYear()}</p>
          <p>Powered by E2B and OpenAI.</p>
        </div>
      </footer>
    </div>
  );
}
