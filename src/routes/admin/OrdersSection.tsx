import { useState, useMemo } from 'react';
import { Icon } from '../../components/ui/Icon';
import type { Order, OrderStatus, OrderItem } from '../../types/order';

interface OrdersSectionProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onResetDemo: () => void;
  onClearAll: () => void;
  showToast: (msg: string) => void;
}

export function OrdersSection({
  orders,
  onUpdateStatus,
  onResetDemo,
  onClearAll,
  showToast,
}: OrdersSectionProps) {
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

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

  return (
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
              if (confirm('Load demo test orders?')) { onResetDemo(); showToast('Demo orders loaded.'); }
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
          >
            Load Demo
          </button>
          <button
            onClick={() => {
              if (confirm('Clear all order history?')) { onClearAll(); showToast('All orders cleared.'); }
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
                {ord.items.map((item: OrderItem, idx: number) => (
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
                    onClick={() => { onUpdateStatus(ord.id, 'PACKING'); showToast(`${ord.orderNumber} → PACKING`); }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Mark Packing
                  </button>
                )}
                {ord.orderStatus === 'PACKING' && (
                  <button
                    onClick={() => { onUpdateStatus(ord.id, 'SHIPPED'); showToast(`${ord.orderNumber} → SHIPPED`); }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Ship Order
                  </button>
                )}
                {ord.orderStatus === 'SHIPPED' && (
                  <button
                    onClick={() => { onUpdateStatus(ord.id, 'DELIVERED'); showToast(`${ord.orderNumber} → DELIVERED`); }}
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
  );
}
