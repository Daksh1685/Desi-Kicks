/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Order, OrderStatus, OrderItem } from '../types/order';

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'DK-2026-9812',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      street: '402, Lotus Heights, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
    },
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Royal Velvet Embroidered Mojari',
        size: 'UK 9',
        price: 3495,
        quantity: 1,
        img: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
      },
    ],
    subtotal: 3495,
    discount: 500,
    shippingFee: 0,
    totalAmount: 2995,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED',
    createdAt: '2026-11-06T14:30:00Z',
    estimatedDelivery: 'Nov 09, 2026',
  },
  {
    id: 'ord-1002',
    orderNumber: 'DK-2026-9813',
    customerName: 'Priya Iyer',
    customerEmail: 'priya.iyer@example.com',
    customerPhone: '+91 98220 12345',
    shippingAddress: {
      street: 'Flat 12B, Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
    },
    items: [
      {
        id: 'item-2',
        productId: 'prod-3',
        productName: 'Aura Metallic Block Heel Sandal',
        size: 'UK 6',
        price: 2995,
        quantity: 1,
        img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'item-3',
        productId: 'prod-2',
        productName: 'CloudKnit Daily Slip-On Loafer',
        size: 'UK 7',
        price: 2295,
        quantity: 1,
        img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
      },
    ],
    subtotal: 5290,
    discount: 1000,
    shippingFee: 0,
    totalAmount: 4290,
    paymentMethod: 'Card',
    paymentStatus: 'PAID',
    orderStatus: 'SHIPPED',
    createdAt: '2026-11-08T09:15:00Z',
    estimatedDelivery: 'Nov 11, 2026',
  },
  {
    id: 'ord-1003',
    orderNumber: 'DK-2026-9814',
    customerName: 'Rohan Verma',
    customerEmail: 'rohan.v@example.com',
    customerPhone: '+91 97111 88990',
    shippingAddress: {
      street: 'H-24, South Extension Part II',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110049',
    },
    items: [
      {
        id: 'item-4',
        productId: 'prod-4',
        productName: 'Vortex Flex Gym & Pro Runner',
        size: 'UK 10',
        price: 3995,
        quantity: 1,
        img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      },
    ],
    subtotal: 3995,
    discount: 0,
    shippingFee: 0,
    totalAmount: 3995,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    orderStatus: 'PACKING',
    createdAt: '2026-11-09T06:40:00Z',
    estimatedDelivery: 'Nov 12, 2026',
  },
  {
    id: 'ord-1004',
    orderNumber: 'DK-2026-9815',
    customerName: 'Ananya Mehra',
    customerEmail: 'ananya.m@example.com',
    customerPhone: '+91 98450 77123',
    shippingAddress: {
      street: 'Plot 88, Jubilee Hills Road 36',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
    },
    items: [
      {
        id: 'item-5',
        productId: 'prod-5',
        productName: 'Handcrafted Heritage Penny Loafer',
        size: 'UK 8',
        price: 4995,
        quantity: 1,
        img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
      },
    ],
    subtotal: 4995,
    discount: 500,
    shippingFee: 0,
    totalAmount: 4495,
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    orderStatus: 'PENDING',
    createdAt: '2026-11-09T08:10:00Z',
    estimatedDelivery: 'Nov 13, 2026',
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
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  metrics: {
    totalRevenue: number;
    totalOrdersCount: number;
    averageOrderValue: number;
    pendingOrdersCount: number;
    shippedOrdersCount: number;
    deliveredOrdersCount: number;
  };
  resetOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STORAGE_KEY = 'desikicks_orders_store';

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  const createOrder = useCallback((input: CreateOrderInput): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...input,
      id: `ord-${Date.now()}`,
      orderNumber: `DK-2026-${randomSuffix}`,
      paymentStatus: input.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      orderStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      estimatedDelivery: '3-5 Business Days',
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedPayment =
            status === 'DELIVERED' && ord.paymentMethod === 'COD'
              ? 'PAID'
              : ord.paymentStatus;
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
      metrics,
      resetOrders,
    }),
    [orders, createOrder, updateOrderStatus, getOrderById, metrics, resetOrders]
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

