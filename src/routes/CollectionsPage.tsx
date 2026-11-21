import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { COLLECTIONS_CONFIG, SITE_URL } from '../constants/site';
import {
  STANDARD_UK_SIZES,
  PRICE_RANGES,
  getSubcategoriesForCategory,
  getAllSubcategories,
} from '../constants/taxonomy';
import { useProductCatalog } from '../context/ProductContext';
import { ProductCard } from '../components/ProductCard';
import { SeoHead } from '../components/SeoHead';
import { Icon } from '../components/ui/Icon';
import { NotFoundPage } from './NotFoundPage';
import { FALLBACK_BEST_SELLERS } from '../lib/bestSellerAlgorithm';
import { MenCollectionShowcase } from '../components/MenCollectionShowcase';

export function CollectionsPage() {
  const { slug } = useParams<{ slug?: string }>();
  const { activeProducts } = useProductCatalog();

  // Multi-Filter State
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<'All' | 'Men' | 'Women' | 'Kids' | 'Unisex'>('All');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const activeCollection = slug
    ? COLLECTIONS_CONFIG.find((c) => c.slug === slug.toLowerCase())
    : undefined;

  // Subcategories available for active collection or full catalog
  const availableSubcategories = useMemo(() => {
    if (activeCollection) {
      const match = getSubcategoriesForCategory(activeCollection.name);
      if (match && match.length > 0) return match;
    }
    return getAllSubcategories();
  }, [activeCollection]);

  const baseProducts = useMemo(() => {
    const catalog = activeProducts.length > 0 ? activeProducts : FALLBACK_BEST_SELLERS;
    if (!activeCollection) return catalog;
    return catalog.filter((product) => {
      // Direct gender matching for gender collection routes
      if (
        activeCollection.slug === 'men' &&
        (product.gender === 'Men' || product.category.toLowerCase().includes('men'))
      ) {
        return true;
      }
      if (
        activeCollection.slug === 'women' &&
        (product.gender === 'Women' || product.category.toLowerCase().includes('women'))
      ) {
        return true;
      }
      if (
        activeCollection.slug === 'kids' &&
        (product.gender === 'Kids' || product.category.toLowerCase().includes('kid'))
      ) {
        return true;
      }
      const haystack = `${product.name} ${product.category} ${product.subcategory || ''} ${product.tag || ''} ${product.gender || ''}`.toLowerCase();
      return activeCollection.categoryKeywords.some((kw) => haystack.includes(kw));
    });
  }, [activeCollection, activeProducts]);

  const displayProducts = useMemo(() => {
    let result = baseProducts;

    // Filter: Subcategory
    if (selectedSubcategory !== 'All') {
      result = result.filter(
        (p) => p.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase()
      );
    }

    // Filter: Gender
    if (selectedGender !== 'All') {
      result = result.filter(
        (p) => !p.gender || p.gender === selectedGender || p.gender === 'Unisex'
      );
    }

    // Filter: UK Size & Stock by Size
    if (selectedSize !== 'All') {
      result = result.filter((p) => {
        const variant = p.variants?.find((v) => v.size === selectedSize);
        return variant ? variant.stock > 0 : p.sizes?.includes(selectedSize);
      });
    }

    // Filter: Total in-stock availability
    if (inStockOnly) {
      result = result.filter((p) => {
        const totalStock = p.variants ? p.variants.reduce((sum, v) => sum + v.stock, 0) : 1;
        return totalStock > 0;
      });
    }

    // Filter: Price Range
    if (selectedPriceRange !== 'all') {
      const range = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
      if (range) {
        result = result.filter((p) => p.price >= range.min && p.price < range.max);
      }
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [
    baseProducts,
    selectedSubcategory,
    selectedGender,
    selectedSize,
    inStockOnly,
    selectedPriceRange,
    sortBy,
  ]);

  const isFilterActive =
    selectedSubcategory !== 'All' ||
    selectedSize !== 'All' ||
    selectedGender !== 'All' ||
    selectedPriceRange !== 'all' ||
    inStockOnly ||
    sortBy !== 'featured';

  const resetFilters = () => {
    setSelectedSubcategory('All');
    setSelectedSize('All');
    setSelectedGender('All');
    setSelectedPriceRange('all');
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

      {/* Category Hero / Showcase Section */}
      {activeCollection?.slug === 'men' ? (
        <section className="bg-white pt-4 sm:pt-6 pb-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MenCollectionShowcase
              selectedSubcategory={selectedSubcategory}
              onSelectSubcategory={setSelectedSubcategory}
            />
          </div>
        </section>
      ) : (
        /* Default Collection Hero Header */
        <section className="bg-gray-950 text-white py-10 md:py-14 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-orange-200 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3">
                {activeCollection ? activeCollection.countLabel : 'Authentic Indian Craftsmanship'}
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
      )}

      <div id="men-catalog-filters" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 scroll-mt-24">
        {/* Curated Category Posters Matching Landing Page UI */}
        {!activeCollection && (
          <div className="space-y-3 pb-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider">
                Shop By Category
              </h2>
              <span className="text-xs text-gray-500">
                Men's, Women's &amp; Kids' Handcrafted Footwear
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 md:gap-6">
              <Link
                to="/collections/men"
                className="group relative block w-full aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-neutral-100 cursor-pointer border border-neutral-200/60"
                aria-label="Shop Men's Collection"
              >
                <picture className="w-full h-full block">
                  <source type="image/webp" srcSet="/hero/category-men.webp" />
                  <img
                    src="/hero/category-men.jpg"
                    alt="Men's Collection - Handcrafted Retro Casual Sneakers"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </picture>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
              </Link>
              <Link
                to="/collections/women"
                className="group relative block w-full aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-neutral-100 cursor-pointer border border-neutral-200/60"
                aria-label="Shop Women's Collection"
              >
                <picture className="w-full h-full block">
                  <source type="image/webp" srcSet="/hero/category-women.webp" />
                  <img
                    src="/hero/category-women.jpg"
                    alt="Women's Collection - Dusty Rose Retro Casual Sneakers"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </picture>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
              </Link>
              <Link
                to="/collections/kids"
                className="group relative block w-full aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-neutral-100 cursor-pointer border border-neutral-200/60"
                aria-label="Shop Kids' Collection"
              >
                <picture className="w-full h-full block">
                  <source type="image/webp" srcSet="/hero/category-kids.webp" />
                  <img
                    src="/hero/category-kids.jpg"
                    alt="Playful Kids' Sneaker Collection"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </picture>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
              </Link>
            </div>
          </div>
        )}

        {/* Category Switcher Tabs (Hidden on Men's Collection per Reference Design) */}
        {activeCollection?.slug !== 'men' && (
          <div className="flex flex-wrap gap-2">
            <Link
              to="/collections"
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors border ${
                !activeCollection
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              All Footwear
            </Link>
            {COLLECTIONS_CONFIG.map((col) => (
              <Link
                key={col.slug}
                to={`/collections/${col.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors border ${
                  activeCollection?.slug === col.slug
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                {col.name}
              </Link>
            ))}
          </div>
        )}

        {/* Subcategories Filter Chips (Hidden on Men's Collection per Reference Design) */}
        {activeCollection?.slug !== 'men' && availableSubcategories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500 shrink-0 mr-1">
              Subcategory:
            </span>
            <button
              onClick={() => setSelectedSubcategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubcategory === 'All'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              All Styles
            </button>
            {availableSubcategories.map((subcat) => (
              <button
                key={subcat}
                onClick={() => setSelectedSubcategory(subcat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSubcategory === subcat
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {subcat}
              </button>
            ))}
          </div>
        )}

        {/* Multi-Attribute Filtering & Sorting Controls Bar (Hidden on Men's Collection per Reference Design) */}
        {activeCollection?.slug !== 'men' && (
          <div className="bg-gray-50 border border-gray-200/90 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Filter Group: Size, Price Range & Gender */}
              <div className="flex flex-wrap items-center gap-3">
                {/* UK Sizes Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider mr-1">
                    Size:
                  </span>
                  <button
                    onClick={() => setSelectedSize('All')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedSize === 'All'
                        ? 'bg-gray-900 text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    All
                  </button>
                  {STANDARD_UK_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Price Range Dropdown */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Price:
                  </span>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    {PRICE_RANGES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Gender Dropdown (When on All Footwear) */}
                {!activeCollection && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Gender:
                    </span>
                    <select
                      value={selectedGender}
                      onChange={(e) =>
                        setSelectedGender(e.target.value as 'All' | 'Men' | 'Women' | 'Kids' | 'Unisex')
                      }
                      className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    >
                      <option value="All">All Genders</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                )}
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
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Active Filter Badges */}
            {isFilterActive && (
              <div className="pt-2 border-t border-gray-200/60 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-400 text-[11px] font-medium">Applied Filters:</span>
                {selectedSubcategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2 py-0.5 rounded-md font-semibold text-gray-800">
                    {selectedSubcategory}
                    <button onClick={() => setSelectedSubcategory('All')} className="text-gray-400 hover:text-red-600">×</button>
                  </span>
                )}
                {selectedSize !== 'All' && (
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2 py-0.5 rounded-md font-semibold text-gray-800">
                    Size: {selectedSize}
                    <button onClick={() => setSelectedSize('All')} className="text-gray-400 hover:text-red-600">×</button>
                  </span>
                )}
                {selectedPriceRange !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2 py-0.5 rounded-md font-semibold text-gray-800">
                    {PRICE_RANGES.find((r) => r.id === selectedPriceRange)?.label}
                    <button onClick={() => setSelectedPriceRange('all')} className="text-gray-400 hover:text-red-600">×</button>
                  </span>
                )}
                {selectedGender !== 'All' && (
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2 py-0.5 rounded-md font-semibold text-gray-800">
                    Gender: {selectedGender}
                    <button onClick={() => setSelectedGender('All')} className="text-gray-400 hover:text-red-600">×</button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2 py-0.5 rounded-md font-semibold text-gray-800">
                    In Stock Only
                    <button onClick={() => setInStockOnly(false)} className="text-gray-400 hover:text-red-600">×</button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Product Grid / Empty States */}
        {displayProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200/90 p-10 md:p-14 text-center max-w-lg mx-auto my-8 shadow-xs">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="search" className="w-8 h-8" />
            </div>
            <h3 className="font-anton text-xl text-gray-900 tracking-wide uppercase">
              No Footwear Matches Your Filter Criteria
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 leading-relaxed">
              We couldn’t find any pairs matching your selected combination of subcategory, in-stock UK size, or price range.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-primary hover:bg-[#8A2600] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Reset All Filters
              </button>
              <Link
                to="/"
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div id="men-products-grid" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h2 className="font-anton text-xl md:text-2xl uppercase tracking-wide text-gray-900">
                  {activeCollection?.slug === 'men'
                    ? selectedSubcategory !== 'All'
                      ? selectedSubcategory
                      : 'All Men\'s Footwear'
                    : activeCollection
                    ? activeCollection.name
                    : 'All Footwear'}{' '}
                  ({displayProducts.length} Styles)
                </h2>
                {activeCollection?.slug === 'men' && selectedSubcategory !== 'All' && (
                  <button
                    onClick={() => setSelectedSubcategory('All')}
                    className="text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    View All →
                  </button>
                )}
              </div>
              <span className="text-xs text-gray-500 hidden sm:inline">
                Pan-India Free Delivery • 36-Hour Doorstep Size Exchange
              </span>
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
