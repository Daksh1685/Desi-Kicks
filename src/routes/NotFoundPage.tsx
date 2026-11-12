import { Link } from 'react-router-dom';
import { SeoHead } from '../components/SeoHead';
import { Icon } from '../components/ui/Icon';

export function NotFoundPage() {
  return (
    <div className="min-h-[65vh] bg-white flex flex-col items-center justify-center px-4 py-16 text-center">
      <SeoHead
        title="Page Not Found | CraftYourSole"
        description="The CraftYourSole page you requested could not be found. Browse our footwear collections and handcrafted styles."
        canonicalPath="/404"
        noindex
      />

      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
        <Icon name="search" className="w-8 h-8" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
        404 • Route Not Found
      </span>
      <h1 className="font-anton text-3xl sm:text-4xl text-gray-900 uppercase tracking-wide mb-3">
        Looks Like You Stepped Off The Path
      </h1>
      <p className="text-sm text-gray-600 max-w-md leading-relaxed mb-7">
        The footwear page or collection URL you tried to open does not exist or may have moved.
        Explore our active collections or reach out to our team if you need help.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="px-6 py-3 rounded-xl bg-primary hover:bg-[#8A2600] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
        >
          Back to Home
        </Link>
        <Link
          to="/collections"
          className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Browse Collections
        </Link>
        <Link
          to="/contact"
          className="px-6 py-3 rounded-xl border border-gray-200 hover:border-primary hover:text-primary text-gray-700 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}

