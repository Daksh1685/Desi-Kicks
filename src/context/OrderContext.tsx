/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Order, OrderStatus, OrderItem } from '../types/order';
import {
  saveOrderToSupabase,
  updateOrderStatusInSupabase,
  getAllOrdersFromSupabase,
  getCustomerOrdersFromSupabase,
  isSupabaseConfigured,
} from '../lib/supabase';

const INITIAL_ORDERS: Order[] = [];

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
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
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
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (o) => !o.id?.startsWith('ord-100') && o.customerEmail !== 'aarav.sharma@example.com'
          );
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

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          const updatedPayment =
            status === 'DELIVERED' && ord.paymentMethod === 'COD'
              ? 'PAID'
              : ord.paymentStatus;

          if (isSupabaseConfigured) {
            updateOrderStatusInSupabase(ord.orderNumber, status, updatedPayment).catch((err) => {
              console.warn('[OrderContext] Error updating order status in Supabase:', err);
            });
          }

          return { ...ord, orderStatus: status, paymentStatus: updatedPayment };
        }
        return ord;
      })
    );
  }, []);

  const getOrderById = useCallback(
    (orderId: string) => orders.find((o) => o.id === orderId),
    [orders]
  );

  const resetOrders = useCallback(() => {
    setOrders(INITIAL_ORDERS);
    localStorage.removeItem(STORAGE_KEY);
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

