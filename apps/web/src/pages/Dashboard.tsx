import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/errors";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setErrorMsg(null);
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>
            Welcome to your protected user dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                User ID
              </span>
              <span className="text-sm font-mono break-all">{user?.id}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                User Email
              </span>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
          </div>

          {errorMsg && (
            <div className="text-sm font-medium text-destructive">
              {errorMsg}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Log Out"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
