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
      setTimeout(() => setSubscribed(false), 3500);
    }
  };

  return (
    <footer className="bg-gray-950 text-white/80 mt-16 mb-16 md:mb-0 border-t border-gray-800 selection:bg-primary selection:text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <Link to="/" aria-label="CraftYourSole Home" className="inline-block">
            <img
              src={craftYourSoleLogo}
              alt="CraftYourSole"
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>
          <p className="text-xs md:text-sm text-white/65 max-w-xs leading-relaxed">
            India's handcrafted footwear destination. Celebrating every walk of life — from wedding festivities and formal elegance to everyday orthopedic comfort and street style.
          </p>

          <div className="pt-2 flex flex-col gap-1.5 text-xs text-white/50">
            <div className="flex items-center gap-2">
              <span className="text-base">🇮🇳</span>
              <span>Pan-India Shipping across 28,000+ Pin Codes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>100% Handcrafted • 7-Day Easy Exchange</span>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="pt-3">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2.5">
              Connect With Us
            </p>
            <div className="flex items-center gap-2.5">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow CraftYourSole on Instagram"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-primary hover:text-white text-white/70 flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-transparent active:scale-95"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow CraftYourSole on Facebook"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-primary hover:text-white text-white/70 flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-transparent active:scale-95"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow CraftYourSole on X"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-primary hover:text-white text-white/70 flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-transparent active:scale-95"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch CraftYourSole on YouTube"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-primary hover:text-white text-white/70 flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-transparent active:scale-95"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Footwear Collections Column */}
        <div>
          <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-3 md:mb-4">
            Footwear Collections
          </h5>
          <ul className="space-y-2.5 text-xs md:text-sm text-white/60">
            <li>
              <Link to="/collections/men" className="hover:text-primary transition-colors flex items-center justify-between group">
                <span>Men's Heritage &amp; Loafers</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary text-xs">→</span>
              </Link>
            </li>
            <li>
              <Link to="/collections/women" className="hover:text-primary transition-colors flex items-center justify-between group">
                <span>Women's Heels, Slides &amp; Flats</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary text-xs">→</span>
              </Link>
            </li>
            <li>
              <Link to="/collections/kids" className="hover:text-primary transition-colors flex items-center justify-between group">
                <span>Kids' Sneakers &amp; Casuals</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary text-xs">→</span>
              </Link>
            </li>
            <li>
              <Link to="/collections/festive-ethnic" className="hover:text-primary transition-colors flex items-center justify-between group">
                <span>Festive Juttis &amp; Mojaris</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary text-xs">→</span>
              </Link>
            </li>
            <li>
              <Link to="/collections/daily-comfort" className="hover:text-primary transition-colors flex items-center justify-between group">
                <span>Daily Comfort &amp; Ortho Slides</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary text-xs">→</span>
              </Link>
            </li>
            <li>
              <Link to="/collections/gym-sports" className="hover:text-primary transition-colors flex items-center justify-between group">
                <span>Gym Trainers &amp; Athletic Runners</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary text-xs">→</span>
              </Link>
            </li>
            <li className="pt-1">
              <Link to="/collections" className="text-white hover:text-primary font-bold transition-colors inline-flex items-center gap-1.5">
                Browse Full Catalog <span className="text-primary">→</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Support Column */}
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
                7-Day Doorstep Size Exchange
              </Link>
            </li>
            <li>
              <Link to="/size-guide" className="hover:text-primary transition-colors">
                Indian &amp; UK Size Guide
              </Link>
            </li>
            <li>
              <Link to="/authenticity" className="hover:text-primary transition-colors">
                Authenticity Verification
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary transition-colors">
                Our Story &amp; Craftsmanship
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Contact Us &amp; Help Desk
              </Link>
            </li>
          </ul>
          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-white/40 leading-relaxed">
            <p className="font-medium text-white/60">Dedicated Support:</p>
            <p className="text-primary font-semibold">{SUPPORT_EMAIL}</p>
            <p>Mon – Sat: 9:30 AM – 6:30 PM IST</p>
          </div>
        </div>

        {/* Newsletter & Club Drop Alerts */}
        <div>
          <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-3 md:mb-4">
            Stay In The Loop
          </h5>
          <p className="text-xs md:text-sm text-white/60 mb-3 leading-relaxed">
            Be the first to hear about secret festival drops, handcrafted restocks, and exclusive member discounts.
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
              className="bg-primary hover:bg-[#8A2600] active:scale-95 transition-all px-4 md:px-5 rounded-r-lg font-bold text-xs uppercase tracking-wider text-white shrink-0 cursor-pointer"
            >
              {subscribed ? 'Joined!' : 'Join'}
            </button>
          </form>
          {subscribed && (
            <p className="text-emerald-400 text-xs mt-2 animate-fade-in flex items-center gap-1.5 font-medium">
              <span>✓</span> Welcome to the CraftYourSole drop alert list!
            </p>
          )}

          {/* Secure Shopping Trust Indicators */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
              Payment &amp; Security
            </p>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-white/50">
              <span className="px-2 py-0.5 rounded bg-white/10 border border-white/5 font-semibold text-white/80">UPI</span>
              <span className="px-2 py-0.5 rounded bg-white/10 border border-white/5 font-semibold text-white/80">RuPay</span>
              <span className="px-2 py-0.5 rounded bg-white/10 border border-white/5 font-semibold text-white/80">Cards</span>
              <span className="px-2 py-0.5 rounded bg-white/10 border border-white/5 font-semibold text-white/80">NetBanking</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 font-semibold text-emerald-300">COD Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-3">
          <span>
            © {new Date().getFullYear()} CraftYourSole. All rights reserved. Handcrafted Indian Footwear Culture.
          </span>
          <div className="flex items-center gap-5 text-xs">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <a href="/sitemap.xml" className="hover:text-white transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
