import { useMemo } from 'react';
import { Icon, type IconName } from '../../components/ui/Icon';
import type { Product } from '../../types/product';
import type { Order, OrderItem } from '../../types/order';
import { getAllCategories } from '../../constants/taxonomy';

const CATEGORIES = getAllCategories();

export interface OrderMetrics {
  totalRevenue: number;
  totalOrdersCount: number;
  averageOrderValue: number;
  pendingOrdersCount: number;
  shippedOrdersCount: number;
  deliveredOrdersCount: number;
}

interface DashboardSectionProps {
  products: Product[];
  orders: Order[];
  metrics: OrderMetrics;
  onViewCatalog: () => void;
}

export function DashboardSection({ products, orders, metrics, onViewCatalog }: DashboardSectionProps) {
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
      o.items.forEach((item: OrderItem) => {
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
      'bg-primary', 'bg-amber-500', 'bg-purple-500',
      'bg-blue-500', 'bg-emerald-500', 'bg-rose-500',
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
      o.items.forEach((item: OrderItem) => {
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

  const kpis = [
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
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
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
            onClick={onViewCatalog}
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
  );
}
