/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Order, OrderStatus, OrderItem, ShippingLabelData } from '../types/order';
import {
  saveOrderToSupabase,
  updateOrderStatusInSupabase,
  getAllOrdersFromSupabase,
  getCustomerOrdersFromSupabase,
  isSupabaseConfigured,
} from '../lib/supabase';

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-demo-1',
    orderNumber: 'CYS-2026-4891',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      street: '42, Shanti Kunj, Civil Lines',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001',
    },
    items: [
      {
        id: 'item-1',
        productId: 'royal-velvet-embroidered-mojari',
        productName: 'Royal Velvet Embroidered Mojari',
        size: 'UK 9',
        price: 2995,
        quantity: 1,
        img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
      },
    ],
    subtotal: 2995,
    discount: 500,
    shippingFee: 0,
    totalAmount: 2495,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    orderStatus: 'PENDING',
    createdAt: new Date().toISOString(),
    estimatedDelivery: '3-4 Business Days',
  },
  {
    id: 'ord-demo-2',
    orderNumber: 'CYS-2026-9502',
    customerName: 'Vikramaditya Rathore',
    customerEmail: 'vikram.rathore@example.com',
    customerPhone: '+91 99887 76655',
    shippingAddress: {
      street: '12, Heritage Haveli, Old City',
      city: 'Udaipur',
      state: 'Rajasthan',
      pincode: '313001',
    },
    items: [
      {
        id: 'item-3',
        productId: 'artisan-burnished-leather-oxford',
        productName: 'Artisan Burnished Leather Formal Loafer',
        size: 'UK 10',
        price: 3495,
        quantity: 1,
        img: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop',
      },
    ],
    subtotal: 3495,
    discount: 0,
    shippingFee: 0,
    totalAmount: 3495,
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    orderStatus: 'PENDING',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    estimatedDelivery: '2-3 Business Days',
  },
  {
    id: 'ord-demo-3',
    orderNumber: 'CYS-2026-8123',
    customerName: 'Priya Sundaram',
    customerEmail: 'priya.s@example.com',
    customerPhone: '+91 98112 34567',
    shippingAddress: {
      street: '15th Cross, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
    },
    items: [
      {
        id: 'item-2',
        productId: 'cloudknit-daily-slip-on-loafer',
        productName: "Women's In Bloom Pastel Sneaker",
        size: 'UK 6',
        price: 2495,
        quantity: 1,
        img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
      },
    ],
    subtotal: 2495,
    discount: 0,
    shippingFee: 0,
    totalAmount: 2495,
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    orderStatus: 'SHIPPED',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    estimatedDelivery: '2-3 Business Days',
    shippingLabel: {
      awbNumber: 'AWB-SR-948201948',
      courierName: 'BlueDart Air Express',
      serviceType: 'Surface Direct Air Cargo',
      routingCode: 'DEL / JPR / SOUTH-02',
      weightKg: 0.85,
      dimensionsCm: '32 x 20 x 12 cm',
      generatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      dispatchHub: {
        name: 'CraftYourSole Central Artisan Fulfillment Hub',
        address: 'Plot 14, Leather Artisan Zone, Sitapura',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302022',
      },
    },
  },
  {
    id: 'ord-demo-4',
    orderNumber: 'CYS-2026-1044',
    customerName: 'Rohit Verma',
    customerEmail: 'rohit.v@example.com',
    customerPhone: '+91 91234 56789',
    shippingAddress: {
      street: 'Tower B, Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
    },
    items: [
      {
        id: 'item-4',
        productId: 'pro-runner-cushioned-trainer',
        productName: 'Pro-Glide Road Running Trainer',
        size: 'UK 8',
        price: 3295,
        quantity: 1,
        img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      },
    ],
    subtotal: 3295,
    discount: 300,
    shippingFee: 0,
    totalAmount: 2995,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    estimatedDelivery: 'Delivered',
  },
];

interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
}

