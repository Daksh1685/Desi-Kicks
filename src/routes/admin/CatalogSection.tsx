import { useState, useMemo } from 'react';
import { Icon } from '../../components/ui/Icon';
import type { Product, ProductGender } from '../../types/product';
import { getAllCategories, getSubcategoriesForCategory } from '../../constants/taxonomy';

const CATEGORIES = getAllCategories();

interface CatalogSectionProps {
  products: Product[];
  onEdit: (prod: Product) => void;
  onDelete: (id: string, name: string) => void;
  onToggleStatus: (id: string) => void;
  onReset: () => void;
  onAdd: () => void;
  showToast: (msg: string) => void;
}

export function CatalogSection({
  products,
  onEdit,
  onDelete,
  onToggleStatus,
  onReset,
  onAdd,
  showToast,
}: CatalogSectionProps) {
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subcategoryFilter, setSubcategoryFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState<'All' | ProductGender>('All');

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

  return (
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
              if (confirm('Reset to default catalog?')) { onReset(); showToast('Catalog reset.'); }
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={onAdd}
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
                        onClick={() => onToggleStatus(prod.id)}
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
                          onClick={() => onEdit(prod)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-orange-50 transition cursor-pointer"
                          title="Edit"
                        >
                          <Icon name="edit" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${prod.name}"?`)) {
                              onDelete(prod.id, prod.name);
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
  );
}
