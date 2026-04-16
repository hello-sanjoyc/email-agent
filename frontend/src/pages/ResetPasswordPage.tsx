import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { ApiResponse } from "../types/billing";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

type FormState = "idle" | "loading" | "success";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const userId = searchParams.get("userId") ?? "";
    const token = searchParams.get("token") ?? "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formState, setFormState] = useState<FormState>("idle");
    const [validationError, setValidationError] = useState<string | null>(null);

    // Redirect away if link is missing required params
    useEffect(() => {
        if (!userId || !token) {
            toast.error("Invalid or expired reset link.");
            navigate("/", { replace: true });
        }
    }, [userId, token, navigate]);

    const passwordStrength = (pwd: string): number => {
        if (pwd.length === 0) return 0;
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return score; // 0–4
    };

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
    const strengthColor = [
        "",
        "bg-red-400",
        "bg-yellow-400",
        "bg-blue-400",
        "bg-emerald-400",
    ];

    const strength = passwordStrength(newPassword);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        if (newPassword.length < 8) {
            setValidationError("Password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setValidationError("Passwords do not match.");
            return;
        }

        try {
            setFormState("loading");
            await api.post<ApiResponse<void>>("/api/v1/auth/reset-password", {
                userId,
                token,
                newPassword,
            });
            setFormState("success");
            toast.success("Password changed successfully!");
            setTimeout(() => navigate("/", { replace: true }), 2200);
        } catch (err) {
            setFormState("idle");
            let msg;
            if(err instanceof AxiosError){
                msg =
                err?.response?.data?.message ??
                "Something went wrong. Please try again.";                
            }else {
                msg = "Unexpected Error";
            }
            toast.error(msg);      
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#eeebff] font-sans px-4 py-12">
            {/* Soft radial glow behind card */}
            <div
                className="pointer-events-none fixed inset-0 z-0"
                aria-hidden="true"
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] rounded-full bg-[#644ae9]/10 blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img
                        src="/assets/images/logo.png"
                        alt="Logo"
                        className="h-14 w-auto"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display =
                                "none";
                        }}
                    />
                </div>

                {/* Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-purple-200/60 border border-purple-100 px-8 py-10">
                    {formState === "success" ? (
                        /* ── Success state ── */
                        <div className="flex flex-col items-center text-center gap-5 py-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-emerald-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Password updated!
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Redirecting you to the home page…
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-full border-2 border-purple-200 border-t-[#644ae9] animate-spin" />
                        </div>
                    ) : (
                        /* ── Form state ── */
                        <>
                            <div className="mb-8 text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#644ae9] text-xs font-bold uppercase tracking-wider mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#644ae9] inline-block" />
                                    Secure Reset
                                </div>
                                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                    Set a new password
                                </h1>
                                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                                    Choose something strong you haven't used
                                    before.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* New password */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNew ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) =>
                                                setNewPassword(e.target.value)
                                            }
                                            placeholder="Min. 8 characters"
                                            required
                                            className="w-full px-4 py-3 pr-11 rounded-xl border border-purple-100 bg-purple-50/40 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#644ae9]/30 focus:border-[#644ae9] transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNew((v) => !v)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#644ae9] transition"
                                            tabIndex={-1}
                                            aria-label="Toggle password visibility"
                                        >
                                            {showNew ? (
                                                <svg
                                                    className="w-4.5 h-4.5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="w-4.5 h-4.5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {/* Strength meter */}
                                    {newPassword.length > 0 && (
                                        <div className="space-y-1 pt-1">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                            strength >= i
                                                                ? strengthColor[
                                                                      strength
                                                                  ]
                                                                : "bg-purple-100"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <p
                                                className={`text-xs font-semibold ${
                                                    strength <= 1
                                                        ? "text-red-400"
                                                        : strength === 2
                                                          ? "text-yellow-500"
                                                          : strength === 3
                                                            ? "text-blue-500"
                                                            : "text-emerald-500"
                                                }`}
                                            >
                                                {strengthLabel[strength]}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm password */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showConfirm ? "text" : "password"
                                            }
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Re-enter your password"
                                            required
                                            className={`w-full px-4 py-3 pr-11 rounded-xl border bg-purple-50/40 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#644ae9]/30 transition ${
                                                confirmPassword.length > 0 &&
                                                confirmPassword !== newPassword
                                                    ? "border-red-300 focus:border-red-400"
                                                    : "border-purple-100 focus:border-[#644ae9]"
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirm((v) => !v)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#644ae9] transition"
                                            tabIndex={-1}
                                            aria-label="Toggle password visibility"
                                        >
                                            {showConfirm ? (
                                                <svg
                                                    className="w-4.5 h-4.5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="w-4.5 h-4.5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {confirmPassword.length > 0 &&
                                        confirmPassword !== newPassword && (
                                            <p className="text-xs text-red-400 font-medium">
                                                Passwords don't match yet
                                            </p>
                                        )}
                                </div>

                                {/* Validation error banner */}
                                {validationError && (
                                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                                        <svg
                                            className="w-4 h-4 shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                                            />
                                        </svg>
                                        {validationError}
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={formState === "loading"}
                                    className="dark-btn w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    style={{ marginLeft: 0 }}
                                >
                                    {formState === "loading" ? (
                                        <>
                                            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                            Updating…
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                {/* Back link */}
                {formState !== "success" && (
                    <p className="text-center mt-6 text-sm text-slate-500">
                        Remembered it?{" "}
                        <a
                            href="/"
                            className="text-[#644ae9] font-semibold hover:underline"
                        >
                            Back to home
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
}
