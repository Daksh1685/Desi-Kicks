import { useState, useEffect, useMemo } from 'react';
import { Icon } from '../../components/ui/Icon';
import {
  getAllCouponsFromSupabase,
  createCouponInSupabase,
  toggleCouponStatusInSupabase,
  deleteCouponInSupabase,
  isSupabaseConfigured,
  type AdminCoupon,
} from '../../lib/supabase';
import { inputCls } from './adminTypes';

interface CouponsSectionProps {
  showToast: (msg: string) => void;
}

const DEFAULT_COUPONS: AdminCoupon[] = [
  { id: 'c-1', code: 'FESTIVE20', discountType: 'PERCENT', value: 20, minOrderValue: 2000, isActive: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'c-2', code: 'DIWALI500', discountType: 'FLAT', value: 500, minOrderValue: 3000, isActive: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'c-3', code: 'WELCOME10', discountType: 'PERCENT', value: 10, minOrderValue: 999, isActive: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'c-4', code: 'SOLEFIRST', discountType: 'FLAT', value: 300, minOrderValue: 1500, isActive: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'c-5', code: 'FESTIVE500', discountType: 'FLAT', value: 500, minOrderValue: 2500, isActive: true, createdAt: '2026-01-01T00:00:00Z' },
];

export function CouponsSection({ showToast }: CouponsSectionProps) {
  const [coupons, setCoupons] = useState<AdminCoupon[]>(DEFAULT_COUPONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  // Form State
  const [formCode, setFormCode] = useState('');
  const [formType, setFormType] = useState<'PERCENT' | 'FLAT'>('PERCENT');
  const [formValue, setFormValue] = useState<number>(15);
  const [formMinOrder, setFormMinOrder] = useState<number>(1499);
  const [formExpiry, setFormExpiry] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  // Fetch from Supabase on mount
  useEffect(() => {
    let mounted = true;
    if (isSupabaseConfigured) {
      getAllCouponsFromSupabase()
        .then((remote) => {
          if (mounted && remote && remote.length > 0) {
            setCoupons(remote);
          }
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    }
    return () => {
      mounted = false;
    };
  }, []);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchSearch = c.code.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === 'All'
          ? true
          : statusFilter === 'Active'
          ? c.isActive
          : !c.isActive;
      return matchSearch && matchStatus;
    });
  }, [coupons, search, statusFilter]);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = formCode.trim().toUpperCase();
    if (!cleanCode) return;

    const newCoupon: Omit<AdminCoupon, 'id' | 'createdAt'> = {
      code: cleanCode,
      discountType: formType,
      value: Number(formValue),
      minOrderValue: Number(formMinOrder),
      expiryDate: formExpiry || null,
      isActive: formIsActive,
    };

    // Optimistic insert
    const tempCoupon: AdminCoupon = {
      ...newCoupon,
      id: `coupon-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCoupons((prev) => [tempCoupon, ...prev]);
    setIsAddModalOpen(false);
    showToast(`Coupon ${cleanCode} created successfully!`);

    // Persist to Supabase
    if (isSupabaseConfigured) {
      const created = await createCouponInSupabase(newCoupon);
      if (created) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === tempCoupon.id ? created : c))
        );
      }
    }

    // Reset Form
    setFormCode('');
    setFormValue(15);
    setFormMinOrder(1499);
    setFormExpiry('');
    setFormIsActive(true);
  };

  const handleToggleStatus = async (coupon: AdminCoupon) => {
    const nextStatus = !coupon.isActive;
    setCoupons((prev) =>
      prev.map((c) => (c.id === coupon.id ? { ...c, isActive: nextStatus } : c))
    );
    showToast(`Coupon ${coupon.code} ${nextStatus ? 'activated' : 'deactivated'}.`);

    if (isSupabaseConfigured) {
      await toggleCouponStatusInSupabase(coupon.id, nextStatus);
    }
  };

  const handleDeleteCoupon = async (coupon: AdminCoupon) => {
    if (!confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) return;

    setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
    showToast(`Coupon ${coupon.code} deleted.`);

    if (isSupabaseConfigured) {
      await deleteCouponInSupabase(coupon.id);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Copied "${code}" to clipboard!`);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Action Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Icon name="search" className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coupon code..."
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Active' | 'Inactive')}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-[#8A2600] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xs cursor-pointer transition-colors"
        >
          <span className="text-base font-bold">+</span>
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min. Order Value</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Expiry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    {loading ? 'Loading coupons from Supabase...' : 'No coupons found.'}
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => copyCode(coupon.code)}
                          title="Copy Code"
                          className="text-gray-400 hover:text-gray-600 transition p-1"
                        >
                          📋
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {coupon.discountType === 'PERCENT'
                        ? `${coupon.value}% OFF`
                        : `₹${coupon.value} FLAT OFF`}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {coupon.minOrderValue > 0 ? `₹${coupon.minOrderValue.toLocaleString('en-IN')}` : 'No Minimum'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          coupon.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('en-IN') : 'No Expiry'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(coupon)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                            coupon.isActive
                              ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {coupon.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                          title="Delete Coupon"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-gray-200 p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900 uppercase">Create New Promo Coupon</h3>
                <p className="text-xs text-gray-400">Stores directly to Supabase coupons table</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE25"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  className={inputCls + ' font-mono'}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as 'PERCENT' | 'FLAT')}
                    className={inputCls + ' cursor-pointer'}
                  >
                    <option value="PERCENT">% Percentage</option>
                    <option value="FLAT">₹ Flat Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {formType === 'PERCENT' ? 'Percentage (%) *' : 'Discount (₹) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={formType === 'PERCENT' ? 100 : 5000}
                    value={formValue}
                    onChange={(e) => setFormValue(Number(e.target.value))}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Min. Order Value (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(Number(e.target.value))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={formExpiry}
                    onChange={(e) => setFormExpiry(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
                <span className="text-xs font-medium text-gray-700">Activate coupon immediately</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-[#8A2600] text-white shadow-xs cursor-pointer"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
