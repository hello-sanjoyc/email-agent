import { useEffect, useState } from 'react';
import api from '../api/axios';
import { PlanCard } from '../components/PlanCard';
import type { ApiResponse, SubscriptionPlanData, ActiveSubscriptionPlanData, CreateSubscriptionResponse, RazorpayModalOptions, RazorpayResponse, UserProfileData } from '../types/billing';
import loadRazorpayScript from '../utilities/loadRazorpay';
import toast from 'react-hot-toast';

type BillingTab = 'MONTH' | 'YEAR';

export const SubscriptionPage = () => {
    const [user, setUser] = useState<UserProfileData | null>(null);
    const [plans, setPlans] = useState<SubscriptionPlanData[]>([]);
    const [activeSub, setActiveSub] = useState<ActiveSubscriptionPlanData | null>(null);
    const [loading, setLoading] = useState(true);
    const [billingTab, setBillingTab] = useState<BillingTab>('MONTH');

    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                const [plansRes, subRes, userRes] = await Promise.all([
                    api.get<ApiResponse<SubscriptionPlanData[]>>('/api/v1/finance/subscription-plans'),
                    api.get<ApiResponse<ActiveSubscriptionPlanData>>('/api/v1/finance/active-subscription-plan'),
                    api.get<ApiResponse<UserProfileData>>('/api/v1/user/profile'),
                ]);
                setPlans(plansRes.data.data);
                setActiveSub(subRes.data.data);
                setUser(userRes.data.data);
            } catch (err) {
                console.log(err);
                toast.error("Error loading billing data");
            } finally {
                setLoading(false);
            }
        };
        fetchBillingData();
    }, []);

    const handlePlanSelect = async (planId: string) => {
        try {
            setLoading(true);
            const response = await api.post<ApiResponse<CreateSubscriptionResponse>>(
                '/api/v1/finance/create-subscription',
                { planId }
            );
            const { gatewaySubscriptionId, internalSubscriptionId } = response.data.data;
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast.error("Some error has occurred");
                return;
            }
            const options: RazorpayModalOptions = {
                key: import.meta.env.RAZORPAY_KEY_ID,
                subscription_id: gatewaySubscriptionId,
                name: import.meta.env.APP_NAME,
                description: "Subscription Payment",
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phone ?? ""
                },
                handler: async (razorpayResponse: RazorpayResponse) => {
                    try {
                        await api.post<ApiResponse<boolean>>(
                            '/api/v1/finance/verify-subscription',
                            {
                                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                                razorpay_subscription_id: razorpayResponse.razorpay_subscription_id,
                                razorpay_signature: razorpayResponse.razorpay_signature,
                                internal_subscription_id: internalSubscriptionId
                            }
                        );
                        toast.success("Subscription activated! Your quota has been updated");
                        window.location.reload();
                    } catch (err) {
                        console.log(err);
                        toast.error("Error during payment verification");
                    }
                },
                theme: { color: '#d97706' },
                modal: {
                    onDismiss: () => setLoading(false)
                }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.log(err);
            toast.error("Unexpected error has occurred");
        } finally {
            setLoading(false);
        }
    };

    const visiblePlans = plans.filter(p => p.billingInterval === billingTab);

    if (loading) return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 bg-stone-50">
            <div className="w-9 h-9 rounded-full border-2 border-stone-200 border-t-amber-600 animate-spin" />
            <p className="text-stone-400 text-xs tracking-widest font-mono uppercase">Loading plans</p>
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-stone-50 pb-20">
            <div className="max-w-5xl mx-auto px-6">

                {/* header */}
                <div className="text-center pt-20 pb-14">
                    <div className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        <span className="text-xs text-stone-400 tracking-widest font-mono uppercase">
                            Choose your plan
                        </span>
                    </div>

                    <h1 className="text-5xl font-bold text-stone-900 tracking-tight leading-tight mb-4">
                        Email Agent <br />
                        <span className="text-amber-600 italic">Premium</span>
                    </h1>

                    <p className="text-base text-stone-500 max-w-sm mx-auto leading-relaxed">
                        Scale your AI email automation. No contracts, cancel anytime.
                    </p>

                    {activeSub && (
                        <div className="inline-flex items-center gap-2 mt-6 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-sm text-emerald-700 font-mono">Active plan</span>
                        </div>
                    )}
                </div>

                {/* toggle + cards */}
                <div>

                    {/* toggle row — right aligned */}
                    <div className="flex justify-end mb-5">
                        <div className="inline-flex items-center bg-white border border-stone-200 rounded-xl p-1 gap-1">
                            <button
                                onClick={() => setBillingTab('MONTH')}
                                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all
                                    ${billingTab === 'MONTH'
                                        ? 'bg-stone-900 text-white'
                                        : 'text-stone-400 hover:text-stone-600'
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingTab('YEAR')}
                                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                                    ${billingTab === 'YEAR'
                                        ? 'bg-stone-900 text-white'
                                        : 'text-stone-400 hover:text-stone-600'
                                    }`}
                            >
                                Yearly
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-all
                                    ${billingTab === 'YEAR'
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    Save 20%
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* plans grid */}
                    <div className="grid md:grid-cols-2 gap-4 items-start">
                        {visiblePlans.map((plan) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                isCurrent={activeSub?.planId === plan.id}
                                onSelect={handlePlanSelect}
                            />
                        ))}
                    </div>
                </div>

                {/* footer */}
                <p className="text-center mt-12 text-xs text-stone-300 font-mono tracking-wide">
                    Secured by Razorpay · Cancel anytime
                </p>
            </div>
        </div>
    );
};