interface OrderContextType {
  orders: Order[];
  createOrder: (input: CreateOrderInput) => Order;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    metadata?: {
      shippingLabel?: ShippingLabelData;
      cancellationReason?: string;
    }
  ) => void;
  getOrderById: (orderId: string) => Order | undefined;
  syncCustomerOrders: (email: string) => Promise<void>;
  metrics: {
    totalRevenue: number;
    totalOrdersCount: number;
    averageOrderValue: number;
    pendingOrdersCount: number;
    shippedOrdersCount: number;
    deliveredOrdersCount: number;
  };
  resetOrders: () => void;
  clearAllOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STORAGE_KEY = 'craftyoursole_orders_store';

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('desikicks_orders_store');
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_ORDERS;
  });

  // Persist orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Sync initial orders from Supabase on mount
  useEffect(() => {
    let mounted = true;
    if (isSupabaseConfigured) {
      getAllOrdersFromSupabase()
        .then((remoteOrders) => {
          if (mounted && remoteOrders && remoteOrders.length > 0) {
            setOrders((prev) => {
              const remoteNumbers = new Set(remoteOrders.map((o) => o.orderNumber));
              const localOnly = prev.filter((o) => !remoteNumbers.has(o.orderNumber));
              return [...remoteOrders, ...localOnly];
            });
          }
        })
        .catch((err) => {
          console.warn('[OrderContext] Supabase initial orders sync skipped:', err);
        });
    }
    return () => {
      mounted = false;
    };
  }, []);

  const syncCustomerOrders = useCallback(async (email: string) => {
    if (!isSupabaseConfigured || !email) return;
    try {
      const remote = await getCustomerOrdersFromSupabase(email);
      if (remote && remote.length > 0) {
        setOrders((prev) => {
          const remoteNumbers = new Set(remote.map((o) => o.orderNumber));
          const unaffected = prev.filter((o) => !remoteNumbers.has(o.orderNumber));
          return [...remote, ...unaffected];
        });
      }
    } catch (err) {
      console.warn('[OrderContext] syncCustomerOrders error:', err);
    }
  }, []);

  const createOrder = useCallback((input: CreateOrderInput): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...input,
      id: `ord-${Date.now()}`,
      orderNumber: `CYS-2026-${randomSuffix}`,
      paymentStatus: input.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      orderStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      estimatedDelivery: '3-5 Business Days',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Asynchronously sync to Supabase if configured
    saveOrderToSupabase(newOrder).catch((err) => {
      console.warn('[OrderContext] Supabase order sync skipped/failed:', err);
    });

    return newOrder;
  }, []);

  const updateOrderStatus = useCallback(
    (
      orderId: string,
      status: OrderStatus,
      metadata?: {
        shippingLabel?: ShippingLabelData;
        cancellationReason?: string;
      }
    ) => {
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId || ord.orderNumber === orderId) {
            const updatedPayment =
              status === 'DELIVERED' && ord.paymentMethod === 'COD'
                ? 'PAID'
                : status === 'CANCELLED' && ord.paymentStatus === 'PAID'
                ? 'REFUNDED'
                : ord.paymentStatus;

            if (isSupabaseConfigured) {
              updateOrderStatusInSupabase(ord.orderNumber, status, updatedPayment).catch((err) => {
                console.warn('[OrderContext] Error updating order status in Supabase:', err);
              });
            }

            return {
              ...ord,
              orderStatus: status,
              paymentStatus: updatedPayment,
              shippingLabel: metadata?.shippingLabel || ord.shippingLabel,
              cancellationReason: metadata?.cancellationReason || ord.cancellationReason,
            };
          }
          return ord;
        })
      );
    },
    []
  );

  const getOrderById = useCallback(
    (orderId: string) => orders.find((o) => o.id === orderId),
    [orders]
  );

  const resetOrders = useCallback(() => {
    setOrders(INITIAL_ORDERS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    } catch {
      // ignore
    }
  }, []);

  const clearAllOrders = useCallback(() => {
    setOrders([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrdersCount = orders.length;
    const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
    const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'PENDING' || o.orderStatus === 'PACKING').length;
    const shippedOrdersCount = orders.filter((o) => o.orderStatus === 'SHIPPED').length;
    const deliveredOrdersCount = orders.filter((o) => o.orderStatus === 'DELIVERED').length;

    return {
      totalRevenue,
      totalOrdersCount,
      averageOrderValue,
      pendingOrdersCount,
      shippedOrdersCount,
      deliveredOrdersCount,
    };
  }, [orders]);

  const value = useMemo(
    () => ({
      orders,
      createOrder,
      updateOrderStatus,
      getOrderById,
      syncCustomerOrders,
      metrics,
      resetOrders,
      clearAllOrders,
    }),
    [orders, createOrder, updateOrderStatus, getOrderById, syncCustomerOrders, metrics, resetOrders, clearAllOrders]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}

