import { useState, useMemo } from 'react';
import { Icon } from '../../components/ui/Icon';
import type { Order, OrderStatus, OrderItem, ShippingLabelData } from '../../types/order';
import { ShippingLabelModal } from './ShippingLabelModal';
import { DeclineOrderModal } from './DeclineOrderModal';

interface OrdersSectionProps {
  orders: Order[];
  onUpdateStatus: (
    id: string,
    status: OrderStatus,
    metadata?: {
      shippingLabel?: ShippingLabelData;
      cancellationReason?: string;
    }
  ) => void;
  onResetDemo: () => void;
  onClearAll: () => void;
  showToast: (msg: string) => void;
}

function generateShippingLabel(ord: Order): ShippingLabelData {
  const digits = ord.orderNumber.replace(/[^0-9]/g, '') || String(Date.now()).slice(-6);
  const awbSuffix = `${digits}948`.slice(0, 9);
  return {
    awbNumber: `AWB-SR-${awbSuffix}`,
    courierName: 'BlueDart Air Express',
    serviceType: 'Direct Surface & Air Cargo',
    routingCode: 'DEL / JPR / AIR-01',
    weightKg: 0.85,
    dimensionsCm: '32 x 20 x 12 cm',
    generatedAt: new Date().toISOString(),
    dispatchHub: {
      name: 'CraftYourSole Central Artisan Fulfillment Hub',
      address: 'Plot 14, Leather Artisan Zone, Sitapura',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302022',
    },
  };
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
  const [selectedLabelOrder, setSelectedLabelOrder] = useState<Order | null>(null);
  const [decliningOrder, setDecliningOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
        (o.shippingLabel?.awbNumber || '').toLowerCase().includes(orderSearch.toLowerCase());
      const matchesStatus = orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Accept incoming order -> automatically transitions to SHIPPED & generates shipping label
  const handleAcceptOrder = (ord: Order) => {
    const shippingLabel = generateShippingLabel(ord);

    onUpdateStatus(ord.id, 'SHIPPED', { shippingLabel });
    setSelectedLabelOrder({
      ...ord,
      orderStatus: 'SHIPPED',
      shippingLabel,
    });
    showToast(`✓ Order #${ord.orderNumber} Accepted! Transitioned to SHIPPED & generated AWB label.`);
  };

  // Decline incoming order -> transitions to CANCELLED
  const handleConfirmDecline = (orderId: string, reason: string) => {
    onUpdateStatus(orderId, 'CANCELLED', { cancellationReason: reason });
    showToast(`Order #${decliningOrder?.orderNumber} declined and cancelled.`);
    setDecliningOrder(null);
  };

  const pendingCount = orders.filter((o) => o.orderStatus === 'PENDING').length;

  return (
    <div className="space-y-5 max-w-5xl font-sans pb-16">
      {/* Workflow Banner for Incoming Orders */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {pendingCount}
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Incoming Orders Awaiting Merchant Approval
              </h3>
              <p className="text-[11px] text-amber-800">
                Accepting an order automatically shifts its status to <strong>SHIPPED</strong> and creates an official carrier shipping label.
              </p>
            </div>
          </div>
          <button
            onClick={() => setOrderStatusFilter('PENDING')}
            className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0"
          >
            Filter Pending ({pendingCount})
          </button>
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Icon name="search" className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            placeholder="Search order #, customer, AWB..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>
        <select
          value={orderStatusFilter}
          onChange={(e) => setOrderStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer bg-white"
        >
          <option value="All">All Statuses ({orders.length})</option>
          <option value="PENDING">Incoming / Pending Approval ({pendingCount})</option>
          <option value="SHIPPED">Accepted &amp; Shipped ({orders.filter((o) => o.orderStatus === 'SHIPPED').length})</option>
          <option value="DELIVERED">Delivered ({orders.filter((o) => o.orderStatus === 'DELIVERED').length})</option>
          <option value="CANCELLED">Declined / Cancelled ({orders.filter((o) => o.orderStatus === 'CANCELLED').length})</option>
        </select>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => {
              if (confirm('Load demo test orders with incoming pending requests?')) {
                onResetDemo();
                showToast('Demo orders loaded with pending approval requests.');
              }
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
          >
            Load Demo Orders
          </button>
          <button
            onClick={() => {
              if (confirm('Clear all order history?')) {
                onClearAll();
                showToast('All orders cleared.');
              }
            }}
            className="px-3 py-2 border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Orders list */}
      <div className="space-y-3.5">
        {filteredOrders.map((ord) => {
          const isPending = ord.orderStatus === 'PENDING';
          const isShipped = ord.orderStatus === 'SHIPPED';
          const isDelivered = ord.orderStatus === 'DELIVERED';
          const isCancelled = ord.orderStatus === 'CANCELLED';

          return (
            <div
              key={ord.id}
              className={`bg-white rounded-2xl border shadow-xs p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all ${
                isPending
                  ? 'border-amber-300 ring-2 ring-amber-500/10'
                  : isCancelled
                  ? 'border-gray-200 bg-gray-50/50 opacity-80'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-gray-900 tracking-wide text-sm font-mono">
                    {ord.orderNumber}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isDelivered
                        ? 'bg-emerald-100 text-emerald-800'
                        : isShipped
                        ? 'bg-blue-100 text-blue-800'
                        : isCancelled
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {isPending ? '⚡ Incoming • Awaiting Approval' : ord.orderStatus}
                  </span>

                  {/* Payment Badge */}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      ord.paymentStatus === 'PAID'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : ord.paymentStatus === 'REFUNDED'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {ord.paymentMethod} · {ord.paymentStatus}
                  </span>

                  {ord.shippingLabel?.awbNumber && (
                    <span className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                      AWB: {ord.shippingLabel.awbNumber}
                    </span>
                  )}
                </div>

                {/* Customer & Shipping Summary */}
                <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    <strong className="text-gray-800">Customer:</strong> {ord.customerName} ({ord.customerPhone})
                  </span>
                  <span>
                    <strong className="text-gray-800">Ship to:</strong> {ord.shippingAddress.street}, {ord.shippingAddress.city},{' '}
                    {ord.shippingAddress.state} – {ord.shippingAddress.pincode}
                  </span>
                  <span>
                    <strong className="text-gray-800">Placed:</strong>{' '}
                    {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Cancellation Reason (if present) */}
                {ord.cancellationReason && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900">
                    <strong>Declined / Cancelled:</strong> {ord.cancellationReason}
                  </div>
                )}

                {/* Items Manifest */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {ord.items.map((item: OrderItem, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-gray-50 border border-gray-200/80 px-2.5 py-1.5 rounded-lg text-xs"
                    >
                      <img src={item.img} alt={item.productName} className="w-7 h-7 object-cover rounded" />
                      <span className="font-semibold text-gray-800 max-w-[150px] truncate">{item.productName}</span>
                      <span className="text-primary font-bold">({item.size})</span>
                      <span className="text-gray-400">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Actions Right Column */}
              <div className="flex flex-col sm:items-end gap-3 shrink-0 pt-2 sm:pt-0">
                <div className="sm:text-right">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Total Amount</p>
                  <p className="text-lg font-black text-gray-900">₹{ord.totalAmount.toLocaleString('en-IN')}</p>
                </div>

                {/* APPROVAL & FULFILLMENT BUTTONS */}
                <div className="flex flex-wrap gap-2">
                  {/* INCOMING PENDING ORDER: ACCEPT & DECLINE BUTTONS */}
                  {isPending && (
                    <>
                      <button
                        onClick={() => handleAcceptOrder(ord)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                        title="Accept order, transition to SHIPPED, and generate shipping label"
                      >
                        <span>✓</span>
                        <span>Accept &amp; Ship</span>
                      </button>
                      <button
                        onClick={() => setDecliningOrder(ord)}
                        className="px-3 py-2 border border-red-300 text-red-600 hover:bg-red-50 active:scale-95 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                        title="Decline / Reject this order"
                      >
                        <span>✕</span>
                        <span>Decline</span>
                      </button>
                    </>
                  )}

                  {/* SHIPPED ORDER ACTIONS */}
                  {isShipped && (
                    <>
                      <button
                        onClick={() => setSelectedLabelOrder(ord)}
                        className="px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 active:scale-95 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                        title="View & print carrier shipping label"
                      >
                        <span>📄</span>
                        <span>Shipping Label</span>
                      </button>
                      <button
                        onClick={() => {
                          onUpdateStatus(ord.id, 'DELIVERED');
                          showToast(`Order #${ord.orderNumber} confirmed DELIVERED.`);
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <span>✓</span>
                        <span>Confirm Delivery</span>
                      </button>
                    </>
                  )}

                  {/* DELIVERED ORDER ACTIONS */}
                  {isDelivered && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedLabelOrder(ord)}
                        className="px-2.5 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-medium cursor-pointer"
                      >
                        View AWB
                      </button>
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        ✓ Delivered
                      </span>
                    </div>
                  )}

                  {/* CANCELLED ORDER */}
                  {isCancelled && (
                    <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                      Declined &amp; Cancelled
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-14 text-center">
            <div className="w-14 h-14 bg-gray-100 text-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Icon name="package" className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-gray-700 mb-1">No Orders Found</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              {orderSearch || orderStatusFilter !== 'All'
                ? 'No orders match your active search or status filters.'
                : 'Incoming storefront orders will appear here for merchant review and one-click shipping label generation.'}
            </p>
          </div>
        )}
      </div>

      {/* MODAL 1: CARRIER SHIPPING LABEL & PRINTING */}
      <ShippingLabelModal
        order={selectedLabelOrder}
        onClose={() => setSelectedLabelOrder(null)}
      />

      {/* MODAL 2: DECLINE ORDER REASON CONFIRMATION */}
      <DeclineOrderModal
        order={decliningOrder}
        onClose={() => setDecliningOrder(null)}
        onConfirmDecline={handleConfirmDecline}
      />
    </div>
  );
}
