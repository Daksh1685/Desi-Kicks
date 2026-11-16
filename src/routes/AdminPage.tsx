import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icon, type IconName } from '../components/ui/Icon';
import { SeoHead } from '../components/SeoHead';
import craftYourSoleLogo from '../assets/craftyoursole_logo.svg';
import { useProductCatalog } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { useHero, type HeroSlide } from '../context/HeroContext';
import type { Product, NewProductInput, ProductGender } from '../types/product';
import {
  getAllCategories,
  getSubcategoriesForCategory,
} from '../constants/taxonomy';

const CATEGORIES = getAllCategories();

export const ALL_ADMIN_SIZES = [
  'UK 1',
  'UK 2',
  'UK 3',
  'UK 4',
  'UK 5',
  'UK 6',
  'UK 7',
  'UK 8',
  'UK 9',
  'UK 10',
  'UK 11',
  'UK 12',
] as const;

export const GENDER_SIZE_PRESETS: Record<ProductGender, readonly string[]> = {
  Women: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
  Men: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'],
  Kids: ['UK 1', 'UK 2', 'UK 3', 'UK 4', 'UK 5'],
  Unisex: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
};

interface SizeInventoryManagerProps {
  gender: ProductGender;
  selectedSizes: string[];
  onChangeSelectedSizes: (sizes: string[]) => void;
  sizeStocks: Record<string, number>;
  onChangeStock: (size: string, stock: number) => void;
  onApplyStockToAll: (stock: number) => void;
}

