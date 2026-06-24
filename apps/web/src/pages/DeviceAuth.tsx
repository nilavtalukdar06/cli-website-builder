import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { apiClient } from "../api/client";
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
    .min(9, "Please enter all 8 characters")
    .max(9, "Code must be 8 characters")
    .transform((val) => val.trim().toUpperCase()),
});

type DeviceAuthInputs = z.infer<typeof deviceAuthSchema>;

export default function DeviceAuth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(8).fill(""));

  const queryCode =
    searchParams.get("code") || searchParams.get("userCode") || "";

  const form = useForm<DeviceAuthInputs>({
    resolver: zodResolver(deviceAuthSchema),
    defaultValues: {
      userCode: "",
    },
  });

  // Pre-fill OTP fields if query parameter code is provided
  useEffect(() => {
    if (queryCode) {
      const cleaned = queryCode
        .replace(/[^A-Z0-9]/gi, "")
        .slice(0, 8)
        .toUpperCase();
      const codeArray = cleaned.split("").concat(Array(8).fill("")).slice(0, 8);
      setOtp(codeArray);
    }
  }, [queryCode]);

  // Sync OTP state array into form userCode input (e.g. XXXX-XXXX)
  useEffect(() => {
    const formattedCode =
      otp.slice(0, 4).join("") + "-" + otp.slice(4, 8).join("");
    form.setValue("userCode", formattedCode, { shouldValidate: true });
  }, [otp, form]);

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

  // Auto-submit when all fields are complete and valid
  useEffect(() => {
    const isFullyFilled = otp.every((c) => c !== "");
    if (isFullyFilled && !submitting && !isSuccess && !errorMsg) {
      form.handleSubmit(onSubmit)();
    }
  }, [otp, submitting, isSuccess, errorMsg]);

  const handleChange = (val: string, index: number) => {
    setErrorMsg(null);
    const cleaned = val.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!cleaned) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    if (cleaned.length > 1) {
      // If user pasted/typed multiple characters
      const chars = cleaned.slice(0, 8 - index).split("");
      for (let i = 0; i < chars.length; i++) {
        newOtp[index + i] = chars[i]!;
      }
      setOtp(newOtp);
      const nextIdx = Math.min(index + chars.length, 7);
      document.getElementById(`otp-${nextIdx}`)?.focus();
    } else {
      newOtp[index] = cleaned;
      setOtp(newOtp);
      if (index < 7) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      setErrorMsg(null);
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        document.getElementById(`otp-${index - 1}`)?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    } else if (e.key === "ArrowRight" && index < 7) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const pasted = e.clipboardData
      .getData("text")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 8);
    const newOtp = pasted.split("").concat(Array(8).fill("")).slice(0, 8);
    setOtp(newOtp);
    const nextIdx = Math.min(pasted.length, 7);
    document.getElementById(`otp-${nextIdx}`)?.focus();
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
              You can now safely return to your command line interface. The
              website builder CLI is authenticated and ready to create, build,
              and deploy your projects.
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
          <CardTitle className="text-2xl font-bold tracking-tight">
            Authorize CLI
          </CardTitle>
          <CardDescription>
            Enter the authorization code displayed in your terminal window.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userCode"
                render={() => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-center block text-sm font-medium text-muted-foreground">
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <div
                        className="flex items-center justify-center gap-1.5 md:gap-2"
                        onPaste={handlePaste}
                      >
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <input
                            key={idx}
                            id={`otp-${idx}`}
                            type="text"
                            maxLength={8}
                            value={otp[idx]}
                            onChange={(e) => handleChange(e.target.value, idx)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            autoComplete="off"
                            className="w-10 h-12 text-center text-xl font-semibold uppercase rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all font-mono"
                          />
                        ))}
                        <span className="text-muted-foreground font-bold text-lg select-none px-0.5">
                          -
                        </span>
                        {Array.from({ length: 4 }).map((_, idx) => {
                          const actualIdx = idx + 4;
                          return (
                            <input
                              key={actualIdx}
                              id={`otp-${actualIdx}`}
                              type="text"
                              maxLength={8}
                              value={otp[actualIdx]}
                              onChange={(e) =>
                                handleChange(e.target.value, actualIdx)
                              }
                              onKeyDown={(e) => handleKeyDown(e, actualIdx)}
                              autoComplete="off"
                              className="w-10 h-12 text-center text-xl font-semibold uppercase rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all font-mono"
                            />
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />

              {errorMsg && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive animate-pulse">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full py-5 text-base"
                disabled={submitting || otp.some((c) => c === "")}
              >
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
