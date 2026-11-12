import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { SeoHead } from '../components/SeoHead';
import { useProductCatalog } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import type { NewProductInput } from '../types/product';

const CATEGORIES = [
  'Festive & Ethnic',
  'Daily Comfort',
  "Women's Festive",
  'Gym & Sports',
  'Work & Formal',
  'Heritage Traditional',
];

const SAMPLE_IMAGES = [
  {
    label: 'Velvet Mojari (Jaipur)',
    url: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
  },
  {
    label: 'Knit Slip-On Loafer',
    url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
  },
  {
    label: 'Shimmer Block Heel',
    url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
  },
  {
    label: 'Athletic Runner',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
  },
  {
    label: 'Burnished Penny Loafer',
    url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
  },
];

export function AdminPage() {
  const navigate = useNavigate();
  const { products, addProduct, deleteProduct, toggleProductStatus, resetToDefaultCatalog } =
    useProductCatalog();
  const { orders, updateOrderStatus, metrics, resetOrders } = useOrders();

  const [activeTab, setActiveTab] = useState<'analytics' | 'catalog' | 'orders'>('analytics');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filters for Products
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Filters for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // Add Product Form State
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    tag: 'New Drop',
    price: 2995,
    originalPrice: 4495,
    description: '',
    story: '',
    upperMaterial: '',
    soleMaterial: '',
    insoleType: '',
    idealFor: '',
    artisanRegion: 'Jaipur, Rajasthan',
    img: SAMPLE_IMAGES[0].url,
    additionalImg1: '',
    additionalImg2: '',
    stockUK6: 15,
    stockUK7: 20,
    stockUK8: 30,
    stockUK9: 25,
    stockUK10: 15,
    stockUK11: 8,
  });

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [products, productSearch, categoryFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
      const matchesStatus = orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Handle Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.img.trim()) {
      alert('Please provide at least a Product Name and Image URL.');
      return;
    }

    const sizes = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];
    const variants = [
      { size: 'UK 6', stock: Number(formData.stockUK6) || 0 },
      { size: 'UK 7', stock: Number(formData.stockUK7) || 0 },
      { size: 'UK 8', stock: Number(formData.stockUK8) || 0 },
      { size: 'UK 9', stock: Number(formData.stockUK9) || 0 },
      { size: 'UK 10', stock: Number(formData.stockUK10) || 0 },
      { size: 'UK 11', stock: Number(formData.stockUK11) || 0 },
    ];

    const additionalImages: string[] = [];
    if (formData.additionalImg1) additionalImages.push(formData.additionalImg1);
    if (formData.additionalImg2) additionalImages.push(formData.additionalImg2);

    const newProd: NewProductInput = {
      name: formData.name.trim(),
      category: formData.category,
      tag: formData.tag.trim() || 'New Launch',
      price: Number(formData.price) || 2495,
      originalPrice: Number(formData.originalPrice) || Number(formData.price) + 1500,
      img: formData.img.trim(),
      additionalImages,
      description:
        formData.description.trim() ||
        'Engineered for maximum comfort with traditional craftsmanship and ergonomic memory foam footbed.',
      story:
        formData.story.trim() ||
        `Handcrafted by generational artisans in ${formData.artisanRegion}. Built for modern celebrations.`,
      upperMaterial: formData.upperMaterial.trim() || 'Handcrafted Premium Upper',
      soleMaterial: formData.soleMaterial.trim() || 'Durable Anti-Skid Grip Sole',
      insoleType: formData.insoleType.trim() || 'Ortho-Cushion Double Memory Foam',
      idealFor: formData.idealFor.trim() || 'Daily Wear, Celebrations & Festive Events',
      artisanRegion: formData.artisanRegion.trim() || 'Jaipur, Rajasthan',
      sizes,
      variants,
      isActive: true,
    };

    addProduct(newProd);
    setIsAddModalOpen(false);
    showToast(`"${formData.name}" was successfully added to your catalog and storefront!`);

    // Reset Form
    setFormData({
      name: '',
      category: CATEGORIES[0],
      tag: 'New Drop',
      price: 2995,
      originalPrice: 4495,
      description: '',
      story: '',
      upperMaterial: '',
      soleMaterial: '',
      insoleType: '',
      idealFor: '',
      artisanRegion: 'Jaipur, Rajasthan',
      img: SAMPLE_IMAGES[0].url,
      additionalImg1: '',
      additionalImg2: '',
      stockUK6: 15,
      stockUK7: 20,
      stockUK8: 30,
      stockUK9: 25,
      stockUK10: 15,
      stockUK11: 8,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SeoHead
        title="Admin Operations | CraftYourSole"
        description="CraftYourSole internal catalog and order management portal."
        canonicalPath="/admin"
        noindex
      />
      {/* Top Banner & Header */}
      <header className="bg-gray-900 text-white border-b border-gray-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Return to Customer Storefront"
              >
                <Icon name="arrow_left" className="w-4 h-4" />
                Storefront
              </button>
              <div className="h-4 w-px bg-gray-700" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span className="text-primary font-anton tracking-wider text-xl">CRAFTYOURSOLE</span>
                    <span>Admin Operations</span>
                  </h1>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Local Mock (Supabase-Ready)
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Sales analytics, inventory control & live catalog management
                </p>
              </div>
            </div>

            {/* Quick Stats Ticker */}
            <div className="flex items-center gap-4 text-xs">
              <div className="bg-gray-800/80 px-3 py-1.5 rounded-lg border border-gray-700/60 flex items-center gap-2">
                <span className="text-gray-400">Gross Sales:</span>
                <span className="font-bold text-emerald-400">
                  ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-gray-800/80 px-3 py-1.5 rounded-lg border border-gray-700/60 flex items-center gap-2">
                <span className="text-gray-400">Active SKUs:</span>
                <span className="font-bold text-white">{products.length}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-2 border-t border-gray-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon name="briefcase" className="w-4 h-4" />
              Sales & Analytics
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon name="running" className="w-4 h-4" />
              Product Catalog ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon name="shopping_bag" className="w-4 h-4" />
              Orders & Shipping ({orders.length})
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Toast Alert */}
        {successToast && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span className="text-sm font-semibold">{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-emerald-600 hover:text-emerald-900 text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* =========================================================================
            TAB 1: SALES & ANALYTICS
           ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue (GMV)</span>
                    <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <Icon name="card" className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                    ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                  </h3>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-xs text-emerald-600 font-semibold gap-1">
                  <span>↑ 28.4%</span>
                  <span className="text-gray-400 font-normal">vs previous 30 days</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                    <span className="p-2 bg-primary/10 text-primary rounded-lg">
                      <Icon name="shopping_bag" className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                    {metrics.totalOrdersCount}
                  </h3>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-xs text-gray-500 gap-1">
                  <span className="font-bold text-gray-800">
                    ₹{metrics.averageOrderValue.toLocaleString('en-IN')}
                  </span>
                  <span>Average Order Value</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Fulfillment Status</span>
                    <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Icon name="truck" className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                      {metrics.pendingOrdersCount}
                    </h3>
                    <span className="text-xs text-amber-600 font-bold uppercase">To Dispatch</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-xs text-gray-500 justify-between">
                  <span>{metrics.shippedOrdersCount} In Transit</span>
                  <span className="text-emerald-600 font-semibold">{metrics.deliveredOrdersCount} Delivered</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Storefront Conversion</span>
                    <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <Icon name="loyalty" className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">3.85%</h3>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-xs text-gray-400 justify-between">
                  <span>Festive Peak Season</span>
                  <span className="text-emerald-600 font-bold">High Intent</span>
                </div>
              </div>
            </div>

            {/* Sales Chart & Category Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Timeline Revenue Simulation */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">Revenue & Sales Trajectory</h4>
                    <p className="text-xs text-gray-500">Live order earnings across recent festival days</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs bg-gray-100 p-1 rounded-lg">
                    <span className="px-2.5 py-1 bg-white font-bold text-gray-900 rounded shadow-xs">Last 7 Days</span>
                    <span className="px-2.5 py-1 text-gray-500">30 Days</span>
                    <span className="px-2.5 py-1 text-gray-500">Festive Surge</span>
                  </div>
                </div>

                {/* Simulated Chart Bars */}
                <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-gray-100">
                  {[
                    { day: 'Mon', val: 18450, height: '45%' },
                    { day: 'Tue', val: 24300, height: '60%' },
                    { day: 'Wed', val: 31200, height: '75%' },
                    { day: 'Thu', val: 28900, height: '70%' },
                    { day: 'Fri', val: 36400, height: '85%' },
                    { day: 'Sat', val: 42100, height: '95%' },
                    { day: 'Sun (Today)', val: 44275, height: '100%', highlight: true },
                  ].map((bar) => (
                    <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="text-[10px] font-bold text-gray-400 group-hover:text-primary transition-colors">
                        ₹{(bar.val / 1000).toFixed(1)}k
                      </div>
                      <div className="w-full bg-gray-100 rounded-t-lg relative flex items-end h-40 overflow-hidden">
                        <div
                          style={{ height: bar.height }}
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            bar.highlight
                              ? 'bg-gradient-to-t from-primary to-[#ff5722]'
                              : 'bg-gray-800 hover:bg-gray-700'
                          }`}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-600 truncate">{bar.day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
                  <span>₹0 Base</span>
                  <span className="font-medium text-gray-600">Peak Daily GMV: ₹44,275</span>
                </div>
              </div>

              {/* Category Share */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">Sales by Footwear Category</h4>
                  <p className="text-xs text-gray-500 mb-6">Percentage share of revenue</p>

                  <div className="space-y-4">
                    {[
                      { name: 'Festive & Ethnic (Mojaris)', share: 42, color: 'bg-primary' },
                      { name: 'Daily Comfort (Slip-ons)', share: 28, color: 'bg-amber-600' },
                      { name: "Women's Festive (Heels)", share: 18, color: 'bg-purple-600' },
                      { name: 'Gym & Sports Runners', share: 12, color: 'bg-blue-600' },
                    ].map((cat) => (
                      <div key={cat.name}>
                        <div className="flex justify-between text-xs font-semibold text-gray-800 mb-1">
                          <span className="truncate">{cat.name}</span>
                          <span>{cat.share}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cat.color}`}
                            style={{ width: `${cat.share}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/60 mt-6 text-xs text-gray-600">
                  <span className="font-bold text-gray-900 block mb-0.5">💡 Inventory Recommendation</span>
                  Mojaris in sizes UK 8 & UK 9 have a 92% sell-through rate. Restock recommended before wedding dates.
                </div>
              </div>
            </div>

            {/* Top-Selling Products Table */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-gray-900">Top-Selling Footwear</h4>
                  <p className="text-xs text-gray-500">Highest grossing SKUs across customer orders</p>
                </div>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="text-xs font-bold text-primary hover:underline uppercase tracking-wider cursor-pointer"
                >
                  Manage All Products →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Selling Price</th>
                      <th className="py-3 px-4">Total Units Sold</th>
                      <th className="py-3 px-4">Stock Status</th>
                      <th className="py-3 px-4">Gross Sales</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.slice(0, 5).map((prod) => {
                      const totalStock =
                        prod.variants?.reduce((sum, v) => sum + v.stock, 0) || 50;
                      return (
                        <tr key={prod.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.img}
                                alt={prod.name}
                                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                              />
                              <div>
                                <div className="font-bold text-gray-900 text-sm">{prod.name}</div>
                                <div className="text-[11px] text-gray-400">SKU: {prod.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-700">{prod.category}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-800">
                            {prod.totalSold.toLocaleString('en-IN')} pairs
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                                totalStock > 20
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {totalStock} in stock
                            </span>
                          </td>
                          <td className="py-3 px-4 font-extrabold text-emerald-600 text-sm">
                            ₹{(prod.price * prod.totalSold).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PRODUCT CATALOG (PIM)
           ========================================================================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by product name or keyword..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 pl-9 text-xs text-gray-900 focus:outline-none focus:border-primary"
                  />
                  <Icon
                    name="search"
                    className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                  />
                </div>

                {/* Category Dropdown */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 font-medium focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-primary hover:bg-[#8a2600] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <span className="text-base leading-none">+</span>
                  Add New Product
                </button>

                <button
                  onClick={() => {
                    if (confirm('Reset catalog to default seed products?')) {
                      resetToDefaultCatalog();
                      showToast('Catalog restored to default seed products.');
                    }
                  }}
                  className="border border-gray-200 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title="Reset catalog"
                >
                  Reset Demo Data
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Showing {filteredProducts.length} Products
                </span>
                <span className="text-xs text-gray-400">
                  Products with green toggles appear immediately on the storefront
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Footwear</th>
                      <th className="py-3 px-4">Category & Tag</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">MRP</th>
                      <th className="py-3 px-4">Stock (Across Sizes)</th>
                      <th className="py-3 px-4">Storefront Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((prod) => {
                      const totalStock =
                        prod.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                      return (
                        <tr key={prod.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.img}
                                alt={prod.name}
                                className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                              />
                              <div>
                                <div className="font-bold text-gray-900 text-sm">{prod.name}</div>
                                <div className="text-[11px] text-gray-400">
                                  {prod.artisanRegion || 'Jaipur Craft'}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-medium text-gray-800 block">{prod.category}</span>
                            {prod.tag && (
                              <span className="inline-block mt-0.5 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-semibold">
                                {prod.tag}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-bold text-gray-900 text-sm">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </td>

                          <td className="py-3.5 px-4 text-gray-400 line-through">
                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-gray-800">{totalStock} pairs</div>
                            <div className="text-[10px] text-gray-400">
                              Sizes: {prod.sizes.join(', ')}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => toggleProductStatus(prod.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                prod.isActive
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {prod.isActive ? '● Live on Store' : '○ Draft / Hidden'}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Delete "${prod.name}" from catalog?`)) {
                                  deleteProduct(prod.id);
                                  showToast(`Removed "${prod.name}" from catalog.`);
                                }
                              }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Icon name="trash" className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-400">
                          No products found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: ORDERS & SHIPPING
           ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order #, Customer Name or Email..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 pl-9 text-xs text-gray-900 focus:outline-none focus:border-primary"
                  />
                  <Icon
                    name="search"
                    className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 font-medium focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="All">All Order Statuses</option>
                  <option value="PENDING">Pending Verification</option>
                  <option value="PACKING">Packing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>

              <button
                onClick={() => {
                  if (confirm('Reset orders to sample data?')) {
                    resetOrders();
                    showToast('Orders reset to demo records.');
                  }
                }}
                className="border border-gray-200 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Reset Demo Orders
              </button>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-anton text-base text-gray-900 tracking-wider">
                        {ord.orderNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.orderStatus === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.orderStatus === 'PACKING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          ord.paymentStatus === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {ord.paymentMethod} • {ord.paymentStatus}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                      <span>
                        <strong className="text-gray-900">Customer:</strong> {ord.customerName} (
                        {ord.customerPhone})
                      </span>
                      <span>
                        <strong className="text-gray-900">Destination:</strong>{' '}
                        {ord.shippingAddress.city}, {ord.shippingAddress.state} -{' '}
                        {ord.shippingAddress.pincode}
                      </span>
                    </div>

                    {/* Order items preview */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-gray-50 border border-gray-200/60 px-2 py-1 rounded-lg text-xs"
                        >
                          <img
                            src={item.img}
                            alt={item.productName}
                            className="w-6 h-6 object-cover rounded"
                          />
                          <span className="font-medium text-gray-800 truncate max-w-[160px]">
                            {item.productName}
                          </span>
                          <span className="text-gray-500 font-bold">({item.size})</span>
                          <span className="text-gray-400">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Status Transition Controls */}
                  <div className="flex flex-col sm:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0">
                    <div className="sm:text-right">
                      <div className="text-xs text-gray-400">Total Payable</div>
                      <div className="text-lg font-extrabold text-gray-900">
                        ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Quick Status Changers */}
                    <div className="flex items-center gap-1.5">
                      {ord.orderStatus === 'PENDING' && (
                        <button
                          onClick={() => {
                            updateOrderStatus(ord.id, 'PACKING');
                            showToast(`Order ${ord.orderNumber} moved to PACKING.`);
                          }}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Mark as Packing
                        </button>
                      )}

                      {ord.orderStatus === 'PACKING' && (
                        <button
                          onClick={() => {
                            updateOrderStatus(ord.id, 'SHIPPED');
                            showToast(`Order ${ord.orderNumber} marked as SHIPPED with tracking.`);
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Dispatch / Ship
                        </button>
                      )}

                      {ord.orderStatus === 'SHIPPED' && (
                        <button
                          onClick={() => {
                            updateOrderStatus(ord.id, 'DELIVERED');
                            showToast(`Order ${ord.orderNumber} marked as DELIVERED.`);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Confirm Delivery
                        </button>
                      )}

                      {ord.orderStatus === 'DELIVERED' && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <span>✓</span> Completed & Delivered
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
                  No orders found for the selected filter.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          "ADD NEW PRODUCT" WIZARD MODAL
         ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col animate-scale-up">
            {/* Modal Header */}
            <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-anton text-xl md:text-2xl text-gray-900 tracking-wide uppercase">
                  ADD NEW FOOTWEAR TO CATALOG
                </h3>
                <p className="text-xs text-gray-500">
                  Product will be saved and immediately visible on your customer storefront
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddProductSubmit} className="p-5 md:p-6 space-y-6">
              {/* Section 1: Basic Info */}
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                  1. Basic Details & Pricing
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Zari Velvet Mojari"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Tag / Badge</label>
                    <input
                      type="text"
                      placeholder="e.g. Festive Spotlight, Bestseller"
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Original MRP (₹)
                    </label>
                    <input
                      type="number"
                      min={100}
                      value={formData.originalPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, originalPrice: Number(e.target.value) })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Craftsmanship & Specs */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                  2. Artisan Heritage & Materials
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Artisan Origin / City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jaipur, Rajasthan or Agra, UP"
                      value={formData.artisanRegion}
                      onChange={(e) => setFormData({ ...formData, artisanRegion: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Upper Material
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pure Velvet with Hand-Embroidered Zari"
                      value={formData.upperMaterial}
                      onChange={(e) => setFormData({ ...formData, upperMaterial: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Sole Material</label>
                    <input
                      type="text"
                      placeholder="e.g. Buff-Tanned Leather with Anti-Skid Rubber"
                      value={formData.soleMaterial}
                      onChange={(e) => setFormData({ ...formData, soleMaterial: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Insole Ergonomics
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6mm Ortho-Cushion Double Memory Foam"
                      value={formData.insoleType}
                      onChange={(e) => setFormData({ ...formData, insoleType: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Artisan Story & Backstory
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Narrative about the artisan craft and heritage behind this footwear..."
                      value={formData.story}
                      onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Media & Images */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                  3. Images & Showcase Media
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Primary Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={formData.img}
                      onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Sample Quick Pick Buttons */}
                  <div>
                    <span className="text-[11px] text-gray-500 block mb-1.5 font-semibold">
                      Or pick a sample footwear image for testing:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {SAMPLE_IMAGES.map((sample) => (
                        <button
                          key={sample.label}
                          type="button"
                          onClick={() => setFormData({ ...formData, img: sample.url })}
                          className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                            formData.img === sample.url
                              ? 'bg-primary text-white border-primary'
                              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Preview */}
                  {formData.img && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200/80">
                      <img
                        src={formData.img}
                        alt="Preview"
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = SAMPLE_IMAGES[0].url;
                        }}
                      />
                      <div className="text-xs">
                        <span className="font-bold text-gray-900 block">Image Preview</span>
                        <span className="text-gray-400 text-[11px]">
                          This thumbnail will be used on cards & catalog shelves.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Size & Inventory Matrix */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  4. Initial Stock per UK Size
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  Specify initial inventory for each size variant:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {([
                    { label: 'UK 6', key: 'stockUK6' },
                    { label: 'UK 7', key: 'stockUK7' },
                    { label: 'UK 8', key: 'stockUK8' },
                    { label: 'UK 9', key: 'stockUK9' },
                    { label: 'UK 10', key: 'stockUK10' },
                    { label: 'UK 11', key: 'stockUK11' },
                  ] as const).map((s) => (
                    <div key={s.label} className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-center">
                      <span className="block text-[11px] font-bold text-gray-700 mb-1">
                        {s.label}
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={formData[s.key]}
                        onChange={(e) =>
                          setFormData({ ...formData, [s.key]: Number(e.target.value) })
                        }
                        className="w-full text-center bg-white border border-gray-200 rounded-lg py-1 text-xs font-bold text-gray-900 focus:outline-none focus:border-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-[#8a2600] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                >
                  Publish Footwear →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
