import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import { PlanCard } from "../components/plans/PlanCard";
import type {
    ApiResponse,
    SubscriptionPlanData,
    ActiveSubscriptionPlanData,
    CreateSubscriptionResponse,
    RazorpayModalOptions,
    RazorpayResponse,
    UserProfileData,
} from "../types/billing";
import loadRazorpayScript from "../utilities/loadRazorpay";
import toast from "react-hot-toast";
import { isAuthenticated } from "../hooks/useAuth";

type BillingTab = "MONTH" | "YEAR";

export default function SubscriptionPage() {
    const [user, setUser] = useState<UserProfileData | null>(null);
    const [plans, setPlans] = useState<SubscriptionPlanData[]>([]);
    const [activeSub, setActiveSub] =
        useState<ActiveSubscriptionPlanData | null>(null);
    const [loading, setLoading] = useState(true);
    const [billingTab, setBillingTab] = useState<BillingTab>("MONTH");
    const isAuthenticatedUser = isAuthenticated();
    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                const plansRes = await api.get<
                    ApiResponse<SubscriptionPlanData[]>
                >("/api/v1/finance/subscription-plans");
                setPlans(plansRes.data.data);
                if (isAuthenticatedUser) {
                    const [subRes, userRes] = await Promise.all([
                        api.get<ApiResponse<ActiveSubscriptionPlanData>>(
                            "/api/v1/finance/active-subscription-plan",
                        ),
                        api.get<ApiResponse<UserProfileData>>(
                            "/api/v1/user/profile",
                        ),
                    ]);
                    setActiveSub(subRes.data.data);
                    setUser(userRes.data.data);
                }
            } catch (err) {
                console.error(err);
                toast.error("Error loading billing data");
            } finally {
                setLoading(false);
            }
        };
        fetchBillingData();
    }, [isAuthenticatedUser]);

    const handlePlanSelect = async (planId: string) => {
        try {
            setLoading(true);
            const response = await api.post<
                ApiResponse<CreateSubscriptionResponse>
            >("/api/v1/finance/create-subscription", { planId });
            const { gatewaySubscriptionId, internalSubscriptionId } =
                response.data.data;

            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast.error("Some error has occurred");
                return;
            }

            const options: RazorpayModalOptions = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                subscription_id: gatewaySubscriptionId,
                name: import.meta.env.VITE_APP_NAME,
                description: "Subscription Payment",
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phone ?? "",
                },
                handler: async (razorpayResponse: RazorpayResponse) => {
                    try {
                        await api.post<ApiResponse<boolean>>(
                            "/api/v1/finance/verify-subscription",
                            {
                                razorpay_payment_id:
                                    razorpayResponse.razorpay_payment_id,
                                razorpay_subscription_id:
                                    razorpayResponse.razorpay_subscription_id,
                                razorpay_signature:
                                    razorpayResponse.razorpay_signature,
                                internal_subscription_id:
                                    internalSubscriptionId,
                            },
                        );
                        toast.success(
                            "Subscription activated! Your quota has been updated",
                        );
                        window.location.reload();
                    } catch (err) {
                        console.error(err);
                        toast.error("Error during payment verification");
                    }
                },
                theme: { color: "#2467d5" },
                modal: {
                    onDismiss: () => setLoading(false),
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            toast.error("Unexpected error has occurred");
        } finally {
            setLoading(false);
        }
    };

    const visiblePlans = plans.filter((p) => p.billingInterval === billingTab);

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-[80vh] w-full flex flex-col items-center justify-center gap-4">
                    <div className="w-9 h-9 rounded-full border-2 border-purple-100 border-t-[#2467d5] animate-spin" />
                    <p className="text-slate-400 text-xs tracking-widest font-mono uppercase">
                        Loading plans
                    </p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="relative w-full pb-20 overflow-hidden">
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[70rem] h-[36rem] bg-gradient-to-b from-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -top-28 right-0 w-72 h-72 bg-[#2467d5]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    {/* Header */}
                    <div className="text-center pt-12 pb-14">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-purple-500/20 text-[#2467d5] text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2467d5] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2467d5]" />
                            </span>
                            Choose your plan
                        </div>

                        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                            EMA <br />
                            <span className="text-[#2467d5]">Premium</span>
                        </h1>

                        <p className="text-base text-slate-500 max-w-sm mx-auto leading-relaxed">
                            Scale your AI email automation. No contracts, cancel
                            anytime.
                        </p>

                        {activeSub && (
                            <div className="inline-flex items-center gap-2 mt-6 bg-blue-50 border border-purple-200 rounded-xl px-4 py-2">
                                <div className="w-2 h-2 rounded-full bg-[#2467d5]" />
                                <span className="text-sm text-purple-700 font-mono">
                                    Active plan
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Toggle + Cards */}
                    <div className="rounded-4xl border border-purple-100 bg-white/90 backdrop-blur-sm shadow-sm p-5 md:p-8">
                        {/* Billing interval toggle */}
                        <div className="flex justify-end mb-5">
                            <div className="inline-flex items-center bg-blue-50/80 border border-purple-100 rounded-xl p-1 gap-1 shadow-sm">
                                <button
                                    onClick={() => setBillingTab("MONTH")}
                                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                        billingTab === "MONTH"
                            ? "bg-[#2467d5] text-white shadow-md shadow-blue-500/20"
                            : "text-slate-500 hover:text-slate-700"
                    }`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setBillingTab("YEAR")}
                                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                    ${
                        billingTab === "YEAR"
                            ? "bg-[#2467d5] text-white shadow-md shadow-blue-500/20"
                            : "text-slate-500 hover:text-slate-700"
                    }`}
                                >
                                    Yearly
                                    <span
                                        className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-all
                    ${
                        billingTab === "YEAR"
                            ? "bg-white/20 text-white"
                            : "bg-blue-100 text-[#2467d5]"
                    }`}
                                    >
                                        Save 20%
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Plans grid */}
                        <div className="grid md:grid-cols-2 gap-6 items-start">
                            {visiblePlans.map((plan) => (
                                <PlanCard
                                    key={plan.id}
                                    plan={plan}
                                    isCurrent={activeSub?.planId === plan.id}
                                    onSelect={handlePlanSelect}
                                    isAuthenticated={isAuthenticatedUser}
                                    isUnderASubscription={
                                        activeSub ? true : false
                                    }
                                />
                            ))}
                        </div>
                    </div>

                    {/* Footer note */}
                    <p className="text-center mt-12 text-xs text-slate-400 font-mono tracking-wide">
                        Secured by Razorpay · Cancel anytime
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
