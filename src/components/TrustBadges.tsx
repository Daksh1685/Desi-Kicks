import { Icon } from './ui/Icon';

const PERKS = [
  {
    icon: 'shield' as const,
    title: 'All-Day Comfort Guarantee',
    subtitle: 'Memory foam & anatomical arch support',
  },
  {
    icon: 'truck' as const,
    title: 'Pan-India Free Shipping',
    subtitle: 'Fast delivery across 28,000+ pin codes',
  },
  {
    icon: 'refresh' as const,
    title: '7-Day Easy Size Exchange',
    subtitle: 'Hassle-free doorstep pickup & replacement',
  },
  {
    icon: 'card' as const,
    title: 'COD & Flexible Payments',
    subtitle: 'Pay on delivery, UPI & credit cards',
  },
];

export function TrustBadges() {
  return (
    <section className="bg-gray-50 border-y border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {PERKS.map((perk) => (
            <div key={perk.title} className="flex items-center gap-3.5">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                <Icon name={perk.icon} className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-bold text-gray-900 leading-tight">
                  {perk.title}
                </h4>
                <p className="text-[11px] md:text-xs text-gray-500 mt-0.5 leading-snug">
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
