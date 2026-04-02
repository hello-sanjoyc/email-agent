import type { SubscriptionPlanData } from "../../types/billing";

interface Props {
  plan: SubscriptionPlanData;
  isCurrent: boolean;
  onSelect: (id: string) => void;
}

const isFeatured = (plan: SubscriptionPlanData): boolean =>
  plan.name.toLowerCase().includes("plus");

export const PlanCard = ({ plan, isCurrent, onSelect }: Props) => {
  const featured = isFeatured(plan);
  const isFree = Number(plan.price) === 0;

  const intervalLabel =
    plan.billingInterval === "YEAR" ? "Yearly" :
    plan.billingInterval === "TRIAL" ? "Free forever" : "Monthly";

  const ctaLabel = isCurrent
    ? "Current plan"
    : isFree
    ? "Start free"
    : "Upgrade now";

  return (
    <div className={`relative flex flex-col gap-5 rounded-2xl p-7 transition-all
      ${featured
        ? "bg-[#0d7ff2] border-2 border-[#0d7ff2] shadow-2xl shadow-blue-500/25"
        : isCurrent
        ? "bg-white border-2 border-[#0d7ff2]"
        : "bg-white border border-slate-200 shadow-sm"
      }`}
    >
      {/* Badge */}
      {(featured || isCurrent) && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0d7ff2] text-white text-xs font-bold tracking-wider px-4 py-1 rounded-full whitespace-nowrap shadow-lg shadow-blue-500/30">
          {isCurrent ? "Current plan" : "Most popular"}
        </div>
      )}

      {/* Plan label + name + price */}
      <div>
        <p className={`text-xs font-mono tracking-widest uppercase mb-3
          ${featured ? "text-blue-100" : "text-slate-400"}`}>
          {intervalLabel}
        </p>

        <h2 className={`text-xl font-bold mb-4 tracking-tight
          ${featured ? "text-white" : "text-slate-900"}`}>
          {plan.name}
        </h2>

        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-extrabold leading-none tracking-tight
            ${isFree
              ? featured ? "text-white" : "text-green-600"
              : featured
              ? "text-white"
              : "text-slate-900"
            }`}>
            {isFree ? "Free" : `₹${Number(plan.price).toLocaleString("en-IN")}`}
          </span>
          {!isFree && (
            <span className={`text-sm ${featured ? "text-blue-200" : "text-slate-400"}`}>
              /{plan.billingInterval === "YEAR" ? "yr" : "mo"}
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className={`h-px ${featured ? "bg-blue-400/40" : "bg-slate-100"}`} />

      {/* Features */}
      <div className="flex flex-col gap-3 flex-1">
        <FeatureRow label="AI emails" value={plan.quota.toLocaleString()} featured={featured} />
        <FeatureRow label="Per run" value={`${plan.maxEmailsPerRun} emails`} featured={featured} />
        {plan.gatewayTotalCount && (
          <FeatureRow label="Billing cycles" value={`${plan.gatewayTotalCount}×`} featured={featured} />
        )}
        <FeatureRow label="Billing" value={plan.billingInterval} featured={featured} />
      </div>

      {/* CTA button */}
      <button
        onClick={() => !isCurrent && onSelect(plan.id)}
        disabled={isCurrent}
        className={`w-full py-3 rounded-xl text-sm font-bold transition-all
          ${isCurrent
            ? featured
              ? "bg-blue-400/30 text-blue-200 cursor-not-allowed"
              : "bg-slate-100 text-slate-300 cursor-not-allowed"
            : featured
            ? "bg-white text-[#0d7ff2] hover:bg-blue-50 shadow-lg"
            : "bg-[#0d7ff2] text-white hover:brightness-110 shadow-lg shadow-blue-500/20"
          }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
};

interface FeatureRowProps {
  label: string;
  value: string;
  featured: boolean;
}

const FeatureRow = ({ label, value, featured }: FeatureRowProps) => (
  <div className="flex justify-between items-center">
    <span className={`text-sm ${featured ? "text-blue-200" : "text-slate-400"}`}>{label}</span>
    <span className={`text-sm font-semibold ${featured ? "text-white" : "text-slate-700"}`}>{value}</span>
  </div>
);