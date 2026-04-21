import type { SubscriptionPlanData } from "../../types/billing";

interface Props {
    plan: SubscriptionPlanData;
    isCurrent: boolean;
    onSelect: (id: string) => void;
    isAuthenticated: boolean;
    isUnderASubscription: boolean;
}

const isFeatured = (plan: SubscriptionPlanData): boolean =>
    plan.name.toLowerCase().includes("pro");

export const PlanCard = ({
    plan,
    isCurrent,
    onSelect,
    isAuthenticated,
    isUnderASubscription,
}: Props) => {
    const featured = isFeatured(plan);
    const isFree = Number(plan.price) === 0;

    const intervalLabel =
        plan.billingInterval === "YEAR"
            ? "Yearly"
            : plan.billingInterval === "TRIAL"
              ? "Free forever"
              : "Monthly";

    const ctaLabel = isCurrent
        ? "Current plan"
        : isFree
          ? "Start free"
          : isUnderASubscription
            ? "Change plan"
            : "Upgrade now";

    return (
        <div
            className={`relative flex flex-col gap-5 rounded-2xl p-7 transition-all
      ${
          isCurrent
              ? "bg-white border-2 border-[#2467d5] shadow-md shadow-blue-100/70"
              : "bg-white border border-purple-100 shadow-sm hover:shadow-md hover:-translate-y-0.5"
      }`}
        >
            {/* Badge */}
            {(featured || isCurrent) && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2467d5] text-white text-xs font-bold tracking-wider px-4 py-1 rounded-full whitespace-nowrap shadow-lg shadow-blue-500/30">
                    {isCurrent ? "Current plan" : "Most popular"}
                </div>
            )}

            {/* Plan label + name + price */}
            <div>
                <p
                    className={`text-xs font-mono tracking-widest uppercase mb-3
          text-slate-500`}
                >
                    {intervalLabel}
                </p>

                <h2
                    className={`text-xl font-bold mb-4 tracking-tight
          text-slate-900`}
                >
                    {plan.name}
                </h2>

                <div className="flex items-baseline gap-1">
                    <span
                        className={`text-4xl font-extrabold leading-none tracking-tight
            ${isFree ? "text-green-600" : "text-slate-900"}`}
                    >
                        {isFree
                            ? "Free"
                            : `₹${Number(plan.price).toLocaleString("en-IN")}`}
                    </span>
                    {!isFree && (
                        <span className={`text-sm text-slate-500`}>
                            /{plan.billingInterval === "YEAR" ? "yr" : "mo"}
                        </span>
                    )}
                </div>
            </div>

            {/* Divider */}
            <div className={`h-px bg-blue-100/80`} />

            {/* Features */}
            <div className="flex flex-col gap-3 flex-1">
                <FeatureRow
                    label="AI emails"
                    value={plan.quota.toLocaleString()}
                />
                <FeatureRow
                    label="Per run"
                    value={`${plan.maxEmailsPerRun} emails`}
                />
                {plan.gatewayTotalCount && (
                    <FeatureRow
                        label="Billing cycles"
                        value={`${plan.gatewayTotalCount}×`}
                    />
                )}
                <FeatureRow label="Billing" value={plan.billingInterval} />
            </div>

            {/* CTA button */}
            {isAuthenticated && (
                <button
                    onClick={() => !isCurrent && onSelect(plan.id)}
                    disabled={isCurrent}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all
            ${
                isCurrent
                    ? "bg-blue-400/30 text-white-200 cursor-not-allowed"
                    : "bg-[#2467d5] text-white hover:brightness-110 shadow-lg shadow-blue-500/20"
            }`}
                >
                    {ctaLabel}
                </button>
            )}
        </div>
    );
};

interface FeatureRowProps {
    label: string;
    value: string;
}

const FeatureRow = ({ label, value }: FeatureRowProps) => (
    <div className="flex justify-between items-center">
        <span className={`text-sm text-slate-500`}>{label}</span>
        <span className={`text-sm font-semibold text-slate-700`}>{value}</span>
    </div>
);
