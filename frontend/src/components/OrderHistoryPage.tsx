import React, { useState, useEffect, useCallback } from 'react';
import { OrderResponse, OrderItemResponse, FoodItem, CartItem } from '../types/food';
import { fetchOrdersByEmail } from '../services/api';
import { generateInvoicePdf } from '../utils/invoiceGenerator';

interface OrderHistoryPageProps {
  customerEmail: string;
  currentFoodItems: FoodItem[];
  onBackToMenu: () => void;
  onOrderAgain: (items: CartItem[]) => void;
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

function formatDelivery(opt: string | null): string {
  if (!opt) return '—';
  return opt === 'DINE_IN' ? '🍽️ Dine In' : opt === 'TAKEAWAY' ? '🥡 Takeaway' : '🚗 Delivery';
}

function formatPayment(opt: string | null): string {
  if (!opt) return '—';
  const upper = opt.toUpperCase();
  if (upper.includes('UPI')) return '📱 UPI';
  if (upper.includes('CARD')) return '💳 Card';
  if (upper.includes('CASH') || upper.includes('MOCK')) return '💵 Cash';
  return opt;
}

function formatStatus(status: string): { label: string; cls: string } {
  const map: Record<string, { label: string; cls: string }> = {
    PLACED: { label: '📋 Placed', cls: 'status-placed' },
    PREPARING: { label: '👨‍🍳 Preparing', cls: 'status-preparing' },
    READY: { label: '✅ Ready', cls: 'status-ready' },
    OUT_FOR_DELIVERY: { label: '🚗 Out for Delivery', cls: 'status-delivering' },
    DELIVERED: { label: '🎉 Delivered', cls: 'status-delivered' },
    CANCELLED: { label: '❌ Cancelled', cls: 'status-cancelled' },
  };
  return map[status] || { label: status, cls: '' };
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({
  customerEmail,
  currentFoodItems,
  onBackToMenu,
  onOrderAgain,
}) => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [reorderToast, setReorderToast] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await fetchOrdersByEmail(customerEmail);
      setOrders(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order history.');
    } finally {
      setLoading(false);
    }
  }, [customerEmail]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleDownloadInvoice = (order: OrderResponse) => {
    const invoiceOrder = {
      orderId: order.id,
      success: true,
      message: 'Order from history',
      finalPrice: order.totalAmount,
      status: order.status,
      transactionId: null,
      address: order.address,
      deliveryOption: order.deliveryOption,
      paymentOption: order.paymentOption,
      items: order.items,
      customerEmail: order.customerEmail ?? null,
    };
    generateInvoicePdf(invoiceOrder, order.customerEmail ?? customerEmail);
  };

  const handleOrderAgain = (order: OrderResponse) => {
    const cartItems: CartItem[] = [];
    const unavailable: string[] = [];

    for (const item of order.items) {
      const found = currentFoodItems.find(
        (f) =>
          f.name.toLowerCase() === item.foodName.toLowerCase() &&
          f.category.toLowerCase() === item.foodCategory.toLowerCase()
      );

      if (found) {
        cartItems.push({
          foodItem: found,
          quantity: item.quantity,
          // Note: add-ons from past orders are not re-added as they may differ
        });
      } else {
        unavailable.push(item.foodName);
      }
    }

    if (cartItems.length === 0) {
      setReorderToast('⚠️ None of the items from this order are currently available.');
    } else {
      const msgs = [];
      if (cartItems.length > 0) msgs.push(`${cartItems.length} item(s) added to cart`);
      if (unavailable.length > 0) msgs.push(`${unavailable.join(', ')} no longer available`);
      setReorderToast(`🛒 ${msgs.join(' · ')}`);
      onOrderAgain(cartItems);
    }

    setTimeout(() => setReorderToast(null), 4000);
  };

