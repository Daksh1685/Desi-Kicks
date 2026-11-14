import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { COLLECTIONS_CONFIG, SITE_URL } from '../constants/site';
import { useProductCatalog } from '../context/ProductContext';
import { ProductCard } from '../components/ProductCard';
import { SeoHead } from '../components/SeoHead';
import { Icon } from '../components/ui/Icon';
import { NotFoundPage } from './NotFoundPage';

const SIZES = ['All', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];

export function CollectionsPage() {
  const { slug } = useParams<{ slug?: string }>();
  const { activeProducts } = useProductCatalog();

  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const activeCollection = slug
    ? COLLECTIONS_CONFIG.find((c) => c.slug === slug.toLowerCase())
    : undefined;

  const baseProducts = useMemo(() => {
    if (!activeCollection) return activeProducts;
    return activeProducts.filter((product) => {
      const haystack = `${product.name} ${product.category} ${product.tag}`.toLowerCase();
      return activeCollection.categoryKeywords.some((kw) => haystack.includes(kw));
    });
  }, [activeCollection, activeProducts]);

  const displayProducts = useMemo(() => {
    let result = baseProducts;

    if (selectedSize !== 'All') {
      result = result.filter((p) => {
        const variant = p.variants?.find((v) => v.size === selectedSize);
        return variant ? variant.stock > 0 : p.sizes?.includes(selectedSize);
      });
    }

    if (inStockOnly) {
      result = result.filter((p) => {
        const totalStock = p.variants ? p.variants.reduce((sum, v) => sum + v.stock, 0) : 1;
        return totalStock > 0;
      });
    }

    const sorted = [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

    return sorted;
  }, [baseProducts, selectedSize, inStockOnly, sortBy]);

  const isFilterActive = selectedSize !== 'All' || inStockOnly || sortBy !== 'featured';

  const resetFilters = () => {
    setSelectedSize('All');
    setInStockOnly(false);
    setSortBy('featured');
  };

  if (slug && !activeCollection) {
    return <NotFoundPage />;
  }

  const pageTitle = activeCollection
    ? activeCollection.seoTitle
    : 'All Footwear Collections | CraftYourSole';
  const pageDescription = activeCollection
    ? activeCollection.seoDescription
    : 'Browse all CraftYourSole footwear collections: handcrafted festive juttis, leather loafers, women’s block heels, daily slip-ons, and athletic runners.';
  const canonicalPath = activeCollection ? `/collections/${activeCollection.slug}` : '/collections';

  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Collections', item: `${SITE_URL}/collections` },
    ...(activeCollection
      ? [
          {
            '@type': 'ListItem',
            position: 3,
            name: activeCollection.name,
            item: `${SITE_URL}/collections/${activeCollection.slug}`,
          },
        ]
      : []),
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: activeCollection ? activeCollection.headline : 'All CraftYourSole Footwear Collections',
        description: pageDescription,
        url: `${SITE_URL}${canonicalPath}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems,
      },
    ],
  };

  return (
    <div className="bg-white text-gray-900 pb-16">
      <SeoHead
        title={pageTitle}
        description={pageDescription}
        canonicalPath={canonicalPath}
        image={activeCollection?.img}
        jsonLd={jsonLd}
      />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Icon name="home" className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span className="text-gray-300">/</span>
            {activeCollection ? (
              <>
                <Link to="/collections" className="hover:text-primary transition-colors">
                  Collections
                </Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-900 font-bold">{activeCollection.name}</span>
              </>
            ) : (
              <span className="text-gray-900 font-bold">Collections</span>
            )}
          </nav>
        </div>
      </div>

      {/* Collection Header */}
      <section className="bg-gray-950 text-white py-10 md:py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-orange-200 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3">
              {activeCollection ? activeCollection.countLabel : '7 Curated Occasions'}
            </span>
            <h1 className="font-anton text-3xl sm:text-4xl md:text-5xl tracking-wide uppercase">
              {activeCollection ? activeCollection.headline : 'All CraftYourSole Collections'}
            </h1>
            <p className="text-white/75 text-sm md:text-base mt-3 leading-relaxed">
              {activeCollection
                ? activeCollection.description
                : 'Explore handcrafted Indian festive footwear, Agra full-grain formal leather, women’s cushioned heels, and breathable daily slip-ons built for Indian feet.'}
            </p>
          </div>
          <Link
            to="/size-guide"
            className="w-fit inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Icon name="tag" className="w-4 h-4 text-primary" />
            <span>Check UK / EU Size Guide</span>
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Category Switcher Pills */}
        <div className="flex flex-wrap gap-2">
          <Link
            to="/collections"
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-colors border ${
              !activeCollection
                ? 'bg-primary text-white border-primary'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            All Footwear
          </Link>
          {COLLECTIONS_CONFIG.map((col) => (
            <Link
              key={col.slug}
              to={`/collections/${col.slug}`}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-colors border ${
                activeCollection?.slug === col.slug
                  ? 'bg-primary text-white border-primary'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {col.name}
            </Link>
          ))}
        </div>

        {/* Multi-Attribute Filtering & Sorting Controls Bar */}
        <div className="bg-gray-50 border border-gray-200/90 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Size Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider mr-1">
                Size:
              </span>
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'bg-gray-900 text-white shadow-xs'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* In Stock & Sort Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-primary rounded accent-primary cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="featured">Featured / Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
              </div>

              {isFilterActive && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-primary hover:underline font-bold cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid / Empty State */}
        {activeProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200/90 p-10 md:p-14 text-center max-w-lg mx-auto my-8 shadow-xs">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="package" className="w-8 h-8" />
            </div>
            <h3 className="font-anton text-2xl text-gray-900 tracking-wide uppercase">
              Footwear Catalog Launching Soon
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 leading-relaxed">
              Our handcrafted footwear catalog is completely ready for real styles. Products added in the Admin Portal will automatically appear here with full size-level inventory.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors"
              >
                Back to Home
              </Link>
              <Link
                to="/admin"
                className="px-5 py-2.5 bg-primary hover:bg-[#8A2600] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Go to Admin Portal →
              </Link>
            </div>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200/90 p-10 md:p-14 text-center max-w-lg mx-auto my-8 shadow-xs">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="search" className="w-8 h-8" />
            </div>
            <h3 className="font-anton text-xl text-gray-900 tracking-wide uppercase">
              No Footwear Matches Your Filters
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 leading-relaxed">
              We couldn't find any footwear matching the selected size or in-stock filters in this collection.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-2.5 bg-primary hover:bg-[#8A2600] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-anton text-xl md:text-2xl uppercase tracking-wide text-gray-900">
                {activeCollection ? activeCollection.name : 'All Footwear'} ({displayProducts.length} Styles)
              </h2>
              <span className="text-xs text-gray-500">Pan-India Free Delivery • 7-Day Exchange</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  rating={p.rating}
                  price={`₹${p.price.toLocaleString('en-IN')}`}
                  originalPrice={`₹${p.originalPrice.toLocaleString('en-IN')}`}
                  tag={p.tag}
                  img={p.img}
                  stock={p.variants?.reduce((sum, v) => sum + v.stock, 0)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

