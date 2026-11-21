import { useState } from 'react';
import type { Order } from '../../types/order';

interface DeclineOrderModalProps {
  order: Order | null;
  onClose: () => void;
  onConfirmDecline: (orderId: string, reason: string) => void;
}

const DECLINE_REASONS = [
  'Inventory Out of Stock / Artisan Workshop Delay',
  'Delivery Pincode Unserviceable by Logistics Partners',
  'Suspected Fraudulent / Inauthentic Order',
  'Customer Requested Immediate Cancellation',
  'Incorrect Pricing or Promotion Error',
  'Other Operational Reason',
];

export function DeclineOrderModal({
  order,
  onClose,
  onConfirmDecline,
}: DeclineOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState(DECLINE_REASONS[0]);
  const [customNote, setCustomNote] = useState('');

  if (!order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customNote.trim()
      ? `${selectedReason} — ${customNote.trim()}`
      : selectedReason;
    onConfirmDecline(order.id, finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold">✕</span>
            <h3 className="text-sm font-bold tracking-wide">
              Decline &amp; Cancel Order #{order.orderNumber}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Declining this order will permanently cancel fulfillment and notify the customer.
          </p>

          {/* Customer Summary Card */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs space-y-1">
            <p className="font-bold text-gray-900">{order.customerName} ({order.customerPhone})</p>
            <p className="text-gray-500">
              Amount: <strong className="text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</strong> ({order.paymentMethod} • {order.paymentStatus})
            </p>
          </div>

          {/* Prepaid Refund Alert */}
          {order.paymentStatus === 'PAID' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <span className="text-base shrink-0">⚠️</span>
              <div>
                <p className="font-bold">Prepaid Transaction Alert</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  This order was prepaid via {order.paymentMethod}. Declining will transition payment status to <strong>REFUNDED</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Reason Selection */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">
              Reason for Declining
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
            >
              {DECLINE_REASONS.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">
              Internal Notes / Merchant Comment (Optional)
            </label>
            <textarea
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              placeholder="e.g. Size UK 9 out of stock at Jaipur workshop..."
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer transition"
            >
              Keep Order
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 cursor-pointer transition shadow-xs"
            >
              Confirm Decline &amp; Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
