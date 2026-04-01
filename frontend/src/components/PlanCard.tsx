import type { SubscriptionPlanData } from '../types/billing';

interface Props {
    plan: SubscriptionPlanData;
    isCurrent: boolean;
    onSelect: (id: string) => void;
}

const isFeatured = (plan: SubscriptionPlanData) =>
    plan.name.toLowerCase().includes('plus');

export const PlanCard = ({ plan, isCurrent, onSelect }: Props) => {
    const featured = isFeatured(plan);
    const isFree = Number(plan.price) === 0;

    const intervalLabel =
        plan.billingInterval === 'YEAR' ? 'Yearly' :
        plan.billingInterval === 'TRIAL' ? 'Free forever' : 'Monthly';

    const ctaLabel = isCurrent
        ? 'Current plan'
        : isFree
        ? 'Start free'
        : 'Upgrade now';

    return (
        <div className={`relative flex flex-col gap-5 rounded-2xl p-7 transition-all
            ${featured
                ? 'bg-stone-900 border border-stone-900'
                : isCurrent
                ? 'bg-white border-2 border-amber-500'
                : 'bg-white border border-stone-200'
            }`}
        >
            {/* badge */}
            {(featured || isCurrent) && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-xs font-mono tracking-wider px-4 py-1 rounded-full whitespace-nowrap">
                    {isCurrent ? 'Current plan' : 'Most popular'}
                </div>
            )}

            {/* plan label + name + price */}
            <div>
                <p className={`text-xs font-mono tracking-widest uppercase mb-3
                    ${featured ? 'text-stone-500' : 'text-stone-300'}`}>
                    {intervalLabel}
                </p>

                <h2 className={`text-xl font-bold mb-4 tracking-tight
                    ${featured ? 'text-stone-100' : 'text-stone-900'}`}>
                    {plan.name}
                </h2>

                <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold leading-none tracking-tight
                        ${isFree
                            ? 'text-emerald-600'
                            : featured
                            ? 'text-stone-100'
                            : 'text-stone-900'
                        }`}>
                        {isFree ? 'Free' : `₹${Number(plan.price).toLocaleString('en-IN')}`}
                    </span>
                    {!isFree && (
                        <span className={`text-sm ${featured ? 'text-stone-500' : 'text-stone-300'}`}>
                            /{plan.billingInterval === 'YEAR' ? 'yr' : 'mo'}
                        </span>
                    )}
                </div>
            </div>

            {/* divider */}
            <div className={`h-px ${featured ? 'bg-stone-800' : 'bg-stone-100'}`} />

            {/* features */}
            <div className="flex flex-col gap-3 flex-1">
                <FeatureRow
                    label="AI emails"
                    value={plan.quota.toLocaleString()}
                    featured={featured}
                />
                <FeatureRow
                    label="Per run"
                    value={`${plan.maxEmailsPerRun} emails`}
                    featured={featured}
                />
                {plan.gatewayTotalCount && (
                    <FeatureRow
                        label="Billing cycles"
                        value={`${plan.gatewayTotalCount}×`}
                        featured={featured}
                    />
                )}
                <FeatureRow
                    label="Billing"
                    value={plan.billingInterval}
                    featured={featured}
                />
            </div>

            {/* cta button */}
            <button
                onClick={() => !isCurrent && onSelect(plan.id)}
                disabled={isCurrent}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors
                    ${isCurrent
                        ? featured
                            ? 'bg-stone-800 text-stone-600 cursor-not-allowed'
                            : 'bg-stone-100 text-stone-300 cursor-not-allowed'
                        : featured
                        ? 'bg-amber-600 text-white hover:bg-amber-500'
                        : 'bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
            >
                {ctaLabel}
            </button>
        </div>
    );
};

const FeatureRow = ({
    label,
    value,
    featured
}: {
    label: string;
    value: string;
    featured: boolean;
}) => (
    <div className="flex justify-between items-center">
        <span className={`text-sm ${featured ? 'text-stone-500' : 'text-stone-400'}`}>{label}</span>
        <span className={`text-sm font-medium ${featured ? 'text-stone-200' : 'text-stone-700'}`}>{value}</span>
    </div>
);