function SizeInventoryManager({
  gender,
  selectedSizes,
  onChangeSelectedSizes,
  sizeStocks,
  onChangeStock,
  onApplyStockToAll,
}: SizeInventoryManagerProps) {
  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      onChangeSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      onChangeSelectedSizes([...selectedSizes, size]);
    }
  };

  const applyPreset = (presetSizes: readonly string[]) => {
    onChangeSelectedSizes([...presetSizes]);
  };

  return (
    <div className="space-y-3">
      {/* Quick Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-gray-400 font-semibold mr-1">Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset(GENDER_SIZE_PRESETS.Women)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer border ${gender === 'Women'
                ? 'bg-pink-50 border-pink-200 text-pink-700'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
          >
            Women (UK 3–8)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(GENDER_SIZE_PRESETS.Men)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer border ${gender === 'Men'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
          >
            Men (UK 6–12)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(GENDER_SIZE_PRESETS.Kids)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer border ${gender === 'Kids'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
          >
            Kids (UK 1–5)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(ALL_ADMIN_SIZES)}
            className="px-2.5 py-1 rounded-lg font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            All Sizes (UK 1–12)
          </button>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => onApplyStockToAll(20)}
            className="text-primary hover:underline font-bold cursor-pointer"
          >
            Set 20 to all
          </button>
          <span className="text-gray-300">•</span>
          <button
            type="button"
            onClick={() => onChangeSelectedSizes([])}
            className="text-gray-400 hover:text-red-500 transition cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Dynamic Size Cards Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {ALL_ADMIN_SIZES.map((sz) => {
          const isSelected = selectedSizes.includes(sz);
          const stock = sizeStocks[sz] ?? 0;
          return (
            <div
              key={sz}
              className={`rounded-xl border p-2 transition-all ${isSelected
                  ? 'bg-white border-primary/40 shadow-2xs ring-1 ring-primary/20'
                  : 'bg-gray-50/70 border-gray-200 opacity-60 hover:opacity-100'
                }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <button
                  type="button"
                  onClick={() => toggleSize(sz)}
                  className="flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSize(sz)}
                    className="w-3.5 h-3.5 rounded text-primary focus:ring-primary cursor-pointer accent-primary"
                  />
                  <span className={`text-xs font-bold ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
                    {sz}
                  </span>
                </button>
              </div>

              <div className="mt-1">
                <label className="block text-[10px] text-gray-400 mb-0.5 font-medium">Pairs:</label>
                <input
                  type="number"
                  min={0}
                  disabled={!isSelected}
                  value={isSelected ? stock : ''}
                  placeholder={isSelected ? '0' : '—'}
                  onChange={(e) => onChangeStock(sz, Math.max(0, Number(e.target.value) || 0))}
                  className={`w-full text-center rounded-md py-1 text-xs font-bold transition ${isSelected
                      ? 'bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white'
                      : 'bg-gray-100 border border-transparent text-gray-400 cursor-not-allowed'
                    }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-500 pt-1">
        Selected: <strong className="text-gray-800">{selectedSizes.length} sizes active</strong> · Only checked sizes will be shown to customers on the storefront.
      </p>
    </div>
  );
}

type AdminSection = 'dashboard' | 'catalog' | 'orders' | 'banners';

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
  const {
    slides: heroSlides,
    activeSlides: activeHeroSlides,
    addSlide: addHeroSlide,
    updateSlide: updateHeroSlide,
    deleteSlide: deleteHeroSlide,
    moveSlide: moveHeroSlide,
    toggleSlideActive: toggleHeroSlideActive,
    resetToDefaultSlides: resetHeroSlides,
  } = useHero();

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
  const [genderFilter, setGenderFilter] = useState<'All' | ProductGender>('All');

  // Order filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // ─── Add Product Form ────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    subcategory: getSubcategoriesForCategory(CATEGORIES[0])[0] || '',
    gender: 'Unisex' as ProductGender,
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
  });

  const [addSelectedSizes, setAddSelectedSizes] = useState<string[]>([
    'UK 4',
    'UK 5',
    'UK 6',
    'UK 7',
    'UK 8',
    'UK 9',
    'UK 10',
    'UK 11',
  ]);
  const [addSizeStocks, setAddSizeStocks] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    ALL_ADMIN_SIZES.forEach((s) => {
      init[s] = 15;
    });
    return init;
  });

  // ─── Edit Product ────────────────────────────────────────────────────────────
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    subcategory: '',
    gender: 'Unisex' as ProductGender,
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
  });
  const [editSelectedSizes, setEditSelectedSizes] = useState<string[]>([]);
  const [editSizeStocks, setEditSizeStocks] = useState<Record<string, number>>({});

  const handleOpenEditModal = (prod: Product) => {
    setEditingProductId(prod.id);
    const addImages = prod.additionalImages || [];
    const existingSizes =
      prod.sizes && prod.sizes.length > 0
        ? prod.sizes
        : prod.variants?.map((v) => v.size) || (GENDER_SIZE_PRESETS[prod.gender || 'Unisex'] as string[]);
    setEditSelectedSizes(existingSizes);

    const stocks: Record<string, number> = {};
    ALL_ADMIN_SIZES.forEach((sz) => {
      const match = prod.variants?.find((v) => v.size === sz);
      stocks[sz] = match ? match.stock : 0;
    });
    setEditSizeStocks(stocks);

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
    });
    setIsEditModalOpen(true);
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId || !editFormData.name.trim() || !editFormData.img.trim()) {
      alert('Please provide product name and image URL.');
      return;
    }
    const finalSizes =
      editSelectedSizes.length > 0
        ? editSelectedSizes
        : (GENDER_SIZE_PRESETS[editFormData.gender] as string[]);
    const variants = finalSizes.map((size) => ({
      size,
      stock: Math.max(0, Number(editSizeStocks[size]) || 0),
    }));
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
      sizes: finalSizes,
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

  // ─── Hero Banner Modal State ────────────────────────────────────────────────
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerFormData, setBannerFormData] = useState({
    title: '',
    scriptText: '',
    subtitle: '',
    ctaText: 'EXPLORE NOW',
    to: '/collections',
    img: '',
    imgWebp: '',
    mobileImg: '',
    mobileImgWebp: '',
    alt: '',
    isFullBanner: true,
    isActive: true,
  });

  const handleOpenAddBannerModal = () => {
    setEditingBannerId(null);
    setBannerFormData({
      title: '',
      scriptText: '',
      subtitle: '',
      ctaText: 'EXPLORE NOW',
      to: '/collections',
      img: '',
      imgWebp: '',
      mobileImg: '',
      mobileImgWebp: '',
      alt: '',
      isFullBanner: true,
      isActive: true,
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBannerModal = (slide: HeroSlide) => {
    setEditingBannerId(slide.id);
    setBannerFormData({
      title: slide.title || '',
      scriptText: slide.scriptText || '',
      subtitle: slide.subtitle || '',
      ctaText: slide.ctaText || 'EXPLORE NOW',
      to: slide.to || '/collections',
      img: slide.img || '',
      imgWebp: slide.imgWebp || '',
      mobileImg: slide.mobileImg || '',
      mobileImgWebp: slide.mobileImgWebp || '',
      alt: slide.alt || '',
      isFullBanner: slide.isFullBanner ?? true,
      isActive: slide.isActive ?? true,
    });
    setIsBannerModalOpen(true);
  };

  const handleBannerFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerFormData.img.trim()) {
      alert('Please provide at least a Desktop Banner image URL.');
      return;
    }
    const altText =
      bannerFormData.alt.trim() ||
      bannerFormData.title.trim() ||
      'Hero Banner Promotion';

    if (editingBannerId) {
      updateHeroSlide(editingBannerId, {
        title: bannerFormData.title.trim(),
        scriptText: bannerFormData.scriptText.trim(),
        subtitle: bannerFormData.subtitle.trim(),
        ctaText: bannerFormData.ctaText.trim() || 'EXPLORE NOW',
        to: bannerFormData.to.trim() || '/collections',
        img: bannerFormData.img.trim(),
        imgWebp: bannerFormData.imgWebp.trim() || undefined,
        mobileImg: bannerFormData.mobileImg.trim() || undefined,
        mobileImgWebp: bannerFormData.mobileImgWebp.trim() || undefined,
        alt: altText,
        isFullBanner: bannerFormData.isFullBanner,
        isActive: bannerFormData.isActive,
      });
      showToast('Hero banner updated successfully.');
    } else {
      addHeroSlide({
        title: bannerFormData.title.trim(),
        scriptText: bannerFormData.scriptText.trim(),
        subtitle: bannerFormData.subtitle.trim(),
        ctaText: bannerFormData.ctaText.trim() || 'EXPLORE NOW',
        to: bannerFormData.to.trim() || '/collections',
        img: bannerFormData.img.trim(),
        imgWebp: bannerFormData.imgWebp.trim() || undefined,
        mobileImg: bannerFormData.mobileImg.trim() || undefined,
        mobileImgWebp: bannerFormData.mobileImgWebp.trim() || undefined,
        alt: altText,
        isFullBanner: bannerFormData.isFullBanner,
        isActive: bannerFormData.isActive,
      });
      showToast('New hero banner added!');
    }
    setIsBannerModalOpen(false);
    setEditingBannerId(null);
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
      const matchesGender = genderFilter === 'All' || p.gender === genderFilter;
      return matchesSearch && matchesCat && matchesSubcat && matchesGender;
    });
  }, [products, productSearch, categoryFilter, subcategoryFilter, genderFilter]);

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
    const finalSizes =
      addSelectedSizes.length > 0
        ? addSelectedSizes
        : (GENDER_SIZE_PRESETS[formData.gender] as string[]);
    const variants = finalSizes.map((size) => ({
      size,
      stock: Math.max(0, Number(addSizeStocks[size]) || 0),
    }));
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
      sizes: finalSizes,
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
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
              <img
                src={craftYourSoleLogo}
                alt="CraftYourSole"
                className="h-8 sm:h-9 w-auto mx-auto"
              />
            </Link>
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
    { id: 'banners', label: 'Hero Banners', icon: 'lifestyle', count: heroSlides.length },
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
        className={`bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-56'
          } sticky top-0 h-screen overflow-hidden`}
      >
        {/* Brand */}
        <div
          className={`flex items-center border-b border-gray-100 min-h-[58px] ${sidebarCollapsed
              ? 'flex-col justify-center py-3 px-2 gap-2'
              : 'justify-between px-4 py-3'
            }`}
        >
          {!sidebarCollapsed ? (
            <Link
              to="/"
              className="flex items-center hover:opacity-90 transition-opacity"
              title="CraftYourSole Storefront"
            >
              <img
                src={craftYourSoleLogo}
                alt="CraftYourSole"
                className="h-6 w-auto max-w-[130px]"
              />
            </Link>
          ) : (
            <Link
              to="/"
              className="flex items-center justify-center hover:opacity-90 transition-opacity"
              title="CraftYourSole Storefront"
            >
              <img
                src="/favicon.svg"
                alt="CraftYourSole"
                className="w-7 h-7 rounded-lg shadow-2xs"
              />
            </Link>
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer group ${isActive
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
                        className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${isActive ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-500'
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-[#8a2600] transition-colors cursor-pointer shadow-sm ${sidebarCollapsed ? 'justify-center' : ''
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
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer ${sidebarCollapsed ? 'justify-center' : ''
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
                  : activeSection === 'orders'
                    ? 'Orders & Shipping'
                    : 'Hero Banners & Carousel'}
            </h1>
            <p className="text-xs text-gray-400">
              {activeSection === 'dashboard' && 'Sales overview and key metrics'}
              {activeSection === 'catalog' && `${products.length} products · manage your storefront`}
              {activeSection === 'orders' && `${orders.length} orders total`}
              {activeSection === 'banners' && `${heroSlides.length} banners (${activeHeroSlides.length} live on homepage)`}
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
                              className={`w-full rounded-t-md transition-all duration-500 ${isToday ? 'bg-primary' : bar.val > 0 ? 'bg-gray-300 hover:bg-gray-400' : 'bg-gray-200'
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
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${totalStock > 20 ? 'bg-emerald-50 text-emerald-700' :
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

                {/* Gender */}
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value as 'All' | ProductGender)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer bg-white"
                >
                  <option value="All">All Genders</option>
                  <option value="Men">Men's</option>
                  <option value="Women">Women's</option>
                  <option value="Kids">Kids'</option>
                  <option value="Unisex">Unisex</option>
                </select>

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
                                {prod.gender && (
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${prod.gender === 'Women' ? 'bg-pink-50 text-pink-700 border-pink-200/60' :
                                      prod.gender === 'Kids' ? 'bg-amber-50 text-amber-800 border-amber-200/60' :
                                        prod.gender === 'Men' ? 'bg-blue-50 text-blue-700 border-blue-200/60' :
                                          'bg-gray-100 text-gray-600 border-gray-200/60'
                                    }`}>
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
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${v.stock === 0
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
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${prod.isActive
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
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${ord.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                            ord.orderStatus === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                              ord.orderStatus === 'PACKING' ? 'bg-amber-100 text-amber-800' :
                                'bg-gray-100 text-gray-700'
                          }`}>
                          {ord.orderStatus}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${ord.paymentStatus === 'PAID'
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

          {/* ================================================================
              SECTION: HERO BANNERS & CAROUSEL
             ================================================================ */}
          {activeSection === 'banners' && (
            <div className="space-y-6 max-w-6xl">
              {/* Top Header Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">Hero Carousel Banners</h2>
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {activeHeroSlides.length} Live / {heroSlides.length} Total
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 max-w-2xl">
                    Customize the rotating banners displayed at the top of your homepage. Slides adapt dynamically: if you configure 2 slides, exactly 2 will rotate; if you add 7, all 7 rotate smoothly with autoplay, indicator dots, and touch gestures.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 self-stretch md:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Reset hero carousel to default factory slides? Any custom slides will be replaced.')) {
                        resetHeroSlides();
                        showToast('Hero banners reset to factory defaults.');
                      }
                    }}
                    className="flex-1 md:flex-initial px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-xs font-semibold transition cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddBannerModal}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-[#8a2600] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <span className="text-base leading-none font-black">+</span>
                    <span>Add Banner Slide</span>
                  </button>
                </div>
              </div>

              {/* Responsive Tip Banner */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
                <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  💡
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-amber-950">Art Direction & Image Dimensions Guide</p>
                  <p className="text-amber-800/90 mt-0.5">
                    For crystal-clear rendering across all devices: provide a <strong>16:9 Landscape</strong> image (recommended: 1920×1080px or 1600×900px) for desktop laptops, and optionally a <strong>9:16 Portrait</strong> image (recommended: 1080×1920px) for mobile smartphones. If mobile image is omitted, the desktop image automatically covers mobile screens.
                  </p>
                </div>
              </div>

              {/* Banners List */}
              <div className="space-y-4">
                {heroSlides.map((slide, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === heroSlides.length - 1;
                  const isLive = slide.isActive !== false;

                  return (
                    <div
                      key={slide.id}
                      className={`bg-white rounded-2xl border transition-all ${
                        isLive ? 'border-gray-200 hover:border-gray-300' : 'border-dashed border-gray-300 opacity-75'
                      } p-5 shadow-xs flex flex-col md:flex-row gap-5 items-stretch md:items-center`}
                    >
                      {/* Position + Reorder Controls */}
                      <div className="flex md:flex-col items-center justify-between md:justify-center gap-1 shrink-0">
                        <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-extrabold text-xs flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div className="flex md:flex-col gap-1">
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => moveHeroSlide(idx, 'up')}
                            title="Move slide earlier in rotation"
                            className={`p-1.5 rounded-lg border text-xs transition ${
                              isFirst
                                ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer'
                            }`}
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => moveHeroSlide(idx, 'down')}
                            title="Move slide later in rotation"
                            className={`p-1.5 rounded-lg border text-xs transition ${
                              isLast
                                ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer'
                            }`}
                          >
                            ▼
                          </button>
                        </div>
                      </div>

                      {/* Thumbnail Preview */}
                      <div className="relative w-full md:w-56 h-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 group">
                        <img
                          src={slide.img}
                          alt={slide.alt || slide.title}
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 flex flex-col justify-between p-2.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                              16:9 Desktop
                            </span>
                            {slide.mobileImg && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/90 text-white backdrop-blur-xs">
                                + 9:16 Mobile
                              </span>
                            )}
                          </div>
                          <div>
                            {slide.scriptText && (
                              <p className="text-[11px] font-handwriting text-primary-light italic line-clamp-1 drop-shadow">
                                {slide.scriptText}
                              </p>
                            )}
                            <p className="text-xs font-black text-white line-clamp-1 drop-shadow">
                              {slide.title || 'Untitled Banner'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Details & Target */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-gray-900 text-sm truncate">
                            {slide.title || 'Full-Bleed Visual Banner'}
                          </h3>
                          {slide.isFullBanner ? (
                            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                              Full-Bleed Banner
                            </span>
                          ) : (
                            <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-200">
                              Split Card Style
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleHeroSlideActive(slide.id)}
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                              isLive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                          >
                            {isLive ? '● Live on Store' : '○ Draft (Hidden)'}
                          </button>
                        </div>

                        {slide.subtitle && (
                          <p className="text-xs text-gray-600 line-clamp-1">
                            {slide.subtitle}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
                          <span className="flex items-center gap-1 font-mono text-[11px] bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                            <span className="text-gray-400">Link:</span> {slide.to}
                          </span>
                          <span className="flex items-center gap-1 text-[11px]">
                            <span className="text-gray-400">CTA:</span> "{slide.ctaText || 'EXPLORE'}"
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-gray-400 truncate max-w-xs" title={slide.img}>
                            Src: {slide.img}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end md:flex-col gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleOpenEditBannerModal(slide)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-orange-50 hover:text-primary hover:border-orange-200 text-xs font-semibold transition cursor-pointer"
                        >
                          <Icon name="edit" className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete banner "${slide.title || 'Untitled'}"?`)) {
                              deleteHeroSlide(slide.id);
                              showToast('Hero banner deleted.');
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-semibold transition cursor-pointer"
                        >
                          <Icon name="trash" className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {heroSlides.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Icon name="photo_camera" className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1">No Hero Banners</h3>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                      You currently have no hero slides configured. Click below to add one or reset defaults.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={resetHeroSlides}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        Reset Factory Slides
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenAddBannerModal}
                        className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-[#8a2600] cursor-pointer"
                      >
                        + Add First Banner
                      </button>
                    </div>
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
                    <select
                      value={formData.gender}
                      onChange={(e) => {
                        const nextGender = e.target.value as ProductGender;
                        setFormData({ ...formData, gender: nextGender });
                        setAddSelectedSizes([...GENDER_SIZE_PRESETS[nextGender]]);
                      }}
                      className={inputCls + ' cursor-pointer'}
                    >
                      <option value="Unisex">Unisex</option>
                      <option value="Men">Men's</option>
                      <option value="Women">Women's</option>
                      <option value="Kids">Kids'</option>
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
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                  4. Available Sizes & Stock Matrix (UK 1 – UK 12)
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  Toggle active sizes for this footwear model and set starting pair inventory:
                </p>
                <SizeInventoryManager
                  gender={formData.gender}
                  selectedSizes={addSelectedSizes}
                  onChangeSelectedSizes={setAddSelectedSizes}
                  sizeStocks={addSizeStocks}
                  onChangeStock={(size, stock) =>
                    setAddSizeStocks((prev) => ({ ...prev, [size]: stock }))
                  }
                  onApplyStockToAll={(stock) =>
                    setAddSizeStocks((prev) => {
                      const next = { ...prev };
                      addSelectedSizes.forEach((s) => {
                        next[s] = stock;
                      });
                      return next;
                    })
                  }
                />
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
                    <select
                      value={editFormData.gender}
                      onChange={(e) => {
                        const nextGender = e.target.value as ProductGender;
                        setEditFormData({ ...editFormData, gender: nextGender });
                      }}
                      className={inputCls + ' cursor-pointer'}
                    >
                      <option value="Unisex">Unisex</option>
                      <option value="Men">Men's</option>
                      <option value="Women">Women's</option>
                      <option value="Kids">Kids'</option>
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
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                  4. Available Sizes & Stock Matrix (UK 1 – UK 12)
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  Adjust active sizes and current inventory pairs for this shoe:
                </p>
                <SizeInventoryManager
                  gender={editFormData.gender}
                  selectedSizes={editSelectedSizes}
                  onChangeSelectedSizes={setEditSelectedSizes}
                  sizeStocks={editSizeStocks}
                  onChangeStock={(size, stock) =>
                    setEditSizeStocks((prev) => ({ ...prev, [size]: stock }))
                  }
                  onApplyStockToAll={(stock) =>
                    setEditSizeStocks((prev) => {
                      const next = { ...prev };
                      editSelectedSizes.forEach((s) => {
                        next[s] = stock;
                      });
                      return next;
                    })
                  }
                />
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

      {/* ================================================================
          MODAL: ADD / EDIT HERO BANNER
         ================================================================ */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl border border-gray-200 flex flex-col my-auto animate-scale-up">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <div>
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">
                  {editingBannerId ? 'Edit Hero Banner Slide' : 'Add New Hero Banner Slide'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Changes will sync immediately to the homepage hero carousel
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBannerFormSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[76vh]">
              {/* Section 1: Images */}
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                  1. Imagery & Responsive Art Direction
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Desktop Landscape Image URL (16:9) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. /hero/retro-timeless-landscape.jpg or https://images.unsplash.com/..."
                      value={bannerFormData.img}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, img: e.target.value })}
                      className={inputCls}
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Recommended: 1672 × 941px or 1920 × 1080px (16:9 ratio). Local files in <code className="bg-gray-100 px-1 py-0.5 rounded">public/hero/</code> or external CDN links.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Desktop WebP URL (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. /hero/retro-timeless-landscape.webp"
                        value={bannerFormData.imgWebp}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, imgWebp: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Mobile Portrait Image URL (9:16 Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. /hero/retro-timeless-portrait.jpg"
                        value={bannerFormData.mobileImg}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, mobileImg: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mobile WebP URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /hero/retro-timeless-portrait.webp"
                      value={bannerFormData.mobileImgWebp}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, mobileImgWebp: e.target.value })}
                      className={inputCls}
                    />
                  </div>

                  {/* Live preview inside modal */}
                  {bannerFormData.img && (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-xs font-bold text-gray-700 mb-2">Live Slide Preview</p>
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/10">
                        <img
                          src={bannerFormData.img}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/20 p-4 flex flex-col justify-end text-white">
                          {bannerFormData.scriptText && (
                            <p className="font-handwriting text-primary-light italic text-sm">
                              {bannerFormData.scriptText}
                            </p>
                          )}
                          <p className="font-extrabold text-base sm:text-lg leading-tight">
                            {bannerFormData.title || 'YOUR SLIDE TITLE'}
                          </p>
                          {bannerFormData.subtitle && (
                            <p className="text-xs text-white/80 mt-0.5 uppercase tracking-wider font-medium">
                              {bannerFormData.subtitle}
                            </p>
                          )}
                          <div className="mt-2">
                            <span className="inline-block bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full">
                              {bannerFormData.ctaText || 'EXPLORE NOW'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Copy & Content */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                  2. Slide Copy & Headings
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Main Heading (Title)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. STEP INTO TIMELESS STYLE"
                      value={bannerFormData.title}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Script Accent Text (Cursive)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. A Classic Redefined"
                      value={bannerFormData.scriptText}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, scriptText: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Subtitle / Eyebrow Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. RETRO SNEAKERS. EVERYDAY CHARACTER."
                      value={bannerFormData.subtitle}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, subtitle: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Call to Action & Link */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                  3. Button & Link Destination
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Button Text (CTA)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. EXPLORE THE COLLECTION"
                      value={bannerFormData.ctaText}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, ctaText: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Target Destination Path / URL
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /collections/men, /collections, etc."
                      value={bannerFormData.to}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, to: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Image Alt Text (SEO & Accessibility)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Step Into Timeless Style - Retro Sneakers Everyday Character"
                      value={bannerFormData.alt}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, alt: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Display Options */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                  4. Layout & Visibility
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bannerFormData.isFullBanner}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, isFullBanner: e.target.checked })}
                      className="w-4 h-4 rounded accent-primary cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-800">Full-Bleed Banner</p>
                      <p className="text-[11px] text-gray-400">Expanded layout matching hero container width</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bannerFormData.isActive}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded accent-primary cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-800">Active (Visible)</p>
                      <p className="text-[11px] text-gray-400">Included in the live rotating carousel on homepage</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white pb-1">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-[#8a2600] text-white text-sm font-bold shadow-sm transition cursor-pointer"
                >
                  {editingBannerId ? 'Save Changes ✓' : 'Add Banner Slide ✓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

