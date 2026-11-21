import { useState, useEffect, useMemo } from 'react';
import { Icon } from '../../components/ui/Icon';
import {
  getAllReturnExchangesFromSupabase,
  updateReturnExchangeStatusInSupabase,
  isSupabaseConfigured,
  type ReturnExchangeItem,
} from '../../lib/supabase';

interface ReturnsSectionProps {
  showToast: (msg: string) => void;
}

const DEFAULT_RETURNS: ReturnExchangeItem[] = [
  {
    id: 'ret-1',
    requestNumber: 'EX-849201',
    orderNumber: 'CYS-2026-4821',
    productName: 'Royal Velvet Embroidered Mojari',
    oldSize: 'UK 8',
    requestedSize: 'UK 9',
    reason: 'Size runs too tight across the instep',
    status: 'SCHEDULED_PICKUP',
    customerEmail: 'rohit.verma@example.com',
    createdAt: '2026-02-18T10:30:00Z',
  },
  {
    id: 'ret-2',
    requestNumber: 'EX-620194',
    orderNumber: 'CYS-2026-9134',
    productName: "Women's In Bloom Pastel Sneaker",
    oldSize: 'UK 6',
    requestedSize: 'UK 7',
    reason: 'Toe box feels snug during walking',
    status: 'IN_TRANSIT',
    customerEmail: 'ananya.singh@example.com',
    createdAt: '2026-02-17T14:15:00Z',
  },
];

export function ReturnsSection({ showToast }: ReturnsSectionProps) {
  const [requests, setRequests] = useState<ReturnExchangeItem[]>(DEFAULT_RETURNS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    let mounted = true;
    if (isSupabaseConfigured) {
      getAllReturnExchangesFromSupabase()
        .then((remote) => {
          if (mounted && remote && remote.length > 0) {
            setRequests(remote);
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

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch =
        r.requestNumber.toLowerCase().includes(search.toLowerCase()) ||
        r.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        r.productName.toLowerCase().includes(search.toLowerCase()) ||
        (r.customerEmail && r.customerEmail.toLowerCase().includes(search.toLowerCase()));

      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [requests, search, statusFilter]);

  const handleUpdateStatus = async (item: ReturnExchangeItem, newStatus: ReturnExchangeItem['status']) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, status: newStatus } : r))
    );
    showToast(`Request ${item.requestNumber} status updated to ${newStatus}.`);

    if (isSupabaseConfigured) {
      await updateReturnExchangeStatusInSupabase(item.id, newStatus);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Icon name="search" className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search request #, order #, customer email..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="SCHEDULED_PICKUP">Scheduled Pickup</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 text-sm">
            {loading ? 'Loading return & exchange requests...' : 'No size exchange requests found.'}
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">
                    {req.requestNumber}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">for Order #{req.orderNumber}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      req.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'IN_TRANSIT'
                        ? 'bg-blue-100 text-blue-800'
                        : req.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {req.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{req.productName}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-gray-500 line-through">Old Size: {req.oldSize}</span>
                    <span className="text-gray-400 font-bold">➔</span>
                    <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">
                      Requested Size: {req.requestedSize}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1.5 italic bg-gray-50 p-2 rounded-lg border border-gray-100">
                    "{req.reason}"
                  </p>
                </div>

                <div className="text-[11px] text-gray-400 flex items-center gap-3">
                  {req.customerEmail && <span>Customer: {req.customerEmail}</span>}
                  <span>Submitted: {new Date(req.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0">
                {req.status === 'SCHEDULED_PICKUP' && (
                  <button
                    onClick={() => handleUpdateStatus(req, 'IN_TRANSIT')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Mark In Transit →
                  </button>
                )}
                {req.status === 'IN_TRANSIT' && (
                  <button
                    onClick={() => handleUpdateStatus(req, 'COMPLETED')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Mark Completed ✓
                  </button>
                )}
                {req.status !== 'COMPLETED' && req.status !== 'REJECTED' && (
                  <button
                    onClick={() => handleUpdateStatus(req, 'REJECTED')}
                    className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition cursor-pointer"
                  >
                    Reject Request
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
