import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../components/SeoHead';
import { Icon } from '../components/ui/Icon';
import { SIZING_CHART_DATA } from '../constants/productReviews';
import { SITE_NAME, SITE_URL, SUPPORT_EMAIL } from '../constants/site';

interface PageShellProps {
  badge: string;
  title: string;
  subtitle: string;
  breadcrumb: string;
  devBanner?: {
    title: string;
    detail: string;
  };
  children: React.ReactNode;
}

function InfoPageShell({
  badge,
  title,
  subtitle,
  breadcrumb,
  devBanner,
  children,
}: PageShellProps) {
  return (
    <div className="bg-white text-gray-900 pb-16">
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Icon name="home" className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-bold">{breadcrumb}</span>
          </nav>
        </div>
      </div>

      <section className="bg-gray-950 text-white py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block bg-primary/20 border border-primary/40 text-orange-200 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3">
            {badge}
          </span>
          <h1 className="font-anton text-3xl sm:text-4xl md:text-5xl tracking-wide uppercase">
            {title}
          </h1>
          <p className="text-white/75 text-sm md:text-base mt-3 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {devBanner && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{devBanner.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-950/85 leading-relaxed">
                {devBanner.detail}
              </p>
            </div>
            <Link
              to="/collections"
              className="shrink-0 text-xs font-bold text-amber-900 bg-white border border-amber-300 hover:bg-amber-100 px-4 py-2 rounded-xl transition-colors w-fit"
            >
              Browse Footwear →
            </Link>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <>
      <SeoHead
        title={`About ${SITE_NAME} | Handcrafted Indian Footwear & Artisan Hubs`}
        description="Learn how CraftYourSole partners with generational cobblers across Jaipur, Agra, Kanpur, Mumbai, Bengaluru, and Jalandhar to craft comfortable Indian footwear."
        canonicalPath="/about"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: `About ${SITE_NAME}`,
          url: `${SITE_URL}/about`,
        }}
      />
      <InfoPageShell
        badge="Our Craft & Story"
        title="About CraftYourSole"
        subtitle="Born in India to unite centuries-old regional shoemaking heritage with modern orthopedic comfort engineering."
        breadcrumb="About CraftYourSole"
        devBanner={{
          title: 'Artisan Studio Stories Under Development',
          detail:
            'We are filming behind-the-scenes artisan workshop profiles and interactive leather craft timelines for upcoming release. Core brand standards and regional hub details are live below.',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              hub: 'Jaipur, Rajasthan',
              specialty: 'Festive Juttis & Zari Mojaris',
              detail:
                'Hand-embroidered silk and velvet uppers paired with softened collar linings and 6mm memory foam arch cushioning.',
            },
            {
              hub: 'Agra & Kanpur, UP',
              specialty: 'Full-Grain Formal Leather & Ortho Slides',
              detail:
                '72-hour hand-burnished crust leather loafers and contoured medical-grade EVA orthopedic comfort footwear.',
            },
            {
              hub: 'Bengaluru, Mumbai & Jalandhar',
              specialty: 'AirKnit Daily Slip-Ons, Heels & Athletic',
              detail:
                'Breathable 3D knit commuters, cushioned block heels for evening wear, and high-rebound athletic trainers.',
            },
          ].map((item) => (
            <div key={item.hub} className="p-5 rounded-2xl border border-gray-200 bg-gray-50/70">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                {item.hub}
              </span>
              <h2 className="font-bold text-base text-gray-900 mt-1 mb-2">{item.specialty}</h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 p-6 space-y-3">
          <h2 className="font-anton text-2xl uppercase tracking-wide text-gray-900">
            Why We Build For Indian Feet
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Traditional ethnic shoes often sacrifice comfort for embroidery, while imported western
            silhouettes run narrow for Indian foot anatomy and tropical humidity. Every {SITE_NAME}{' '}
            pair combines wide-toe ergonomics, breathable insoles, and anti-skid soles across
            festive, formal, daily comfort, and athletic categories.
          </p>
        </div>
      </InfoPageShell>
    </>
  );
}

