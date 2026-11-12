import { useState } from 'react';
import { Link } from 'react-router-dom';
import craftYourSoleLogo from '../assets/craftyoursole_logo.svg';
import { SUPPORT_EMAIL } from '../constants/site';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-950 text-white/80 mt-12 mb-16 md:mb-0 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        <div>
          <Link to="/" aria-label="CraftYourSole Home" className="inline-block">
            <img
              src={craftYourSoleLogo}
              alt="CraftYourSole"
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>
          <p className="mt-3 text-xs md:text-sm text-white/60 max-w-xs leading-relaxed">
            India's complete footwear destination. Celebrating every walk of life — from grand festive celebrations to daily comfort and active fitness.
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-white/40">
            <span>🇮🇳 Pan-India Shipping</span>
            <span>•</span>
            <span>100% Quality Guaranteed</span>
          </div>
        </div>

        <div>
          <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-3 md:mb-4">
            Footwear Collections
          </h5>
          <ul className="space-y-2.5 text-xs md:text-sm text-white/60">
            <li>
              <Link to="/collections/festive-ethnic" className="hover:text-primary transition-colors">
                Festive Juttis &amp; Mojaris
              </Link>
            </li>
            <li>
              <Link to="/collections/work-formal" className="hover:text-primary transition-colors">
                Men's Formals &amp; Loafers
              </Link>
            </li>
            <li>
              <Link to="/collections/women" className="hover:text-primary transition-colors">
                Women's Heels, Flats &amp; Wedges
              </Link>
            </li>
            <li>
              <Link to="/collections/daily-comfort" className="hover:text-primary transition-colors">
                Daily Comfort Slip-Ons
              </Link>
            </li>
            <li>
              <Link to="/collections/gym-sports" className="hover:text-primary transition-colors">
                Gym, Running &amp; Athletic
              </Link>
            </li>
            <li>
              <Link to="/collections" className="hover:text-primary transition-colors">
                Browse All Collections
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-3 md:mb-4">
            Customer Support
          </h5>
          <ul className="space-y-2.5 text-xs md:text-sm text-white/60">
            <li>
              <Link to="/track-order" className="hover:text-primary transition-colors">
                Track Your Order
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="hover:text-primary transition-colors">
                Shipping &amp; Dispatch Policy
              </Link>
            </li>
            <li>
              <Link to="/returns-exchange" className="hover:text-primary transition-colors">
                7-Day Size Exchanges &amp; Returns
              </Link>
            </li>
            <li>
              <Link to="/size-guide" className="hover:text-primary transition-colors">
                Size &amp; Fit Guide
              </Link>
            </li>
            <li>
              <Link to="/authenticity" className="hover:text-primary transition-colors">
                Authenticity Verification
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary transition-colors">
                About CraftYourSole
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Contact Us: {SUPPORT_EMAIL}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-3 md:mb-4">
            Stay In The Loop
          </h5>
          <p className="text-xs md:text-sm text-white/60 mb-3">
            Be the first to hear about secret drops, restocks, and member exclusive pricing.
          </p>
          <form onSubmit={handleSubmit} className="flex h-10 md:h-11">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 min-w-0 px-3 md:px-4 rounded-l-lg bg-white/10 text-white placeholder-white/40 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary transition-all"
              placeholder="Enter your email"
              required
            />
            <button
              type="submit"
              className="bg-primary hover:bg-[#8A2600] active:scale-95 transition-all px-4 md:px-6 rounded-r-lg font-bold text-xs uppercase tracking-wider text-white shrink-0 cursor-pointer"
            >
              {subscribed ? 'Joined!' : 'Join'}
            </button>
          </form>
          {subscribed && (
            <p className="text-green-400 text-xs mt-2 animate-fade-in">
              ✓ Welcome to the CraftYourSole drop alert list!
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-3">
          <span>© {new Date().getFullYear()} CraftYourSole. All rights reserved. Crafted for Indian footwear culture.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <a href="/sitemap.xml" className="hover:text-white transition-colors">
              Sitemap
            </a>
            <Link
              to="/admin"
              className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Admin Portal →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
