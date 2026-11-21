import { Icon } from './ui/Icon';

const PERKS = [
  {
    icon: 'shield' as const,
    title: 'All-Day Comfort Guarantee',
    subtitle: 'Memory foam & anatomical arch support',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    iconBg: 'bg-orange-100',
  },
  {
    icon: 'truck' as const,
    title: 'Pan-India Free Shipping',
    subtitle: 'Fast delivery across 28,000+ pin codes',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconBg: 'bg-blue-100',
  },
  {
    icon: 'refresh' as const,
    title: '36-Hour Size Exchange',
    subtitle: 'Exchange only · Doorstep size swap within 36 hrs',
    bg: 'bg-green-50',
    border: 'border-green-100',
    iconBg: 'bg-green-100',
  },
  {
    icon: 'card' as const,
    title: 'COD & Flexible Payments',
    subtitle: 'Pay on delivery, UPI & credit cards',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    iconBg: 'bg-purple-100',
  },
];

export function TrustBadges() {
  return (
    <section className="bg-white border-y border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {PERKS.map((perk) => (
            <div
              key={perk.title}
              className={`${perk.bg} ${perk.border} border rounded-2xl shadow-sm p-5 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow`}
            >
              <div className={`${perk.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-primary shrink-0`}>
                <Icon name={perk.icon} className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                  {perk.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-snug">
                  {perk.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
