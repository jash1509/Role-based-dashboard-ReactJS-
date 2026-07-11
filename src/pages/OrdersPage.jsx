import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { formatINR } from '../utils/currency';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      const data = await authAPI.getOrders();
      setOrders(data.data || []);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  const statusConfig = {
    delivered: { cls: 'badge-success', icon: '✅' },
    shipped: { cls: 'badge-primary', icon: '🚚' },
    processing: { cls: 'badge-warning', icon: '⏳' },
    pending: { cls: 'badge-error', icon: '🔴' },
  };

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div id="orders-page">
      <header className="page-header">
        <p className="page-greeting">Your Orders</p>
        <h1 className="page-title">
          My <span>Orders</span> 📋
        </h1>
      </header>

      {/* Summary Stats */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>📦</div>
          <div className="stat-value">{orders.length}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.12)' }}>✅</div>
          <div className="stat-value">{orders.filter((o) => o.status === 'delivered').length}</div>
          <div className="stat-label">Delivered</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)' }}>⏳</div>
          <div className="stat-value">{orders.filter((o) => o.status === 'processing' || o.status === 'pending').length}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.12)' }}>💰</div>
          <div className="stat-value">{formatINR(totalSpent)}</div>
          <div className="stat-label">Total Spent</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="table-toolbar">
        <div className="filter-tabs">
          {['all', 'delivered', 'shipped', 'processing', 'pending'].map((status) => (
            <button
              key={status}
              className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="filter-count">
                  {orders.filter((o) => o.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="table-loading">
          <div className="loading-spinner" style={{ width: '24px', height: '24px' }} />
          <span>Loading orders...</span>
        </div>
      ) : (
        <div className="order-list">
          {filteredOrders.map((order) => {
            const config = statusConfig[order.status] || statusConfig.pending;
            return (
              <article className="order-card" key={order.id}>
                <div className="order-card-header">
                  <div className="order-id">{order.id}</div>
                  <span className={`badge ${config.cls}`}>
                    {config.icon} {order.status}
                  </span>
                </div>
                <div className="order-card-body">
                  <div className="order-detail">
                    <span className="order-detail-label">Product</span>
                    <span className="order-detail-value">{order.product}</span>
                  </div>
                  <div className="order-detail">
                    <span className="order-detail-label">Quantity</span>
                    <span className="order-detail-value">{order.quantity}</span>
                  </div>
                  <div className="order-detail">
                    <span className="order-detail-label">Date</span>
                    <span className="order-detail-value">{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                  <div className="order-detail">
                    <span className="order-detail-label">Total</span>
                    <span className="order-detail-value order-total">{formatINR(order.total)}</span>
                  </div>
                </div>
              </article>
            );
          })}
          {filteredOrders.length === 0 && (
            <div className="order-empty">
              No orders found with status "{filterStatus}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
