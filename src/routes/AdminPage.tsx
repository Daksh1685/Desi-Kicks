import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '../components/ui/Icon';
import { SeoHead } from '../components/SeoHead';
import { useProductCatalog } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import type { Product, NewProductInput } from '../types/product';
import {
  getAllCategories,
  getSubcategoriesForCategory,
} from '../constants/taxonomy';

const CATEGORIES = getAllCategories();

type AdminSection = 'dashboard' | 'catalog' | 'orders';

// ─── Shared input class ────────────────────────────────────────────────────────
const inputCls =
  'w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition';

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

  // ─── Admin Auth ──────────────────────────────────────────────────────────────
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
      setLoginError('Invalid username or password. Access denied.');
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

  // ─── UI State ────────────────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Product filters
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subcategoryFilter, setSubcategoryFilter] = useState('All');

  // Order filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // ─── Add Product Form ────────────────────────────────────────────────────────
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

  // ─── Edit Product ────────────────────────────────────────────────────────────
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
    ]
      .map((s) => s.trim())
      .filter(Boolean);

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
    showToast(`"${editFormData.name}" updated successfully.`);
  };

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // ─── Derived / Computed ──────────────────────────────────────────────────────
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

  const dailyRevenue = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const list: { day: string; dateStr: string; val: number; count: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      const dayLabel = i === 0 ? 'Today' : dayNames[d.getDay()];
      const dayOrders = orders.filter((o) => o.createdAt?.slice(0, 10) === dateKey);
      const val = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      list.push({ day: dayLabel, dateStr: dateKey, val, count: dayOrders.length });
    }
    return list;
  }, [orders]);

  const peakDailyGmv = useMemo(() => {
    const max = Math.max(...dailyRevenue.map((d) => d.val));
    return max > 0 ? max : 0;
  }, [dailyRevenue]);

  const categoryBreakdown = useMemo(() => {
    const catMap = new Map<string, { revenue: number; units: number; skus: number }>();
    CATEGORIES.forEach((cat) => catMap.set(cat, { revenue: 0, units: 0, skus: 0 }));
    products.forEach((p) => {
      const cur = catMap.get(p.category) || { revenue: 0, units: 0, skus: 0 };
      catMap.set(p.category, { ...cur, skus: cur.skus + 1 });
    });
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const prod = products.find((p) => p.id === item.productId || p.name === item.productName);
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
    const colors = [
      'bg-primary',
      'bg-amber-500',
      'bg-purple-500',
      'bg-blue-500',
      'bg-emerald-500',
      'bg-rose-500',
    ];
    return Array.from(catMap.entries()).map(([name, data], idx) => {
      const share =
        totalRev > 0
          ? Math.round((data.revenue / totalRev) * 100)
          : products.length > 0
          ? Math.round((data.skus / products.length) * 100)
          : 0;
      return { name, revenue: data.revenue, units: data.units, skus: data.skus, share, color: colors[idx % colors.length] };
    });
  }, [orders, products, metrics.totalRevenue]);

  const lowStockAlerts = useMemo(() => {
    const list: { product: string; size: string; stock: number }[] = [];
    products.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.stock <= 5) list.push({ product: p.name, size: v.size, stock: v.stock });
      });
    });
    return list;
  }, [products]);

  const productSales = useMemo(() => {
    const salesMap = new Map<string, { units: number; revenue: number }>();
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const key = item.productId || item.productName;
        const cur = salesMap.get(key) || { units: 0, revenue: 0 };
        salesMap.set(key, { units: cur.units + item.quantity, revenue: cur.revenue + item.price * item.quantity });
      });
    });
    return products
      .map((prod) => {
        const fromOrders = salesMap.get(prod.id) || salesMap.get(prod.name) || { units: 0, revenue: 0 };
        const totalStock = prod.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
        return { product: prod, unitsSold: fromOrders.units, grossSales: fromOrders.revenue, totalStock };
      })
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);
  }, [products, orders]);

  const totalInventoryPairs = useMemo(
    () => products.reduce((acc, p) => acc + (p.variants?.reduce((s, v) => s + v.stock, 0) || 0), 0),
    [products]
  );

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
    ]
      .map((s) => s.trim())
      .filter(Boolean);

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
    showToast(`"${formData.name}" added to catalog!`);
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

  // ============================================================================
  // LOGIN PAGE
  // ============================================================================
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <SeoHead
          title="Admin Login | CraftYourSole"
          description="Restricted Administrator Operations Portal."
          canonicalPath="/admin"
          noindex
        />
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4 shadow-sm">
              <Icon name="lock" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              CRAFT<span className="text-primary">YOUR</span>SOLE
            </h1>
            <p className="text-sm text-gray-500 mt-1">Admin Portal</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Sign in</h2>
            <p className="text-sm text-gray-500 mb-6">Enter your administrator credentials</p>

            {loginError && (
              <div className="mb-5 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <span className="mt-0.5">⚠</span>
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Username / Email
                </label>
                <div className="relative">
                  <Icon
                    name="person"
                    className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                  />
                  <input
                    type="text"
                    required
                    value={loginUser}
                    onChange={(e) => { setLoginUser(e.target.value); setLoginError(null); }}
                    placeholder="admin@craftyoursole.in"
                    autoComplete="username"
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Icon
                    name="lock"
                    className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => { setLoginPassword(e.target.value); setLoginError(null); }}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs cursor-pointer select-none"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
                Keep me signed in
              </label>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-primary hover:bg-[#8a2600] text-white font-bold text-sm rounded-lg transition-colors cursor-pointer shadow-sm mt-1"
              >
                Sign In →
              </button>
            </form>
          </div>

          <button
            onClick={() => navigate('/')}
            className="mt-5 mx-auto flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Icon name="arrow_left" className="w-4 h-4" />
            Back to Storefront
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // SIDEBAR NAVIGATION CONFIG
  // ============================================================================
  const navItems: { id: AdminSection; label: string; icon: IconName; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'briefcase' },
    { id: 'catalog', label: 'Products', icon: 'running', count: products.length },
    { id: 'orders', label: 'Orders', icon: 'shopping_bag', count: orders.length },
  ];

  // ============================================================================
  // MAIN ADMIN LAYOUT
  // ============================================================================
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <SeoHead
        title="Admin | CraftYourSole"
        description="CraftYourSole internal catalog and order management portal."
        canonicalPath="/admin"
        noindex
      />

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-56'
        } sticky top-0 h-screen overflow-hidden`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          {!sidebarCollapsed && (
            <span className="font-black text-sm tracking-tight text-gray-900">
              CRAFT<span className="text-primary">YOUR</span>SOLE
            </span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name={sidebarCollapsed ? 'chevron_right' : 'chevron_left'} className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer group ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon
                  name={item.icon as IconName}
                  className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`}
                />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.count !== undefined && (
                      <span
                        className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                          isActive ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}

          {/* Add Product CTA */}
          <div className="pt-3">
            <button
              onClick={() => { setActiveSection('catalog'); setIsAddModalOpen(true); }}
              title={sidebarCollapsed ? 'Add New Product' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-[#8a2600] transition-colors cursor-pointer shadow-sm ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
            >
              <span className="text-lg leading-none font-black shrink-0">+</span>
              {!sidebarCollapsed && <span>Add Product</span>}
            </button>
          </div>
        </nav>

        {/* Footer — user & logout */}
        <div className="border-t border-gray-100 p-3">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 px-1 mb-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon name="person" className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{adminUser}</p>
                <p className="text-[10px] text-gray-400">Administrator</p>
              </div>
            </div>
          )}
          <button
            onClick={handleAdminLogout}
            title="Sign out"
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <Icon name="lock" className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-base font-bold text-gray-900 capitalize">
              {activeSection === 'dashboard'
                ? 'Dashboard'
                : activeSection === 'catalog'
                ? 'Product Catalog'
                : 'Orders & Shipping'}
            </h1>
            <p className="text-xs text-gray-400">
              {activeSection === 'dashboard' && 'Sales overview and key metrics'}
              {activeSection === 'catalog' && `${products.length} products · manage your storefront`}
              {activeSection === 'orders' && `${orders.length} orders total`}
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden md:flex items-center gap-1.5 text-gray-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium">Live</span>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-[11px] text-gray-400">Gross Revenue</p>
              <p className="font-extrabold text-gray-900 text-sm">
                ₹{metrics.totalRevenue.toLocaleString('en-IN')}
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium transition cursor-pointer"
            >
              <Icon name="arrow_left" className="w-3.5 h-3.5" />
              Storefront
            </button>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Toast */}
          {successToast && (
            <div className="mb-5 flex items-center justify-between gap-3 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl shadow-sm text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                {successToast}
              </div>
              <button onClick={() => setSuccessToast(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer font-bold">✕</button>
            </div>
          )}

          {/* ================================================================
              SECTION: DASHBOARD
             ================================================================ */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6 max-w-6xl">
              {/* KPI row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Gross Revenue',
                    value: `₹${metrics.totalRevenue.toLocaleString('en-IN')}`,
                    sub: '↑ 28.4% vs last 30d',
                    subColor: 'text-emerald-600',
                    iconBg: 'bg-emerald-50',
                    iconColor: 'text-emerald-600',
                    icon: 'card' as IconName,
                  },
                  {
                    label: 'Total Orders',
                    value: String(metrics.totalOrdersCount),
                    sub: `AOV ₹${metrics.averageOrderValue.toLocaleString('en-IN')}`,
                    subColor: 'text-gray-500',
                    iconBg: 'bg-orange-50',
                    iconColor: 'text-primary',
                    icon: 'shopping_bag' as IconName,
                  },
                  {
                    label: 'Pending Dispatch',
                    value: String(metrics.pendingOrdersCount),
                    sub: `${metrics.shippedOrdersCount} shipped · ${metrics.deliveredOrdersCount} delivered`,
                    subColor: 'text-gray-500',
                    iconBg: 'bg-blue-50',
                    iconColor: 'text-blue-600',
                    icon: 'truck' as IconName,
                  },
                  {
                    label: 'Total Inventory',
                    value: `${totalInventoryPairs.toLocaleString('en-IN')} pairs`,
                    sub:
                      lowStockAlerts.length > 0
                        ? `⚠ ${lowStockAlerts.length} low-stock variants`
                        : '✓ All variants healthy',
                    subColor: lowStockAlerts.length > 0 ? 'text-amber-600' : 'text-emerald-600',
                    iconBg: 'bg-purple-50',
                    iconColor: 'text-purple-600',
                    icon: 'archive' as IconName,
                  },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{kpi.label}</span>
                      <span className={`p-2 rounded-lg ${kpi.iconBg} ${kpi.iconColor}`}>
                        <Icon name={kpi.icon as IconName} className="w-4 h-4" />
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-gray-900">{kpi.value}</p>
                    <p className={`text-xs mt-2 font-medium ${kpi.subColor}`}>{kpi.sub}</p>
                  </div>
                ))}
              </div>

              {/* Chart + Category split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">Revenue — Trailing 7 Days</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Live order earnings per day</p>
                    </div>
                    <span className="text-[11px] bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-lg">
                      7-Day Window
                    </span>
                  </div>
                  <div className="h-48 flex items-end gap-2 border-b border-gray-100 pb-1">
                    {dailyRevenue.map((bar, idx) => {
                      const isToday = idx === dailyRevenue.length - 1;
                      const pct = peakDailyGmv > 0 ? Math.max(6, Math.round((bar.val / peakDailyGmv) * 100)) : 6;
                      return (
                        <div key={bar.dateStr} className="flex-1 flex flex-col items-center gap-1 group">
                          <span className="text-[10px] font-semibold text-gray-400 group-hover:text-primary">
                            {bar.val > 0 ? `₹${(bar.val / 1000).toFixed(1)}k` : '—'}
                          </span>
                          <div className="w-full bg-gray-100 rounded-t-md relative h-36 overflow-hidden flex items-end">
                            <div
                              style={{ height: `${pct}%` }}
                              title={`${bar.day}: ₹${bar.val.toLocaleString('en-IN')} (${bar.count} orders)`}
                              className={`w-full rounded-t-md transition-all duration-500 ${
                                isToday ? 'bg-primary' : bar.val > 0 ? 'bg-gray-300 hover:bg-gray-400' : 'bg-gray-200'
                              }`}
                            />
                          </div>
                          <span className="text-[11px] font-medium text-gray-500">{bar.day}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Peak: ₹{peakDailyGmv.toLocaleString('en-IN')} ·{' '}
                    {dailyRevenue.reduce((a, d) => a + d.count, 0)} orders this week
                  </p>
                </div>

                {/* Category breakdown */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">Sales by Category</h3>
                  <p className="text-xs text-gray-400 mb-5">Revenue or catalog share</p>
                  <div className="space-y-3.5">
                    {categoryBreakdown.map((cat) => (
                      <div key={cat.name}>
                        <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                          <span className="truncate">{cat.name} ({cat.skus} SKUs)</span>
                          <span>{cat.share}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.share}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {lowStockAlerts.length > 0 && (
                    <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                      <p className="font-bold mb-1">⚠ Low Stock Alert</p>
                      <p>
                        {lowStockAlerts
                          .slice(0, 3)
                          .map((a) => `${a.product} (${a.size}: ${a.stock})`)
                          .join(', ')}
                        {lowStockAlerts.length > 3 ? ` +${lowStockAlerts.length - 3} more` : ''}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Top products table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Top Selling Products</h3>
                    <p className="text-xs text-gray-400">Highest grossing SKUs</p>
                  </div>
                  <button
                    onClick={() => setActiveSection('catalog')}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    View All →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                        <th className="px-6 py-3 font-semibold">Product</th>
                        <th className="px-6 py-3 font-semibold">Category</th>
                        <th className="px-6 py-3 font-semibold">Price</th>
                        <th className="px-6 py-3 font-semibold">Sold</th>
                        <th className="px-6 py-3 font-semibold">Stock</th>
                        <th className="px-6 py-3 font-semibold">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {productSales.map(({ product: prod, unitsSold, grossSales, totalStock }) => (
                        <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.img}
                                alt={prod.name}
                                className="w-9 h-9 rounded-lg object-cover border border-gray-200"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                              <div>
                                <p className="font-semibold text-gray-900 text-sm leading-tight">{prod.name}</p>
                                <p className="text-[11px] text-gray-400">{prod.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-gray-600 text-xs">{prod.category}</td>
                          <td className="px-6 py-3.5 font-bold text-gray-900 text-sm">₹{prod.price.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-3.5 text-gray-700 font-medium text-sm">
                            {unitsSold > 0 ? `${unitsSold} pairs` : `${prod.totalSold || 0} pairs`}
                          </td>
                          <td className="px-6 py-3.5">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              totalStock > 20 ? 'bg-emerald-50 text-emerald-700' :
                              totalStock > 0 ? 'bg-amber-50 text-amber-700' :
                              'bg-red-50 text-red-700'
                            }`}>
                              {totalStock > 0 ? `${totalStock} in stock` : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 font-extrabold text-emerald-600 text-sm">
                            ₹{(grossSales > 0 ? grossSales : prod.price * (prod.totalSold || 0)).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {productSales.length === 0 && (
                    <p className="text-center py-10 text-sm text-gray-400">No sales data yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              SECTION: PRODUCT CATALOG
             ================================================================ */}
          {activeSection === 'catalog' && (
            <div className="space-y-5 max-w-7xl">
              {/* Filter bar */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Icon name="search" className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>

                {/* Category */}
                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setSubcategoryFilter('All'); }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer bg-white"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                {/* Subcategory */}
                {categoryFilter !== 'All' && getSubcategoriesForCategory(categoryFilter).length > 0 && (
                  <select
                    value={subcategoryFilter}
                    onChange={(e) => setSubcategoryFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer bg-white"
                  >
                    <option value="All">All Subcategories</option>
                    {getSubcategoriesForCategory(categoryFilter).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => {
                      if (confirm('Reset to default catalog?')) { resetToDefaultCatalog(); showToast('Catalog reset.'); }
                    }}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-[#8a2600] text-white text-sm font-semibold rounded-lg transition shadow-sm cursor-pointer"
                  >
                    <span className="font-black text-base leading-none">+</span>
                    Add Product
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/40 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-xs text-gray-400">Toggle status to show/hide on storefront</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100 bg-gray-50/30">
                        <th className="px-5 py-3 font-semibold">Product</th>
                        <th className="px-5 py-3 font-semibold">Category</th>
                        <th className="px-5 py-3 font-semibold">Price / MRP</th>
                        <th className="px-5 py-3 font-semibold">Stock by Size</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map((prod) => {
                        const totalStock = prod.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                        return (
                          <tr key={prod.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.img}
                                  alt={prod.name}
                                  className="w-11 h-11 rounded-xl object-cover border border-gray-200 shrink-0"
                                />
                                <div>
                                  <p className="font-semibold text-gray-900 leading-tight">{prod.name}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">{prod.artisanRegion || 'Handcrafted'}</p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <p className="font-medium text-gray-800">{prod.category}</p>
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

                            <td className="px-5 py-4">
                              <p className="font-bold text-gray-900">₹{prod.price.toLocaleString('en-IN')}</p>
                              <p className="text-xs text-gray-400 line-through">₹{prod.originalPrice.toLocaleString('en-IN')}</p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-xs font-semibold text-gray-700 mb-1">{totalStock} pairs total</p>
                              <div className="flex flex-wrap gap-1">
                                {prod.variants?.map((v) => (
                                  <span
                                    key={v.size}
                                    title={`${v.size}: ${v.stock} in stock`}
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                      v.stock === 0
                                        ? 'bg-red-50 text-red-600 border border-red-200'
                                        : v.stock <= 5
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {v.size.replace('UK ', '')}:{v.stock}
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <button
                                onClick={() => toggleProductStatus(prod.id)}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                                  prod.isActive
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {prod.isActive ? '● Live' : '○ Draft'}
                              </button>
                            </td>

                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleOpenEditModal(prod)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-orange-50 transition cursor-pointer"
                                  title="Edit"
                                >
                                  <Icon name="edit" className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete "${prod.name}"?`)) {
                                      deleteProduct(prod.id);
                                      showToast(`Removed "${prod.name}".`);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                  title="Delete"
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
                          <td colSpan={6} className="text-center py-14 text-gray-400 text-sm">
                            {products.length === 0
                              ? 'Catalog is empty. Click "+ Add Product" to add your first style.'
                              : 'No products match your filters.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              SECTION: ORDERS
             ================================================================ */}
          {activeSection === 'orders' && (
            <div className="space-y-5 max-w-5xl">
              {/* Filter bar */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <Icon name="search" className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search order #, customer..."
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="PACKING">Packing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => {
                      if (confirm('Load demo test orders?')) { resetOrders(); showToast('Demo orders loaded.'); }
                    }}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Load Demo
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Clear all order history?')) { clearAllOrders(); showToast('All orders cleared.'); }
                    }}
                    className="px-3 py-2 border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Orders list */}
              <div className="space-y-3">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-gray-900 tracking-wide">{ord.orderNumber}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                          ord.orderStatus === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                          ord.orderStatus === 'PACKING' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {ord.orderStatus}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          ord.paymentStatus === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {ord.paymentMethod} · {ord.paymentStatus}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                        <span><strong className="text-gray-800">Customer:</strong> {ord.customerName} ({ord.customerPhone})</span>
                        <span><strong className="text-gray-800">Ship to:</strong> {ord.shippingAddress.city}, {ord.shippingAddress.state} – {ord.shippingAddress.pincode}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-200/60 px-2.5 py-1.5 rounded-lg text-xs">
                            <img src={item.img} alt={item.productName} className="w-6 h-6 object-cover rounded" />
                            <span className="font-medium text-gray-800 max-w-[140px] truncate">{item.productName}</span>
                            <span className="text-gray-500 font-bold">({item.size})</span>
                            <span className="text-gray-400">×{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-3 shrink-0">
                      <div className="sm:text-right">
                        <p className="text-xs text-gray-400">Total</p>
                        <p className="text-lg font-extrabold text-gray-900">₹{ord.totalAmount.toLocaleString('en-IN')}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {ord.orderStatus === 'PENDING' && (
                          <button
                            onClick={() => { updateOrderStatus(ord.id, 'PACKING'); showToast(`${ord.orderNumber} → PACKING`); }}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            Mark Packing
                          </button>
                        )}
                        {ord.orderStatus === 'PACKING' && (
                          <button
                            onClick={() => { updateOrderStatus(ord.id, 'SHIPPED'); showToast(`${ord.orderNumber} → SHIPPED`); }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            Ship Order
                          </button>
                        )}
                        {ord.orderStatus === 'SHIPPED' && (
                          <button
                            onClick={() => { updateOrderStatus(ord.id, 'DELIVERED'); showToast(`${ord.orderNumber} → DELIVERED`); }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            Confirm Delivery
                          </button>
                        )}
                        {ord.orderStatus === 'DELIVERED' && (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">✓ Delivered</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredOrders.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-14 text-center">
                    <div className="w-14 h-14 bg-gray-100 text-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Icon name="package" className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-gray-700 mb-1">No Orders Found</h3>
                    <p className="text-sm text-gray-400 max-w-sm mx-auto">
                      {orderSearch || orderStatusFilter !== 'All'
                        ? 'No orders match your filters.'
                        : 'Orders from your storefront will appear here with dispatch controls.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================================================================
          MODAL: ADD NEW PRODUCT
         ================================================================ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl border border-gray-200 flex flex-col my-auto animate-scale-up">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <div>
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">Add New Product</h2>
                <p className="text-xs text-gray-500 mt-0.5">Will be published to your storefront immediately</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold cursor-pointer text-sm"
              >✕</button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[76vh]">
              {/* Section 1 */}
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">1. Basic Details & Pricing</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Product Name *</label>
                    <input type="text" required placeholder="e.g. Royal Zari Velvet Mojari" value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category *</label>
                    <select value={formData.category} onChange={(e) => { const c = e.target.value; setFormData({ ...formData, category: c, subcategory: getSubcategoriesForCategory(c)[0] || '' }); }} className={inputCls + ' cursor-pointer'}>
                      {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Subcategory</label>
                    <select value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} className={inputCls + ' cursor-pointer'}>
                      {getSubcategoriesForCategory(formData.category).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Gender</label>
                    <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Men' | 'Women' | 'Unisex' })} className={inputCls + ' cursor-pointer'}>
                      <option value="Unisex">Unisex</option>
                      <option value="Men">Men's</option>
                      <option value="Women">Women's</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tag / Badge</label>
                    <input type="text" placeholder="e.g. Bestseller, New Drop" value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Selling Price (₹) *</label>
                    <input type="number" required min={100} value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className={inputCls + ' font-bold'} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">MRP / Original Price (₹)</label>
                    <input type="number" min={100} value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">2. Artisan Heritage & Materials</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Artisan Region</label>
                    <input type="text" placeholder="e.g. Jaipur, Rajasthan" value={formData.artisanRegion}
                      onChange={(e) => setFormData({ ...formData, artisanRegion: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Upper Material</label>
                    <input type="text" placeholder="e.g. Pure Velvet with Zari" value={formData.upperMaterial}
                      onChange={(e) => setFormData({ ...formData, upperMaterial: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sole Material</label>
                    <input type="text" placeholder="e.g. Anti-Skid Rubber" value={formData.soleMaterial}
                      onChange={(e) => setFormData({ ...formData, soleMaterial: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Insole Type</label>
                    <input type="text" placeholder="e.g. Memory Foam" value={formData.insoleType}
                      onChange={(e) => setFormData({ ...formData, insoleType: e.target.value })} className={inputCls} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Product Story</label>
                    <textarea rows={2} placeholder="Artisan backstory..." value={formData.story}
                      onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                      className={inputCls + ' resize-none'} />
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">3. Images & Media</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Primary Hero Image URL *</label>
                    <input type="url" required placeholder="https://..." value={formData.img}
                      onChange={(e) => setFormData({ ...formData, img: e.target.value })} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Angle 2: Top View', key: 'additionalImg1' as const },
                      { label: 'Angle 3: Sole', key: 'additionalImg2' as const },
                      { label: 'Angle 4: Heel / Detail', key: 'additionalImg3' as const },
                      { label: 'Angle 5: Lifestyle', key: 'additionalImg4' as const },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                        <input type="url" placeholder="https://..." value={formData[f.key]}
                          onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                          className={inputCls} />
                      </div>
                    ))}
                  </div>
                  {formData.img && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <img src={formData.img} alt="Preview" className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <div className="text-xs text-gray-500">
                        <p className="font-semibold text-gray-800">Image Preview</p>
                        <p>Thumbnail shown on product cards & catalog</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4 */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">4. Stock by UK Size</p>
                <p className="text-xs text-gray-400 mb-3">Set initial inventory per size variant:</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {([
                    { label: 'UK 6', key: 'stockUK6' },
                    { label: 'UK 7', key: 'stockUK7' },
                    { label: 'UK 8', key: 'stockUK8' },
                    { label: 'UK 9', key: 'stockUK9' },
                    { label: 'UK 10', key: 'stockUK10' },
                    { label: 'UK 11', key: 'stockUK11' },
                  ] as const).map((s) => (
                    <div key={s.label} className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-center">
                      <span className="block text-[11px] font-bold text-gray-600 mb-1.5">{s.label}</span>
                      <input type="number" min={0} value={formData[s.key]}
                        onChange={(e) => setFormData({ ...formData, [s.key]: Number(e.target.value) })}
                        className="w-full text-center bg-white border border-gray-200 rounded-lg py-1 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 sticky bottom-0 bg-white pb-1">
                <button type="button" onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-[#8a2600] text-white text-sm font-bold shadow-sm transition cursor-pointer">
                  Publish Product →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL: EDIT PRODUCT
         ================================================================ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl border border-gray-200 flex flex-col my-auto animate-scale-up">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <div>
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">Edit Product</h2>
                <p className="text-xs text-gray-500 mt-0.5">Update details, pricing, and size inventory</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold cursor-pointer text-sm"
              >✕</button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[76vh]">
              {/* Section 1 */}
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">1. Basic Details & Pricing</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Product Name *</label>
                    <input type="text" required value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category *</label>
                    <select value={editFormData.category} onChange={(e) => { const c = e.target.value; setEditFormData({ ...editFormData, category: c, subcategory: getSubcategoriesForCategory(c)[0] || '' }); }} className={inputCls + ' cursor-pointer'}>
                      {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Subcategory</label>
                    <select value={editFormData.subcategory} onChange={(e) => setEditFormData({ ...editFormData, subcategory: e.target.value })} className={inputCls + ' cursor-pointer'}>
                      {getSubcategoriesForCategory(editFormData.category).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Gender</label>
                    <select value={editFormData.gender} onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value as 'Men' | 'Women' | 'Unisex' })} className={inputCls + ' cursor-pointer'}>
                      <option value="Unisex">Unisex</option>
                      <option value="Men">Men's</option>
                      <option value="Women">Women's</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tag / Badge</label>
                    <input type="text" placeholder="e.g. Bestseller" value={editFormData.tag}
                      onChange={(e) => setEditFormData({ ...editFormData, tag: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Selling Price (₹) *</label>
                    <input type="number" required min={100} value={editFormData.price}
                      onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })} className={inputCls + ' font-bold'} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">MRP (₹)</label>
                    <input type="number" min={100} value={editFormData.originalPrice}
                      onChange={(e) => setEditFormData({ ...editFormData, originalPrice: Number(e.target.value) })} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">2. Heritage & Materials</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Artisan Region</label>
                    <input type="text" value={editFormData.artisanRegion}
                      onChange={(e) => setEditFormData({ ...editFormData, artisanRegion: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Upper Material</label>
                    <input type="text" value={editFormData.upperMaterial}
                      onChange={(e) => setEditFormData({ ...editFormData, upperMaterial: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sole Material</label>
                    <input type="text" value={editFormData.soleMaterial}
                      onChange={(e) => setEditFormData({ ...editFormData, soleMaterial: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Insole Type</label>
                    <input type="text" value={editFormData.insoleType}
                      onChange={(e) => setEditFormData({ ...editFormData, insoleType: e.target.value })} className={inputCls} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Artisan Story</label>
                    <textarea rows={2} value={editFormData.story}
                      onChange={(e) => setEditFormData({ ...editFormData, story: e.target.value })}
                      className={inputCls + ' resize-none'} />
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">3. Images & Showcase</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Primary Hero Image URL *</label>
                    <input type="url" required value={editFormData.img}
                      onChange={(e) => setEditFormData({ ...editFormData, img: e.target.value })} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Angle 2: Top View', key: 'additionalImg1' as const },
                      { label: 'Angle 3: Sole', key: 'additionalImg2' as const },
                      { label: 'Angle 4: Heel', key: 'additionalImg3' as const },
                      { label: 'Angle 5: Lifestyle', key: 'additionalImg4' as const },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                        <input type="url" placeholder="https://..." value={editFormData[f.key]}
                          onChange={(e) => setEditFormData({ ...editFormData, [f.key]: e.target.value })}
                          className={inputCls} />
                      </div>
                    ))}
                  </div>
                  {editFormData.img && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <img src={editFormData.img} alt="Preview" className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <div className="text-xs text-gray-500">
                        <p className="font-semibold text-gray-800">Thumbnail Preview</p>
                        <p>Shown on product cards & checkout</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4 */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">4. Stock per UK Size</p>
                <p className="text-xs text-gray-400 mb-3">Adjust current inventory per size:</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {([
                    { label: 'UK 6', key: 'stockUK6' },
                    { label: 'UK 7', key: 'stockUK7' },
                    { label: 'UK 8', key: 'stockUK8' },
                    { label: 'UK 9', key: 'stockUK9' },
                    { label: 'UK 10', key: 'stockUK10' },
                    { label: 'UK 11', key: 'stockUK11' },
                  ] as const).map((s) => (
                    <div key={s.label} className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-center">
                      <span className="block text-[11px] font-bold text-gray-600 mb-1.5">{s.label}</span>
                      <input type="number" min={0} value={editFormData[s.key]}
                        onChange={(e) => setEditFormData({ ...editFormData, [s.key]: Number(e.target.value) })}
                        className="w-full text-center bg-white border border-gray-200 rounded-lg py-1 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 sticky bottom-0 bg-white pb-1">
                <button type="button" onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-[#8a2600] text-white text-sm font-bold shadow-sm transition cursor-pointer">
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
