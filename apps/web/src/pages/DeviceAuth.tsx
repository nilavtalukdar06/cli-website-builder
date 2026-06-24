import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { apiClient } from "../api/client";
import { getErrorMessage } from "../utils/errors";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { CheckCircle2, ShieldAlert } from "lucide-react";

const deviceAuthSchema = z.object({
  userCode: z
    .string()
    .min(1, "User code is required")
    .transform((val) => val.trim().toUpperCase()),
});

type DeviceAuthInputs = z.infer<typeof deviceAuthSchema>;

export default function DeviceAuth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const queryCode = searchParams.get("code") || searchParams.get("userCode") || "";

  const form = useForm<DeviceAuthInputs>({
    resolver: zodResolver(deviceAuthSchema),
    defaultValues: {
      userCode: queryCode,
    },
  });

  // Pre-fill if code query parameter changes
  useEffect(() => {
    if (queryCode) {
      form.setValue("userCode", queryCode.toUpperCase());
    }
  }, [queryCode, form]);

  const onSubmit = async (values: DeviceAuthInputs) => {
    setErrorMsg(null);
    setSubmitting(true);
    try {
      await apiClient.post("/device/authorize", {
        userCode: values.userCode,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-sidebar">
        <Card className="w-full max-w-md border-emerald-500/20 bg-card/50 backdrop-blur-md shadow-xl animate-fade-in">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 animate-bounce">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Device Authorized
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Your CLI client is now linked to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center text-sm py-4">
            <p className="text-muted-foreground leading-relaxed">
              You can now safely return to your command line interface. The website builder CLI is authenticated and ready to create, build, and deploy your projects.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/40 pt-6">
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-sidebar">
      <Card className="w-full max-w-md border-border/40 bg-card/50 backdrop-blur-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Authorize CLI</CardTitle>
          <CardDescription>
            Enter the authorization code displayed in your terminal window.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="XXXX-XXXX"
                        className="font-mono text-center text-lg tracking-widest uppercase py-6"
                        maxLength={9}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMsg && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive animate-pulse">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <Button type="submit" className="w-full py-5 text-base" disabled={submitting}>
                {submitting ? "Authorizing..." : "Authorize Device"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/40 pt-4">
          <p className="text-xs text-muted-foreground">
            Make sure you are logged in to the correct account.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
