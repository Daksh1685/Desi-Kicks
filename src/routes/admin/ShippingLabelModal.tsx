import { Icon } from '../../components/ui/Icon';
import type { Order } from '../../types/order';

interface ShippingLabelModalProps {
  order: Order | null;
  onClose: () => void;
}

export function ShippingLabelModal({ order, onClose }: ShippingLabelModalProps) {
  if (!order) return null;

  const label = order.shippingLabel || {
    awbNumber: `AWB-SR-${order.orderNumber.replace(/[^0-9]/g, '') || '984012938'}`,
    courierName: 'BlueDart Air Express',
    serviceType: 'Direct Priority Surface & Air',
    routingCode: 'DEL / JPR / AIR-01',
    weightKg: 0.85,
    dimensionsCm: '32 x 20 x 12 cm',
    generatedAt: order.createdAt,
    dispatchHub: {
      name: 'CraftYourSole Central Artisan Fulfillment Hub',
      address: 'Plot 14, Leather Artisan Zone, Sitapura',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302022',
    },
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-fade-in print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh] print:max-w-none print:w-full print:border-none print:shadow-none print:rounded-none">
        {/* Modal Top Bar (Hidden during print) */}
        <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold tracking-wide">
              Shipping &amp; Dispatch Airway Bill (AWB)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-primary hover:bg-[#8A2600] text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="check" className="w-3.5 h-3.5" />
              <span>Print Label</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg text-lg font-bold cursor-pointer"
              title="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Label Sheet (4" x 6" standard layout) */}
        <div className="p-6 overflow-y-auto print:p-6 print:overflow-visible">
          <div className="border-2 border-black rounded-lg p-5 font-mono text-black space-y-4 bg-white shadow-xs print:border-2 print:border-black print:shadow-none">
            {/* Carrier Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <h2 className="text-base font-black tracking-tight uppercase">
                  {label.courierName}
                </h2>
                <p className="text-[10px] text-gray-700 font-sans font-semibold">
                  Shiprocket Logistics Network • {label.serviceType}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black uppercase px-2 py-0.5 border border-black rounded">
                  {label.routingCode}
                </span>
                <p className="text-[9px] text-gray-600 mt-0.5">
                  Std 4&quot; × 6&quot; Label
                </p>
              </div>
            </div>

            {/* AWB Barcode Simulation */}
            <div className="py-2 text-center border-b-2 border-black space-y-1">
              <div className="flex justify-center items-center h-12 gap-[3px] overflow-hidden">
                {/* Visual Barcode Pattern */}
                {[
                  3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1,
                  3, 2, 4, 1, 3, 1, 2, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2,
                ].map((w, i) => (
                  <div
                    key={i}
                    className="bg-black h-full"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <p className="text-xs font-black tracking-widest uppercase">
                {label.awbNumber}
              </p>
            </div>

            {/* Order & Date Row */}
            <div className="grid grid-cols-2 gap-2 text-xs border-b border-black pb-2">
              <div>
                <span className="text-[10px] text-gray-600 block uppercase font-sans">
                  Order Number
                </span>
                <span className="font-bold">{order.orderNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-600 block uppercase font-sans">
                  Booking Date
                </span>
                <span className="font-bold">
                  {new Date(label.generatedAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Ship To & Return Addresses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-b-2 border-black pb-3">
              {/* Destination */}
              <div className="space-y-1 bg-gray-50/70 p-2.5 rounded border border-gray-200 print:bg-transparent">
                <span className="text-[10px] font-bold text-gray-600 block uppercase font-sans tracking-wide">
                  Ship To (Consignee):
                </span>
                <p className="font-black text-sm uppercase">{order.customerName}</p>
                <p className="font-bold">{order.customerPhone}</p>
                <p className="leading-snug">{order.shippingAddress.street}</p>
                <p className="font-black text-sm">
                  {order.shippingAddress.city}, {order.shippingAddress.state} –{' '}
                  <span className="underline">{order.shippingAddress.pincode}</span>
                </p>
              </div>

              {/* Shipper */}
              <div className="space-y-1 text-[11px] p-2.5">
                <span className="text-[10px] font-bold text-gray-600 block uppercase font-sans tracking-wide">
                  Return If Undelivered (RTO):
                </span>
                <p className="font-bold">{label.dispatchHub.name}</p>
                <p className="text-gray-700 leading-snug">
                  {label.dispatchHub.address}
                </p>
                <p className="font-bold">
                  {label.dispatchHub.city}, {label.dispatchHub.state} –{' '}
                  {label.dispatchHub.pincode}
                </p>
                <p className="text-[10px] text-gray-600">care@craftyoursole.in</p>
              </div>
            </div>

            {/* Item Manifest Details */}
            <div className="text-xs space-y-1.5 border-b border-black pb-2">
              <span className="text-[10px] font-bold text-gray-600 block uppercase font-sans">
                Package Contents &amp; Items ({order.items.length})
              </span>
              <div className="space-y-1">
                {order.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-[11px]"
                  >
                    <span className="font-semibold truncate max-w-[280px]">
                      {it.productName}
                    </span>
                    <span className="font-bold">
                      Size: {it.size} | Qty: {it.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-gray-600 pt-1 font-sans">
                <span>Weight: {label.weightKg} kg</span>
                <span>Dimensions: {label.dimensionsCm}</span>
              </div>
            </div>

            {/* Payment COD vs Prepaid Banner */}
            <div
              className={`p-3 text-center border-2 rounded ${
                order.paymentMethod === 'COD'
                  ? 'border-black bg-amber-50 text-black print:bg-transparent'
                  : 'border-black bg-emerald-50 text-emerald-950 print:bg-transparent'
              }`}
            >
              {order.paymentMethod === 'COD' ? (
                <div>
                  <span className="text-xs font-black uppercase tracking-wider block">
                    CASH ON DELIVERY (COD)
                  </span>
                  <span className="text-base font-black">
                    COLLECT CASH: ₹{order.totalAmount.toLocaleString('en-IN')}.00
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-xs font-black uppercase tracking-wider block">
                    PREPAID SHIPMENT ({order.paymentMethod})
                  </span>
                  <span className="text-xs font-black">
                    DO NOT COLLECT CASH FROM CUSTOMER
                  </span>
                </div>
              )}
            </div>

            {/* Footer Notice */}
            <p className="text-[9px] text-center text-gray-500 font-sans">
              Handcrafted footwear inspected at CraftYourSole Jaipur Studio. Exchange only valid within 36 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
