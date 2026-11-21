import { Link } from 'react-router-dom';
import craftYourSoleLogo from '../assets/craftyoursole_logo.svg';

export function MaintenanceScreen() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col justify-between px-4 py-8 font-sans">
      {/* Top Header */}
      <div className="flex justify-center pt-4">
        <img
          src={craftYourSoleLogo}
          alt="CraftYourSole"
          className="h-8 md:h-10 w-auto invert brightness-0 invert"
        />
      </div>

      {/* Main Announcement Card */}
      <div className="max-w-xl mx-auto my-auto text-center space-y-6 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Scheduled Upgrades in Progress
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
          Crafting Something <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            Extraordinary
          </span>
        </h1>

        <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
          CraftYourSole is currently undergoing scheduled platform upgrades and inventory restocking.
          We are polishing every detail so your bespoke handcrafted footwear experience is second to none.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm hover:opacity-90 transition shadow-lg shadow-orange-500/20 cursor-pointer"
          >
            Check Again / Refresh
          </button>
          <a
            href="mailto:support@craftyoursole.in"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-300 font-semibold text-sm hover:bg-neutral-700 transition"
          >
            Contact Customer Care
          </a>
        </div>

        {/* Support Callout */}
        <div className="pt-6 border-t border-neutral-800 text-xs text-neutral-500 space-y-1">
          <p>
            Have an existing order in transit? Track updates via email notifications or contact us at{' '}
            <span className="text-amber-400">support@craftyoursole.in</span>
          </p>
        </div>
      </div>

      {/* Footer & Admin Bypass */}
      <footer className="text-center text-xs text-neutral-600 space-y-2 pb-4">
        <p>&copy; {new Date().getFullYear()} CraftYourSole. All rights reserved.</p>
        <p>
          <Link
            to="/admin"
            className="text-neutral-500 hover:text-neutral-300 underline underline-offset-4 transition"
          >
            Store Operations & Admin Access
          </Link>
        </p>
      </footer>
    </div>
  );
}
