import { Link, useParams } from 'react-router-dom';
import { COLLECTIONS_CONFIG, SITE_URL } from '../constants/site';
import { useProductCatalog } from '../context/ProductContext';
import { ProductCard } from '../components/ProductCard';
import { SeoHead } from '../components/SeoHead';
import { Icon } from '../components/ui/Icon';
import { NotFoundPage } from './NotFoundPage';

export function CollectionsPage() {
  const { slug } = useParams<{ slug?: string }>();
  const { activeProducts } = useProductCatalog();

  const activeCollection = slug
    ? COLLECTIONS_CONFIG.find((c) => c.slug === slug.toLowerCase())
    : undefined;

  if (slug && !activeCollection) {
    return <NotFoundPage />;
  }

  const filteredProducts = activeCollection
    ? activeProducts.filter((product) => {
        const haystack = `${product.name} ${product.category} ${product.tag}`.toLowerCase();
        return activeCollection.categoryKeywords.some((kw) => haystack.includes(kw));
      })
    : activeProducts;

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : activeProducts;

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

        {/* Active Development & Catalog Rollout Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Catalog Expansion Under Active Development</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-950/85 leading-relaxed">
              {activeCollection
                ? activeCollection.roadmapNote
                : 'Full attribute filtering (size, heel height, material, and price range) and 750+ regional artisan styles are actively rolling out. Preview and order our flagship launch footwear below.'}
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 text-xs font-bold text-amber-900 bg-white border border-amber-300 hover:bg-amber-100 px-4 py-2 rounded-xl transition-colors w-fit"
          >
            Request Custom Sizing →
          </Link>
        </div>

        {/* Product Grid */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-anton text-xl md:text-2xl uppercase tracking-wide text-gray-900">
              Launch Collection ({displayProducts.length} Styles)
            </h2>
            <span className="text-xs text-gray-500">Pan-India Free Delivery • 7-Day Exchange</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayProducts.map((p) => (
              <ProductCard
                key={p.id}
                name={p.name}
                slug={p.slug}
                rating={p.rating}
                price={`₹${p.price.toLocaleString('en-IN')}`}
                originalPrice={`₹${p.originalPrice.toLocaleString('en-IN')}`}
                tag={p.tag}
                img={p.img}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