  return (
    <div className="order-history-page" id="order-history-page">
      {/* Toast */}
      {reorderToast && (
        <div className="reorder-toast" id="reorder-toast" role="alert">
          {reorderToast}
        </div>
      )}

      {/* Header bar */}
      <div className="order-history-topbar">
        <button
          type="button"
          className="btn-cart-back"
          onClick={onBackToMenu}
          id="history-back-btn"
        >
          ← Back to Menu
        </button>
        <div className="order-history-heading-group">
          <h2 className="order-history-title">📦 My Order History</h2>
          <span className="order-history-email-tag">{customerEmail}</span>
        </div>
        <button
          type="button"
          className="btn-retry"
          onClick={loadOrders}
          id="history-refresh-btn"
          title="Refresh order history"
          style={{ marginLeft: 'auto' }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Demo notice */}
      <div className="order-history-demo-note">
        ℹ️ <strong>Demo mode:</strong> Only orders placed with your login email are shown.
        Orders placed as a guest or before login are not linked to your account.
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-state" id="history-loading-spinner">
          <div className="spinner" />
          <p>Loading your orders…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="error-card" id="history-error">
          <div className="error-icon">⚠️</div>
          <div className="error-body">
            <h3 className="error-title">Could not load orders</h3>
            <p className="error-text">{error}</p>
            <button className="btn-retry" onClick={loadOrders} id="history-retry-btn">
              🔄 Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && orders.length === 0 && (
        <div className="empty-menu" id="history-empty-state">
          <span className="empty-menu-icon">📋</span>
          <h3>No orders found</h3>
          <p>
            You haven't placed any orders with this account yet. Start browsing our menu and
            your order history will appear here!
          </p>
          <button
            type="button"
            className="btn-browse-menu"
            onClick={onBackToMenu}
            id="history-browse-menu-btn"
          >
            🍽️ Browse Menu
          </button>
        </div>
      )}

      {/* Orders list */}
      {!loading && !error && orders.length > 0 && (
        <div className="order-history-list" id="order-history-list">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const statusInfo = formatStatus(order.status);
            return (
              <div
                key={order.id}
                className="order-history-card"
                id={`order-history-card-${order.id}`}
              >
                {/* Card header (always visible) */}
                <div
                  className="order-history-card-header"
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setExpandedOrderId(isExpanded ? null : order.id);
                    }
                  }}
                  aria-expanded={isExpanded}
                >
                  <div className="order-history-card-meta">
                    <span className="order-id-badge">Order #{order.id}</span>
                    <span className="order-date-time">{formatDateTime(order.createdAt)}</span>
                  </div>
                  <div className="order-history-card-summary">
                    <span className={`order-status-pill ${statusInfo.cls}`}>{statusInfo.label}</span>
                    <span className="order-history-total">₹{order.totalAmount.toFixed(2)}</span>
                    <span className="order-expand-chevron">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded detail section */}
                {isExpanded && (
                  <div className="order-history-card-detail">
                    {/* Logistics row */}
                    <div className="order-logistics-row">
                      <span>{formatDelivery(order.deliveryOption)}</span>
                      <span>{formatPayment(order.paymentOption)}</span>
                      {order.address && (
                        <span className="order-address-text">📍 {order.address}</span>
                      )}
                    </div>

                    {/* Items table */}
                    <div className="order-history-items-table">
                      <div className="order-items-table-header">
                        <span>Item</span>
                        <span>Qty</span>
                        <span>Unit</span>
                        <span>Subtotal</span>
                      </div>
                      {order.items.map((item: OrderItemResponse, idx) => (
                        <div key={idx} className="order-items-table-row">
                          <div className="order-item-name-cell">
                            <span>{item.foodName}</span>
                            {item.customizations && item.customizations.length > 0 && (
                              <div className="order-item-customizations">
                                {item.customizations.map((c, ci) => (
                                  <span key={ci} className="customization-chip">{c.trim()}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <span>{item.quantity}</span>
                          <span>₹{item.unitPrice.toFixed(2)}</span>
                          <span>₹{item.subtotal.toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="order-items-table-total">
                        <span>Order Total</span>
                        <span />
                        <span />
                        <span>₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="order-history-actions">
                      <button
                        type="button"
                        className="btn-download-invoice"
                        onClick={() => handleDownloadInvoice(order)}
                        id={`history-download-invoice-${order.id}`}
                      >
                        📄 Download Invoice
                      </button>
                      <button
                        type="button"
                        className="btn-order-again"
                        onClick={() => handleOrderAgain(order)}
                        id={`history-order-again-${order.id}`}
                      >
                        🔁 Order Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
