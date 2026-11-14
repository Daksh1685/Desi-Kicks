import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { SeoHead } from '../components/SeoHead';
import { useProductCatalog } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import type { Product, NewProductInput } from '../types/product';
import {
  getAllCategories,
  getSubcategoriesForCategory,
} from '../constants/taxonomy';

const CATEGORIES = getAllCategories();

export function AdminPage() {
  const navigate = useNavigate();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    resetToDefaultCatalog,
  } = useProductCatalog();
  const { orders, updateOrderStatus, metrics, clearAllOrders, resetOrders } = useOrders();

  // Admin Credentials Authentication (No Google Auth)
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    try {
      return (
        sessionStorage.getItem('craftyoursole_admin_authorized') === 'true' ||
        localStorage.getItem('craftyoursole_admin_authorized') === 'true'
      );
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState<string>(() => {
    try {
      return (
        sessionStorage.getItem('craftyoursole_admin_user') ||
        localStorage.getItem('craftyoursole_admin_user') ||
        'admin@craftyoursole.in'
      );
    } catch {
      return 'admin@craftyoursole.in';
    }
  });

  const [loginUser, setLoginUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedUser = (import.meta.env.VITE_ADMIN_USER || 'admin@craftyoursole.in')
      .trim()
      .toLowerCase();
    const expectedPass =
      import.meta.env.VITE_ADMIN_PASSWORD ||
      import.meta.env.VITE_ADMIN_PASSCODE ||
      'craftyoursole2026';

    const enteredUser = loginUser.trim().toLowerCase();
    const enteredPass = loginPassword.trim();

    // Accept configured user, 'admin', or 'admin@craftyoursole.in'
    const isUserValid =
      enteredUser === expectedUser ||
      enteredUser === 'admin' ||
      enteredUser === 'admin@craftyoursole.in';
    const isPassValid = enteredPass === expectedPass;

    if (isUserValid && isPassValid) {
      setIsAuthorized(true);
      setAdminUser(enteredUser);
      setLoginError(null);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('craftyoursole_admin_authorized', 'true');
      storage.setItem('craftyoursole_admin_user', enteredUser);
    } else {
      setLoginError('Invalid Administrator Username or Password. Access denied.');
    }
  };

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem('craftyoursole_admin_authorized');
      sessionStorage.removeItem('craftyoursole_admin_user');
      localStorage.removeItem('craftyoursole_admin_authorized');
      localStorage.removeItem('craftyoursole_admin_user');
    } catch {
      // ignore
    }
    setIsAuthorized(false);
  };

  const [activeTab, setActiveTab] = useState<'analytics' | 'catalog' | 'orders'>('analytics');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filters for Products
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subcategoryFilter, setSubcategoryFilter] = useState('All');

  // Filters for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // Add Product Form State
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    subcategory: getSubcategoriesForCategory(CATEGORIES[0])[0] || '',
    gender: 'Unisex' as 'Men' | 'Women' | 'Unisex',
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
    img: '',
    additionalImg1: '',
    additionalImg2: '',
    additionalImg3: '',
    additionalImg4: '',
    stockUK6: 0,
    stockUK7: 0,
    stockUK8: 0,
    stockUK9: 0,
    stockUK10: 0,
    stockUK11: 0,
  });

  // Edit Product State (FR-23)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    subcategory: '',
    gender: 'Unisex' as 'Men' | 'Women' | 'Unisex',
    tag: '',
    price: 0,
    originalPrice: 0,
    description: '',
    story: '',
    upperMaterial: '',
    soleMaterial: '',
    insoleType: '',
    idealFor: '',
    artisanRegion: '',
    img: '',
    additionalImg1: '',
    additionalImg2: '',
    additionalImg3: '',
    additionalImg4: '',
    stockUK6: 0,
    stockUK7: 0,
    stockUK8: 0,
    stockUK9: 0,
    stockUK10: 0,
    stockUK11: 0,
  });

  const handleOpenEditModal = (prod: Product) => {
    setEditingProductId(prod.id);
    const vStock = (size: string) => prod.variants?.find((v) => v.size === size)?.stock ?? 0;
    const addImages = prod.additionalImages || [];
    setEditFormData({
      name: prod.name,
      category: prod.category,
      subcategory: prod.subcategory || getSubcategoriesForCategory(prod.category)[0] || '',
      gender: prod.gender || 'Unisex',
      tag: prod.tag || '',
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      description: prod.description || '',
      story: prod.story || '',
      upperMaterial: prod.upperMaterial || '',
      soleMaterial: prod.soleMaterial || '',
      insoleType: prod.insoleType || '',
      idealFor: prod.idealFor || '',
      artisanRegion: prod.artisanRegion || '',
      img: prod.img,
      additionalImg1: addImages[0] || '',
      additionalImg2: addImages[1] || '',
      additionalImg3: addImages[2] || '',
      additionalImg4: addImages[3] || '',
      stockUK6: vStock('UK 6'),
      stockUK7: vStock('UK 7'),
      stockUK8: vStock('UK 8'),
      stockUK9: vStock('UK 9'),
      stockUK10: vStock('UK 10'),
      stockUK11: vStock('UK 11'),
    });
    setIsEditModalOpen(true);
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId || !editFormData.name.trim() || !editFormData.img.trim()) {
      alert('Please provide product name and image URL.');
      return;
    }

    const sizes = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];
    const variants = [
      { size: 'UK 6', stock: Number(editFormData.stockUK6) || 0 },
      { size: 'UK 7', stock: Number(editFormData.stockUK7) || 0 },
      { size: 'UK 8', stock: Number(editFormData.stockUK8) || 0 },
      { size: 'UK 9', stock: Number(editFormData.stockUK9) || 0 },
      { size: 'UK 10', stock: Number(editFormData.stockUK10) || 0 },
      { size: 'UK 11', stock: Number(editFormData.stockUK11) || 0 },
    ];

    const additionalImages = [
      editFormData.additionalImg1,
      editFormData.additionalImg2,
      editFormData.additionalImg3,
      editFormData.additionalImg4,
    ].map((s) => s.trim()).filter(Boolean);

    updateProduct(editingProductId, {
      name: editFormData.name.trim(),
      category: editFormData.category,
      subcategory: editFormData.subcategory.trim() || undefined,
      gender: editFormData.gender,
      tag: editFormData.tag.trim(),
      price: Number(editFormData.price) || 2495,
      originalPrice: Number(editFormData.originalPrice) || Number(editFormData.price) + 1500,
      description: editFormData.description.trim(),
      story: editFormData.story.trim(),
      upperMaterial: editFormData.upperMaterial.trim(),
      soleMaterial: editFormData.soleMaterial.trim(),
      insoleType: editFormData.insoleType.trim(),
      idealFor: editFormData.idealFor.trim(),
      artisanRegion: editFormData.artisanRegion.trim(),
      img: editFormData.img.trim(),
      additionalImages,
      sizes,
      variants,
    });

    setIsEditModalOpen(false);
    setEditingProductId(null);
    showToast(`"${editFormData.name}" was successfully updated.`);
  };

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(productSearch.toLowerCase()));
      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesSubcat = subcategoryFilter === 'All' || p.subcategory === subcategoryFilter;
      return matchesSearch && matchesCat && matchesSubcat;
    });
  }, [products, productSearch, categoryFilter, subcategoryFilter]);

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

  // 7-day trailing daily revenue calculated from real customer orders
  const dailyRevenue = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const list: { day: string; dateStr: string; val: number; count: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      const dayLabel = i === 0 ? 'Today' : dayNames[d.getDay()];

      const dayOrders = orders.filter((o) => {
        if (!o.createdAt) return false;
        return o.createdAt.slice(0, 10) === dateKey;
      });

      const val = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      list.push({ day: dayLabel, dateStr: dateKey, val, count: dayOrders.length });
    }
    return list;
  }, [orders]);

  const peakDailyGmv = useMemo(() => {
    const max = Math.max(...dailyRevenue.map((d) => d.val));
    return max > 0 ? max : 0;
  }, [dailyRevenue]);

  // Real category share calculated from orders (or catalog distribution if zero orders)
  const categoryBreakdown = useMemo(() => {
    const catMap = new Map<string, { revenue: number; units: number; skus: number }>();
    CATEGORIES.forEach((cat) => catMap.set(cat, { revenue: 0, units: 0, skus: 0 }));

    products.forEach((p) => {
      const cur = catMap.get(p.category) || { revenue: 0, units: 0, skus: 0 };
      catMap.set(p.category, { ...cur, skus: cur.skus + 1 });
    });

    orders.forEach((o) => {
      o.items.forEach((item) => {
        const prod = products.find(
          (p) => p.id === item.productId || p.name === item.productName
        );
        const cat = prod?.category || 'Festive & Ethnic';
        const cur = catMap.get(cat) || { revenue: 0, units: 0, skus: 0 };
        catMap.set(cat, {
          ...cur,
          revenue: cur.revenue + item.price * item.quantity,
          units: cur.units + item.quantity,
        });
      });
    });

    const totalRev = metrics.totalRevenue;
    const colors = ['bg-primary', 'bg-amber-600', 'bg-purple-600', 'bg-blue-600', 'bg-emerald-600', 'bg-rose-600'];

    return Array.from(catMap.entries()).map(([name, data], idx) => {
      const share =
        totalRev > 0
          ? Math.round((data.revenue / totalRev) * 100)
          : products.length > 0
          ? Math.round((data.skus / products.length) * 100)
          : 0;
      return {
        name,
        revenue: data.revenue,
        units: data.units,
        skus: data.skus,
        share,
        color: colors[idx % colors.length],
      };
    });
  }, [orders, products, metrics.totalRevenue]);

  // Real low stock alerts (variants with <= 5 pairs)
  const lowStockAlerts = useMemo(() => {
    const list: { product: string; size: string; stock: number }[] = [];
    products.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.stock <= 5) {
          list.push({ product: p.name, size: v.size, stock: v.stock });
        }
      });
    });
    return list;
  }, [products]);

  // Real sales performance per footwear model
  const productSales = useMemo(() => {
    const salesMap = new Map<string, { units: number; revenue: number }>();
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const key = item.productId || item.productName;
        const cur = salesMap.get(key) || { units: 0, revenue: 0 };
        salesMap.set(key, {
          units: cur.units + item.quantity,
          revenue: cur.revenue + item.price * item.quantity,
        });
      });
    });

    return products
      .map((prod) => {
        const fromOrders = salesMap.get(prod.id) || salesMap.get(prod.name) || { units: 0, revenue: 0 };
        const totalStock = prod.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
        return {
          product: prod,
          unitsSold: fromOrders.units,
          grossSales: fromOrders.revenue,
          totalStock,
        };
      })
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);
  }, [products, orders]);

  const totalInventoryPairs = useMemo(() => {
    return products.reduce(
      (acc, p) => acc + (p.variants?.reduce((s, v) => s + v.stock, 0) || 0),
      0
    );
  }, [products]);

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

    const additionalImages: string[] = [
      formData.additionalImg1,
      formData.additionalImg2,
      formData.additionalImg3,
      formData.additionalImg4,
    ].map((s) => s.trim()).filter(Boolean);

    const newProd: NewProductInput = {
      name: formData.name.trim(),
      category: formData.category,
      subcategory: formData.subcategory.trim() || undefined,
      gender: formData.gender,
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
      subcategory: getSubcategoriesForCategory(CATEGORIES[0])[0] || '',
      gender: 'Unisex',
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
      img: '',
      additionalImg1: '',
      additionalImg2: '',
      additionalImg3: '',
      additionalImg4: '',
      stockUK6: 0,
      stockUK7: 0,
      stockUK8: 0,
      stockUK9: 0,
      stockUK10: 0,
      stockUK11: 0,
    });
  };

  // Render dedicated administrator credentials login screen (No Google Auth)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between font-sans">
        <SeoHead
          title="Admin Login | CraftYourSole"
          description="Restricted Administrator Operations Portal."
          canonicalPath="/admin"
          noindex
        />
        <div className="max-w-md w-full mx-auto p-6 my-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* Header / Brand */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-primary">
                <Icon name="lock" className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary block">
                Restricted System
              </span>
              <h2 className="font-anton text-2xl sm:text-3xl tracking-wide uppercase text-white mt-1">
                Admin Operations
              </h2>
              <p className="text-xs text-gray-400 mt-1.5">
                Sign in with your administrator credentials.
              </p>
            </div>

            {loginError && (
              <div className="mb-5 p-3.5 bg-red-950/60 border border-red-800/80 rounded-2xl text-xs text-red-200 animate-fade-in">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-red-400">
                  <span>⛔</span> Access Denied
                </div>
                <p className="text-[11px] leading-relaxed">{loginError}</p>
              </div>
            )}

            {/* Admin Credentials Login Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Administrator Username or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginUser}
                    onChange={(e) => {
                      setLoginUser(e.target.value);
                      setLoginError(null);
                    }}
                    placeholder="admin@craftyoursole.in"
                    autoComplete="username"
                    className="w-full bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 pl-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                  <Icon
                    name="person"
                    className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError(null);
                    }}
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    className="w-full bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 pl-10 pr-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary font-mono"
                  />
                  <Icon
                    name="lock"
                    className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs cursor-pointer select-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-primary hover:bg-[#8a2600] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md mt-2"
              >
                Sign In to Admin Portal →
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-800 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-xs text-gray-400 hover:text-white font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Icon name="arrow_left" className="w-3.5 h-3.5" />
                Return to Storefront
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Operations
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Sales analytics, inventory control &amp; live catalog management
                </p>
              </div>
            </div>

            {/* Quick Stats Ticker & Auth Lock */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
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
              <div className="bg-gray-800/80 px-3 py-1.5 rounded-lg border border-gray-700/60 flex items-center gap-2">
                <span className="text-gray-400">Total Stock:</span>
                <span className="font-bold text-white">
                  {totalInventoryPairs.toLocaleString('en-IN')} pairs
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-gray-800/80 px-3 py-1.5 rounded-lg border border-gray-700/60">
                <Icon name="person" className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-white">{adminUser}</span>
              </div>
              <button
                onClick={handleAdminLogout}
                className="flex items-center gap-1.5 text-xs font-bold text-red-300 hover:text-white bg-red-950/60 hover:bg-red-900 border border-red-800/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Lock admin session and sign out"
              >
                <Icon name="lock" className="w-3.5 h-3.5" />
                Lock &amp; Sign Out
              </button>
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
                    <span className="text-xs font-bold uppercase tracking-wider">Inventory Buffer</span>
                    <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <Icon name="archive" className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                    {totalInventoryPairs.toLocaleString('en-IN')}
                    <span className="text-xs text-gray-400 font-normal ml-1.5">pairs</span>
                  </h3>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-xs justify-between">
                  <span className="text-gray-500">{products.length} Active SKUs</span>
                  <span
                    className={
                      lowStockAlerts.length > 0
                        ? 'text-amber-600 font-bold'
                        : 'text-emerald-600 font-semibold'
                    }
                  >
                    {lowStockAlerts.length > 0
                      ? `⚠️ ${lowStockAlerts.length} variants low (≤5)`
                      : '✅ All variants stocked'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sales Chart & Category Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Timeline Revenue Simulation */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">Revenue &amp; Sales Trajectory</h4>
                    <p className="text-xs text-gray-500">Live order earnings across trailing 7 days</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs bg-gray-100 p-1 rounded-lg">
                    <span className="px-2.5 py-1 bg-white font-bold text-gray-900 rounded shadow-xs">
                      Trailing 7 Days
                    </span>
                  </div>
                </div>

                {/* Trailing 7-Day Chart Bars */}
                <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-gray-100">
                  {dailyRevenue.map((bar, idx) => {
                    const isToday = idx === dailyRevenue.length - 1;
                    const heightPercent =
                      peakDailyGmv > 0
                        ? Math.max(8, Math.round((bar.val / peakDailyGmv) * 100))
                        : 6;
                    return (
                      <div key={bar.dateStr} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="text-[10px] font-bold text-gray-400 group-hover:text-primary transition-colors">
                          {bar.val > 0 ? `₹${(bar.val / 1000).toFixed(1)}k` : '₹0'}
                        </div>
                        <div className="w-full bg-gray-100 rounded-t-lg relative flex items-end h-40 overflow-hidden">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-t-lg transition-all duration-500 ${
                              isToday
                                ? 'bg-gradient-to-t from-primary to-[#ff5722]'
                                : bar.val > 0
                                ? 'bg-gray-800 hover:bg-gray-700'
                                : 'bg-gray-300'
                            }`}
                            title={`${bar.day} (${bar.dateStr}): ₹${bar.val.toLocaleString('en-IN')} (${bar.count} orders)`}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-gray-600 truncate">{bar.day}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
                  <span>₹0 Base</span>
                  <span className="font-medium text-gray-600">
                    Peak Daily GMV: ₹{peakDailyGmv.toLocaleString('en-IN')} •{' '}
                    {dailyRevenue.reduce((acc, d) => acc + d.count, 0)} orders placed
                  </span>
                </div>
              </div>

              {/* Category Share */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">Sales by Footwear Category</h4>
                  <p className="text-xs text-gray-500 mb-6">Percentage share of revenue or catalog SKUs</p>

                  <div className="space-y-4">
                    {categoryBreakdown.map((cat) => (
                      <div key={cat.name}>
                        <div className="flex justify-between text-xs font-semibold text-gray-800 mb-1">
                          <span className="truncate">{cat.name} ({cat.skus} SKUs)</span>
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
                  <span className="font-bold text-gray-900 block mb-0.5">💡 Inventory Health Alert</span>
                  {lowStockAlerts.length > 0 ? (
                    <span>
                      Low stock in {lowStockAlerts.length} variant(s):{' '}
                      <strong>
                        {lowStockAlerts
                          .slice(0, 3)
                          .map((a) => `${a.product} (${a.size}: ${a.stock} left)`)
                          .join(', ')}
                        {lowStockAlerts.length > 3 ? ` + ${lowStockAlerts.length - 3} more` : ''}
                      </strong>
                      . Restock recommended.
                    </span>
                  ) : (
                    <span>All footwear size variants have healthy buffer inventory (&gt;5 pairs).</span>
                  )}
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
                    {productSales.map(({ product: prod, unitsSold, grossSales, totalStock }) => (
                      <tr key={prod.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.img}
                              alt={prod.name}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
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
                          {unitsSold > 0 ? `${unitsSold} pairs` : `${prod.totalSold || 0} pairs`}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                              totalStock > 20
                                ? 'bg-emerald-50 text-emerald-700'
                                : totalStock > 0
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {totalStock > 0 ? `${totalStock} in stock` : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-extrabold text-emerald-600 text-sm">
                          ₹
                          {(grossSales > 0
                            ? grossSales
                            : prod.price * (prod.totalSold || 0)
                          ).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
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
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setSubcategoryFilter('All');
                  }}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 font-medium focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {/* Subcategory Dropdown */}
                {categoryFilter !== 'All' && getSubcategoriesForCategory(categoryFilter).length > 0 && (
                  <select
                    value={subcategoryFilter}
                    onChange={(e) => setSubcategoryFilter(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 font-medium focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="All">All Subcategories</option>
                    {getSubcategoriesForCategory(categoryFilter).map((subcat) => (
                      <option key={subcat} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                  </select>
                )}
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
                    if (
                      confirm(
                        'Clear all products from the catalog?'
                      )
                    ) {
                      resetToDefaultCatalog();
                      showToast('Catalog cleared.');
                    }
                  }}
                  className="border border-gray-200 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title="Clear catalog"
                >
                  Clear Catalog
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
                            <div className="flex flex-wrap gap-1 mt-1">
                              {prod.subcategory && (
                                <span className="px-1.5 py-0.5 bg-orange-50 text-primary border border-orange-200/60 rounded text-[10px] font-semibold">
                                  {prod.subcategory}
                                </span>
                              )}
                              {prod.gender && prod.gender !== 'Unisex' && (
                                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/60 rounded text-[10px] font-semibold">
                                  {prod.gender}
                                </span>
                              )}
                              {prod.tag && (
                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-semibold">
                                  {prod.tag}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-gray-900 text-sm">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </td>

                          <td className="py-3.5 px-4 text-gray-400 line-through">
                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-gray-800">{totalStock} pairs total</div>
                            <div className="text-[10px] text-gray-500 mt-1 flex flex-wrap gap-1 max-w-[200px]">
                              {prod.variants?.map((v) => (
                                <span
                                  key={v.size}
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                    v.stock === 0
                                      ? 'bg-red-50 text-red-600 border border-red-200'
                                      : v.stock <= 5
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                  title={`${v.size}: ${v.stock} in stock`}
                                >
                                  {v.size.replace('UK ', '')}:{v.stock}
                                </span>
                              ))}
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
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(prod)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-orange-50 transition-colors cursor-pointer"
                                title="Edit Product Details & Stock"
                              >
                                <Icon name="edit" className="w-4 h-4" />
                              </button>
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
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-400">
                          {products.length === 0
                            ? 'Catalog is empty. Click "+ Add New Product" above to upload your first footwear style.'
                            : 'No products found matching your search.'}
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

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (
                      confirm(
                        'Clear all orders? This resets the order history for clean live operations.'
                      )
                    ) {
                      clearAllOrders();
                      showToast('All order history cleared.');
                    }
                  }}
                  className="border border-red-200 hover:bg-red-50 text-red-600 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title="Clear all orders"
                >
                  Clear All Orders
                </button>
                <button
                  onClick={() => {
                    if (confirm('Load demo test orders into order history?')) {
                      resetOrders();
                      showToast('Demo orders loaded.');
                    }
                  }}
                  className="border border-gray-200 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title="Load demo orders"
                >
                  Load Demo Orders
                </button>
              </div>
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
                <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center shadow-xs">
                  <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Icon name="package" className="w-8 h-8" />
                  </div>
                  <h4 className="font-anton text-lg uppercase text-gray-800 tracking-wide">
                    No Orders Recorded
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    {orderSearch || orderStatusFilter !== 'All'
                      ? 'No orders match your filter criteria. Try resetting the search query.'
                      : 'Orders placed by customers on your storefront will appear here with live tracking, packing, and dispatch controls.'}
                  </p>
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
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        const subcats = getSubcategoriesForCategory(newCat);
                        setFormData({
                          ...formData,
                          category: newCat,
                          subcategory: subcats[0] || '',
                        });
                      }}
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
                    <label className="block text-xs font-bold text-gray-700 mb-1">Subcategory</label>
                    <select
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {getSubcategoriesForCategory(formData.category).map((subcat) => (
                        <option key={subcat} value={subcat}>
                          {subcat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Target Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gender: e.target.value as 'Men' | 'Women' | 'Unisex',
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="Unisex">Unisex / Universal</option>
                      <option value="Men">Men's Exclusive</option>
                      <option value="Women">Women's Exclusive</option>
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
                      Primary Hero Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={formData.img}
                      onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Angle 2: Top View / Insole
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formData.additionalImg1}
                        onChange={(e) => setFormData({ ...formData, additionalImg1: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Angle 3: Sole &amp; Tread Grip
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formData.additionalImg2}
                        onChange={(e) => setFormData({ ...formData, additionalImg2: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Angle 4: Heel / Craft Detail
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formData.additionalImg3}
                        onChange={(e) => setFormData({ ...formData, additionalImg3: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Angle 5: Lifestyle / On-Foot
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formData.additionalImg4}
                        onChange={(e) => setFormData({ ...formData, additionalImg4: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary"
                      />
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
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="text-xs">
                        <span className="font-bold text-gray-900 block">Image Preview</span>
                        <span className="text-gray-400 text-[11px]">
                          This thumbnail will be displayed on customer product cards &amp; catalog shelves.
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

      {/* =========================================================================
          "EDIT PRODUCT" MODAL (FR-23)
         ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col animate-scale-up">
            {/* Modal Header */}
            <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-anton text-xl md:text-2xl text-gray-900 tracking-wide uppercase">
                  EDIT FOOTWEAR &amp; STOCK
                </h3>
                <p className="text-xs text-gray-500">
                  Update footwear details, pricing, materials, and size inventory.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditProductSubmit} className="p-5 md:p-6 space-y-6">
              {/* Section 1: Basic Info */}
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                  1. Basic Details &amp; Pricing
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, name: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                    <select
                      value={editFormData.category}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        const subcats = getSubcategoriesForCategory(newCat);
                        setEditFormData({
                          ...editFormData,
                          category: newCat,
                          subcategory: subcats[0] || '',
                        });
                      }}
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
                    <label className="block text-xs font-bold text-gray-700 mb-1">Subcategory</label>
                    <select
                      value={editFormData.subcategory}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, subcategory: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {getSubcategoriesForCategory(editFormData.category).map((subcat) => (
                        <option key={subcat} value={subcat}>
                          {subcat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Target Gender</label>
                    <select
                      value={editFormData.gender}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          gender: e.target.value as 'Men' | 'Women' | 'Unisex',
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="Unisex">Unisex / Universal</option>
                      <option value="Men">Men's Exclusive</option>
                      <option value="Women">Women's Exclusive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Tag / Badge</label>
                    <input
                      type="text"
                      placeholder="e.g. Festive Spotlight, Bestseller"
                      value={editFormData.tag}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, tag: e.target.value })
                      }
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
                      value={editFormData.price}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, price: Number(e.target.value) })
                      }
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
                      value={editFormData.originalPrice}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          originalPrice: Number(e.target.value),
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Craftsmanship & Specs */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                  2. Artisan Heritage &amp; Materials
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Artisan Origin / City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jaipur, Rajasthan"
                      value={editFormData.artisanRegion}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, artisanRegion: e.target.value })
                      }
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
                      value={editFormData.upperMaterial}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, upperMaterial: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Sole Material</label>
                    <input
                      type="text"
                      placeholder="e.g. Buff-Tanned Leather"
                      value={editFormData.soleMaterial}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, soleMaterial: e.target.value })
                      }
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
                      value={editFormData.insoleType}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, insoleType: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Story &amp; Backstory
                    </label>
                    <textarea
                      rows={2}
                      value={editFormData.story}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, story: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Media */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                  3. Image Media &amp; Showcase Angles
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Primary Hero Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={editFormData.img}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, img: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Angle 2: Top View / Insole
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={editFormData.additionalImg1}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, additionalImg1: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Angle 3: Sole &amp; Tread Grip
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={editFormData.additionalImg2}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, additionalImg2: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Angle 4: Heel / Craft Detail
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={editFormData.additionalImg3}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, additionalImg3: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Angle 5: Lifestyle / On-Foot
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={editFormData.additionalImg4}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, additionalImg4: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {editFormData.img && (
                    <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200/80">
                      <img
                        src={editFormData.img}
                        alt="Preview"
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="text-xs">
                        <span className="font-bold text-gray-900 block">Thumbnail Preview</span>
                        <span className="text-gray-400 text-[11px]">
                          Appears on cards and checkout.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Size Inventory Matrix */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  4. Stock per UK Size
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  Adjust current inventory counts for each size variant:
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
                    <div
                      key={s.label}
                      className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-center"
                    >
                      <span className="block text-[11px] font-bold text-gray-700 mb-1">
                        {s.label}
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={editFormData[s.key]}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            [s.key]: Number(e.target.value),
                          })
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
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-[#8a2600] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                >
                  Save Changes ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
