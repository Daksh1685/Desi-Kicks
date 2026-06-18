export function Footer() {
  return (
    <footer className="hidden md:block bg-gray-900 text-white/80 mt-12">
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-4 gap-8">
        <div>
          <div className="font-anton text-3xl text-white tracking-wide">DESIKICKS<span className="text-primary">.</span></div>
          <p className="mt-4 text-sm text-white/60 max-w-xs leading-relaxed">Premium athletic footwear, engineered for performance and street culture.</p>
        </div>
        <div>
          <h5 className="font-bold text-white mb-4 uppercase tracking-wide">Shop</h5>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="hover:text-primary transition-colors cursor-pointer w-fit">Running</li>
            <li className="hover:text-primary transition-colors cursor-pointer w-fit">Lifestyle</li>
            <li className="hover:text-primary transition-colors cursor-pointer w-fit">Basketball</li>
            <li className="hover:text-primary transition-colors cursor-pointer w-fit">Training</li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-white mb-4 uppercase tracking-wide">Help</h5>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="hover:text-primary transition-colors cursor-pointer w-fit">Order Status</li>
            <li className="hover:text-primary transition-colors cursor-pointer w-fit">Shipping & Delivery</li>
            <li className="hover:text-primary transition-colors cursor-pointer w-fit">Returns</li>
            <li className="hover:text-primary transition-colors cursor-pointer w-fit">Contact Us</li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-white mb-4 uppercase tracking-wide">Stay in the loop</h5>
          <p className="text-sm text-white/60 mb-4">Drops, restocks and members-only deals.</p>
          <div className="flex h-11">
            <input className="flex-1 px-4 rounded-l-lg bg-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary transition-all" placeholder="Email address" />
            <button className="bg-primary hover:bg-[#8A2600] transition-colors px-6 rounded-r-lg font-bold text-xs uppercase tracking-wider text-white">Join</button>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-sm text-white/40 font-medium">
        © {new Date().getFullYear()} Desikicks. All rights reserved.
      </div>
    </footer>
  );
}
