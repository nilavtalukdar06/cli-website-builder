import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";

export default function BillingSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-sidebar">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl">Subscription Activated!</CardTitle>
          <CardDescription>
            Welcome to the Pro plan. You now have unlimited credits for
            generating apps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 space-y-2 text-left">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Plan
              </span>
              <span className="text-sm font-medium">Pro</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Credits
              </span>
              <span className="text-sm font-medium">Unlimited</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
