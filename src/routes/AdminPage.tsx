import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { SeoHead } from '../components/SeoHead';
import { useProductCatalog } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { useHero, type HeroSlide } from '../context/HeroContext';
import type { Product, NewProductInput, ProductGender } from '../types/product';
import {
  getAllCategories,
  getSubcategoriesForCategory,
} from '../constants/taxonomy';

// Subcomponents & types
import {
  type AdminSection,
  type AdminNavItem,
  ALL_ADMIN_SIZES,
  GENDER_SIZE_PRESETS,
} from './admin/adminTypes';
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminHeader } from './admin/AdminHeader';
import { DashboardSection } from './admin/DashboardSection';
import { CatalogSection } from './admin/CatalogSection';
import { OrdersSection } from './admin/OrdersSection';
import { BannersSection } from './admin/BannersSection';
import { CouponsSection } from './admin/CouponsSection';
import { ReturnsSection } from './admin/ReturnsSection';
import { FooterSection } from './admin/FooterSection';
import {
  AddProductModal,
  EditProductModal,
  type ProductFormData,
} from './admin/ProductFormModal';
import {
  BannerFormModal,
  type BannerFormData,
} from './admin/BannerFormModal';

export { ALL_ADMIN_SIZES, GENDER_SIZE_PRESETS };

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

  // ─── UI & Routing State ───────────────────────────────────────────────────────
  const location = useLocation();

  // Derive active section from the current URL path
  const activeSection: AdminSection = useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/admin/products') || path.includes('/admin/catalog')) return 'catalog';
    if (path.includes('/admin/orders')) return 'orders';
    if (path.includes('/admin/returns')) return 'returns';
    if (path.includes('/admin/coupons')) return 'coupons';
    if (path.includes('/admin/banners')) return 'banners';
    if (path.includes('/admin/footer')) return 'footer';
    return 'dashboard';
  }, [location.pathname]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Storefront Maintenance Mode Toggle
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('craftyoursole_maintenance_mode') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleMaintenanceMode = () => {
    const next = !maintenanceMode;
    setMaintenanceMode(next);
    try {
      localStorage.setItem('craftyoursole_maintenance_mode', String(next));
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
    showToast(
      next
        ? 'Storefront Maintenance Mode ENABLED. Customer storefront is now offline.'
        : 'Storefront Maintenance Mode DISABLED. Storefront is now live.'
    );
  };

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // ─── Add Product Form ────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<ProductFormData>({
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

  // ─── Edit Product ────────────────────────────────────────────────────────────
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<ProductFormData>({
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

  // ─── Hero Banner Modal State ────────────────────────────────────────────────
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerFormData, setBannerFormData] = useState<BannerFormData>({
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
      to: slide.to || '/collections',
      img: slide.img || '',
      imgWebp: slide.imgWebp || '',
      mobileImg: slide.mobileImg || '',
      mobileImgWebp: slide.mobileImgWebp || '',
      alt: slide.alt || slide.title || '',
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
      'Hero Banner Promotion';

    if (editingBannerId) {
      updateHeroSlide(editingBannerId, {
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

  // ─── If not authorized, show Login Page ─────────────────────────────────────
  if (!isAuthorized) {
    return (
      <AdminLoginPage
        loginUser={loginUser}
        setLoginUser={setLoginUser}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        loginError={loginError}
        setLoginError={setLoginError}
        onSubmit={handleAdminLogin}
        onBack={() => navigate('/')}
      />
    );
  }

  const navItems: AdminNavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'briefcase', path: '/admin/dashboard' },
    { id: 'catalog', label: 'Products', icon: 'running', path: '/admin/products', count: products.length },
    { id: 'orders', label: 'Orders', icon: 'shopping_bag', path: '/admin/orders', count: orders.length },
    { id: 'returns', label: 'Size Exchanges (36h)', icon: 'package', path: '/admin/returns' },
    { id: 'coupons', label: 'Coupons', icon: 'tag', path: '/admin/coupons' },
    { id: 'banners', label: 'Hero Banners', icon: 'lifestyle', path: '/admin/banners', count: heroSlides.length },
    { id: 'footer', label: 'Footer CMS', icon: 'edit', path: '/admin/footer' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <SeoHead
        title="Admin | CraftYourSole"
        description="CraftYourSole internal catalog and order management portal."
        canonicalPath={location.pathname}
        noindex
      />

      {/* Sidebar Navigation */}
      <AdminSidebar
        navItems={navItems}
        activeSection={activeSection}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        adminUser={adminUser}
        onLogout={handleAdminLogout}
        onAddProduct={() => {
          navigate('/admin/products');
          setIsAddModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          activeSection={activeSection}
          productsCount={products.length}
          ordersCount={orders.length}
          heroSlidesCount={heroSlides.length}
          activeHeroSlidesCount={activeHeroSlides.length}
          totalRevenue={metrics.totalRevenue}
          maintenanceMode={maintenanceMode}
          onToggleMaintenanceMode={handleToggleMaintenanceMode}
          onNavigateHome={() => navigate('/')}
        />

        <main className="flex-1 p-6 overflow-auto">
          {/* Toast Notification */}
          {successToast && (
            <div className="mb-5 flex items-center justify-between gap-3 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl shadow-sm text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                {successToast}
              </div>
              <button
                onClick={() => setSuccessToast(null)}
                className="text-emerald-600 hover:text-emerald-900 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Sub-Routes Section Views */}
          <Routes>
            <Route
              index
              element={
                <DashboardSection
                  products={products}
                  orders={orders}
                  metrics={metrics}
                  onViewCatalog={() => navigate('/admin/products')}
                />
              }
            />
            <Route
              path="dashboard"
              element={
                <DashboardSection
                  products={products}
                  orders={orders}
                  metrics={metrics}
                  onViewCatalog={() => navigate('/admin/products')}
                />
              }
            />
            <Route
              path="products"
              element={
                <CatalogSection
                  products={products}
                  onEdit={handleOpenEditModal}
                  onDelete={(id, name) => {
                    deleteProduct(id);
                    showToast(`Removed "${name}".`);
                  }}
                  onToggleStatus={toggleProductStatus}
                  onReset={resetToDefaultCatalog}
                  onAdd={() => setIsAddModalOpen(true)}
                  showToast={showToast}
                />
              }
            />
            <Route path="catalog" element={<Navigate to="/admin/products" replace />} />
            <Route
              path="orders"
              element={
                <OrdersSection
                  orders={orders}
                  onUpdateStatus={updateOrderStatus}
                  onResetDemo={resetOrders}
                  onClearAll={clearAllOrders}
                  showToast={showToast}
                />
              }
            />
            <Route
              path="returns"
              element={<ReturnsSection showToast={showToast} />}
            />
            <Route
              path="coupons"
              element={<CouponsSection showToast={showToast} />}
            />
            <Route
              path="banners"
              element={
                <BannersSection
                  heroSlides={heroSlides}
                  activeHeroSlides={activeHeroSlides}
                  onMove={moveHeroSlide}
                  onToggleActive={toggleHeroSlideActive}
                  onEdit={handleOpenEditBannerModal}
                  onDelete={deleteHeroSlide}
                  onAdd={handleOpenAddBannerModal}
                  onReset={resetHeroSlides}
                  showToast={showToast}
                />
              }
            />
            <Route
              path="footer"
              element={<FooterSection showToast={showToast} />}
            />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Modal: Add Product */}
      <AddProductModal
        isOpen={isAddModalOpen}
        formData={formData}
        setFormData={setFormData}
        selectedSizes={addSelectedSizes}
        setSelectedSizes={setAddSelectedSizes}
        sizeStocks={addSizeStocks}
        setSizeStocks={setAddSizeStocks}
        onSubmit={handleAddProductSubmit}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Modal: Edit Product */}
      <EditProductModal
        isOpen={isEditModalOpen}
        formData={editFormData}
        setFormData={setEditFormData}
        selectedSizes={editSelectedSizes}
        setSelectedSizes={setEditSelectedSizes}
        sizeStocks={editSizeStocks}
        setSizeStocks={setEditSizeStocks}
        onSubmit={handleEditProductSubmit}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProductId(null);
        }}
      />

      {/* Modal: Add / Edit Banner */}
      <BannerFormModal
        isOpen={isBannerModalOpen}
        editingBannerId={editingBannerId}
        bannerFormData={bannerFormData}
        setBannerFormData={setBannerFormData}
        onSubmit={handleBannerFormSubmit}
        onClose={() => {
          setIsBannerModalOpen(false);
          setEditingBannerId(null);
        }}
      />
    </div>
  );
}