export function SizeGuidePage() {
  return (
    <>
      <SeoHead
        title={`Footwear Size & Fit Guide (UK, EU & CM) | ${SITE_NAME}`}
        description="Find your exact CraftYourSole footwear size using our UK, US, EU, and centimetre foot-length conversion chart plus fit advice for mojaris, loafers, and heels."
        canonicalPath="/size-guide"
      />
      <InfoPageShell
        badge="Precision Fit Guide"
        title="Footwear Size & Fit Chart"
        subtitle="Measure your foot in centimetres at the end of the day for the most accurate CraftYourSole fit."
        breadcrumb="Size & Fit Guide"
        devBanner={{
          title: 'Interactive Foot-Length Size Finder Under Development',
          detail:
            'An interactive foot-length calculator and per-silhouette width recommender are currently under development. Use the verified UK/US/EU conversion chart below in the meantime.',
        }}
      >
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">UK / India</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">US</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">EU</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Foot Length (cm)</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Inches</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SIZING_CHART_DATA.map((row) => (
                <tr key={row.uk} className="hover:bg-orange-50/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-primary">{row.uk}</td>
                  <td className="py-3 px-4 text-gray-700">{row.us}</td>
                  <td className="py-3 px-4 text-gray-700">{row.eu}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{row.footCm}</td>
                  <td className="py-3 px-4 text-gray-600">{row.footInches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
            <h2 className="font-bold text-sm text-gray-900 mb-1">1. Stand On Paper</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Place your heel lightly against a wall on a flat sheet of paper and mark the tip of
              your longest toe.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
            <h2 className="font-bold text-sm text-gray-900 mb-1">2. Wide Feet & Mojaris</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Handcrafted leather mojaris mold to your instep within 2–3 wears; if between sizes,
              choose one size up.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
            <h2 className="font-bold text-sm text-gray-900 mb-1">3. Free 7-Day Swap</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every order includes a free doorstep adjacent-size exchange within 7 days of delivery.
            </p>
          </div>
        </div>
      </InfoPageShell>
    </>
  );
}

export function ShippingPolicyPage() {
  return (
    <>
      <SeoHead
        title={`Shipping & Dispatch Policy | ${SITE_NAME}`}
        description="Pan-India free footwear shipping across 28,000+ pin codes. Learn about CraftYourSole dispatch timelines, COD availability, and metro express delivery."
        canonicalPath="/shipping-policy"
      />
      <InfoPageShell
        badge="Pan-India Logistics"
        title="Shipping & Dispatch Policy"
        subtitle="Complimentary pan-India shipping across 28,000+ serviceable pin codes with Cash on Delivery support."
        breadcrumb="Shipping Policy"
        devBanner={{
          title: 'Live Courier Webhook Notifications Under Development',
          detail:
            'Real-time WhatsApp & SMS courier milestone webhooks are currently under development. Dispatch timelines and COD coverage rules below apply to all active orders.',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          <div className="p-5 rounded-2xl border border-gray-200 space-y-2">
            <h2 className="font-bold text-gray-900 text-base">Dispatch & Transit Timelines</h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600 list-disc pl-5">
              <li>Ready-to-ship footwear dispatches within 24–48 business hours.</li>
              <li>Metro cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Pune, Chennai): 2–4 days.</li>
              <li>Rest of India & Tier-2/3 pin codes: 4–7 business days.</li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl border border-gray-200 space-y-2">
            <h2 className="font-bold text-gray-900 text-base">Shipping Fees & COD</h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600 list-disc pl-5">
              <li>Free standard shipping on all launch storefront orders across India.</li>
              <li>Cash on Delivery (COD), UPI, net banking, and major debit/credit cards accepted.</li>
              <li>Every pair ships in protective dust bags and reinforced crush-proof footwear boxes.</li>
            </ul>
          </div>
        </div>
      </InfoPageShell>
    </>
  );
}

export function ReturnsExchangePage() {
  return (
    <>
      <SeoHead
        title={`7-Day Size Exchanges & Returns Policy | ${SITE_NAME}`}
        description="Worried about shoe sizing? CraftYourSole offers a 7-day free doorstep size exchange and hassle-free return policy across India."
        canonicalPath="/returns-exchange"
      />
      <InfoPageShell
        badge="100% Fit Guarantee"
        title="7-Day Size Exchanges & Returns"
        subtitle="Hassle-free doorstep pickup and adjacent-size replacement within 7 days of delivery."
        breadcrumb="Returns & Exchanges"
        devBanner={{
          title: 'One-Click Self-Serve Exchange Portal Under Development',
          detail:
            'Automated self-serve doorstep pickup scheduling is currently under development. Email your order ID to support@craftyoursole.in and our team will arrange pickup manually.',
        }}
      >
        <div className="space-y-4 text-sm text-gray-600">
          <div className="p-5 rounded-2xl border border-gray-200 space-y-2">
            <h2 className="font-bold text-gray-900 text-base">Eligibility Checklist</h2>
            <ul className="space-y-2 text-xs sm:text-sm list-disc pl-5">
              <li>Request initiated within 7 calendar days of order delivery.</li>
              <li>Footwear must be unworn outdoors with clean soles, original box, and tags intact.</li>
              <li>First size exchange per order is completely free of pickup or re-dispatch charges.</li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl border border-gray-200 space-y-2">
            <h2 className="font-bold text-gray-900 text-base">Refund Timelines</h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              Prepaid orders returned in unused condition are refunded to the original UPI, card, or
              bank source within 5–7 business days after quality inspection at our hub.
            </p>
          </div>
        </div>
      </InfoPageShell>
    </>
  );
}

export function AuthenticityPage() {
  return (
    <>
      <SeoHead
        title={`Craftsmanship & Authenticity Verification | ${SITE_NAME}`}
        description="Every CraftYourSole pair passes 14-point sole adhesion, leather grain, and cushioning quality checks before dispatch."
        canonicalPath="/authenticity"
      />
      <InfoPageShell
        badge="Quality & Provenance"
        title="Craftsmanship & Authenticity"
        subtitle="Direct-from-artisan sourcing with strict material transparency and 14-point workshop inspection."
        breadcrumb="Authenticity"
        devBanner={{
          title: 'QR Batch Serial Lookup Under Development',
          detail:
            'Scannable shoe-box QR batch verification linking each pair to its artisan cluster and inspection log is currently under development.',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Verified Materials',
              body: 'Full-grain burnished leather, breathable AirKnit yarn, velvet Zari embroidery, and vegan microfibers are explicitly listed on every product page.',
            },
            {
              title: '14-Point Inspection',
              body: 'Each pair undergoes sole-flex adhesion testing, stitching tension checks, and arch-insole alignment before boxing.',
            },
            {
              title: 'Fair Artisan Sourcing',
              body: 'Produced directly with generational cobbler workshops in Jaipur, Agra, Kanpur, and Jalandhar without middlemen.',
            },
          ].map((card) => (
            <div key={card.title} className="p-5 rounded-2xl border border-gray-200 bg-gray-50">
              <h2 className="font-bold text-gray-900 text-sm mb-1.5">{card.title}</h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </InfoPageShell>
    </>
  );
}

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <>
      <SeoHead
        title={`Contact Customer Support | ${SITE_NAME}`}
        description={`Reach CraftYourSole support at ${SUPPORT_EMAIL} for footwear sizing guidance, wedding bulk orders, or order assistance.`}
        canonicalPath="/contact"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: `Contact ${SITE_NAME}`,
          url: `${SITE_URL}/contact`,
        }}
      />
      <InfoPageShell
        badge="Customer Care"
        title="Contact CraftYourSole"
        subtitle="Questions about sizing, wedding family sets, or order exchanges? Our support desk responds within 1 business day."
        breadcrumb="Contact Us"
        devBanner={{
          title: 'Live WhatsApp Concierge Under Development',
          detail:
            'Instant WhatsApp sizing assistance and live ticket sync are under development. Use the inquiry form below or write directly to support@craftyoursole.in.',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50 space-y-3">
              <h2 className="font-bold text-base text-gray-900">Direct Support Channels</h2>
              <div className="text-xs sm:text-sm text-gray-600 space-y-2">
                <p>
                  <strong className="text-gray-900">Email:</strong>{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary font-semibold hover:underline">
                    {SUPPORT_EMAIL}
                  </a>
                </p>
                <p>
                  <strong className="text-gray-900">Hours:</strong> Mon – Sat, 10:00 AM – 7:00 PM IST
                </p>
                <p>
                  <strong className="text-gray-900">Coverage:</strong> Pan-India Online Storefront
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="md:col-span-7 p-5 sm:p-6 rounded-2xl border border-gray-200 space-y-4"
          >
            <h2 className="font-bold text-base text-gray-900">Send a Support Message</h2>
            {submitted && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                Thank you! Your inquiry has been noted. For urgent requests, please also email{' '}
                {SUPPORT_EMAIL}.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-primary"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your order ID, preferred size, or question..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-[#8A2600] text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              Submit Inquiry
            </button>
          </form>
        </div>
      </InfoPageShell>
    </>
  );
}

export function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [checkedId, setCheckedId] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      setCheckedId(orderId.trim());
    }
  };

  return (
    <>
      <SeoHead
        title={`Track Your Order | ${SITE_NAME}`}
        description="Check your CraftYourSole footwear order dispatch status or view recent orders in your account profile."
        canonicalPath="/track-order"
        noindex
      />
      <InfoPageShell
        badge="Order Status"
        title="Track Your Order"
        subtitle="Check order progress or sign in to view your recent CraftYourSole orders."
        breadcrumb="Track Order"
        devBanner={{
          title: 'Live Courier GPS Tracking Under Development',
          detail:
            'Real-time courier AWB sync (Delhivery / Bluedart) is currently under development. Signed-in shoppers can inspect placed orders under My Profile → Orders.',
        }}
      >
        <div className="max-w-xl p-6 rounded-2xl border border-gray-200 space-y-4">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g. CYS-1042)"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-[#8A2600] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Check Status
            </button>
          </form>

          {checkedId && (
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-1.5">
              <p className="font-bold text-gray-900">Order Reference: {checkedId}</p>
              <p>
                Live courier webhook sync is currently rolling out. View your full order status in{' '}
                <Link to="/profile" className="text-primary font-bold hover:underline">
                  My Profile
                </Link>{' '}
                or email{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary font-bold hover:underline">
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </InfoPageShell>
    </>
  );
}

export function PrivacyPolicyPage() {
  return (
    <>
      <SeoHead
        title={`Privacy Policy | ${SITE_NAME}`}
        description="Read how CraftYourSole collects, stores, and protects customer account, shipping, and footwear order data."
        canonicalPath="/privacy-policy"
      />
      <InfoPageShell
        badge="Legal & Privacy"
        title="Privacy Policy"
        subtitle={`How ${SITE_NAME} (${SITE_URL}) handles account, address, and order information responsibly.`}
        breadcrumb="Privacy Policy"
      >
        <div className="space-y-5 text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
          <section className="space-y-1.5">
            <h2 className="font-bold text-base text-gray-900">1. Information We Collect</h2>
            <p>
              When you browse {SITE_NAME}, sign in with Firebase Authentication, or place an order,
              we process only the details needed to fulfill your footwear purchase — such as your
              name, email address, phone number, delivery pin code/address, and selected shoe sizes.
            </p>
          </section>
          <section className="space-y-1.5">
            <h2 className="font-bold text-base text-gray-900">2. How We Use Information</h2>
            <p>
              We use your data strictly to process orders, provide size-exchange doorstep pickups,
              communicate delivery updates, and maintain saved wishlist or cart items in your
              browser. We do not sell personal contact data to third parties.
            </p>
          </section>
          <section className="space-y-1.5">
            <h2 className="font-bold text-base text-gray-900">3. Contact & Data Requests</h2>
            <p>
              To update or remove your account data, email{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary font-semibold hover:underline">
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </InfoPageShell>
    </>
  );
}

export function TermsPage() {
  return (
    <>
      <SeoHead
        title={`Terms & Conditions | ${SITE_NAME}`}
        description="Terms of service governing orders, pricing in INR, sizing exchanges, and intellectual property on CraftYourSole."
        canonicalPath="/terms"
      />
      <InfoPageShell
        badge="Legal & Terms"
        title="Terms & Conditions"
        subtitle={`Terms governing use of ${SITE_NAME} storefront, pricing, and pan-India footwear orders.`}
        breadcrumb="Terms & Conditions"
      >
        <div className="space-y-5 text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
          <section className="space-y-1.5">
            <h2 className="font-bold text-base text-gray-900">1. Storefront & Pricing</h2>
            <p>
              All prices displayed on {SITE_NAME} are in Indian Rupees (INR) inclusive of
              applicable taxes unless noted otherwise at checkout. Product availability and
              artisan stock counts are updated continuously.
            </p>
          </section>
          <section className="space-y-1.5">
            <h2 className="font-bold text-base text-gray-900">2. Handcrafted Variations</h2>
            <p>
              Because our festive mojaris and burnished leather loafers are handcrafted by artisans,
              subtle variations in Zari stitch pattern or natural leather patina are inherent marks
              of authenticity rather than defects.
            </p>
          </section>
          <section className="space-y-1.5">
            <h2 className="font-bold text-base text-gray-900">3. Exchanges & Support</h2>
            <p>
              Exchanges and returns follow our{' '}
              <Link to="/returns-exchange" className="text-primary font-semibold hover:underline">
                7-Day Size Exchanges & Returns Policy
              </Link>
              . Questions can be sent to{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary font-semibold hover:underline">
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </InfoPageShell>
    </>
  );
}

