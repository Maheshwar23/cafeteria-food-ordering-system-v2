import React, { useState } from 'react';
import { CartItem } from '../types/food';
import { getFoodImageUrl, DEFAULT_FOOD_IMAGE } from '../utils/imageMap';

interface CartPageProps {
  items: CartItem[];
  onIncreaseQuantity: (foodItemId: number) => void;
  onDecreaseQuantity: (foodItemId: number) => void;
  onRemoveItem: (foodItemId: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.foodItem.price * item.quantity,
    0
  );

  const handleConfirmClear = () => {
    onClearCart();
    setShowClearConfirm(false);
  };

  return (
    <div className="cart-page-container" id="cart-page">
      {/* Top Navigation Bar */}
      <div className="cart-page-topbar">
        <button
          type="button"
          className="btn-cart-back"
          onClick={onContinueShopping}
          id="cart-back-to-menu-btn"
        >
          ← Continue Shopping
        </button>
        <div className="cart-page-heading-group">
          <h2 className="cart-page-title">Your Order Cart</h2>
          <span className="cart-page-count-badge" id="cart-item-count-badge">
            {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        /* Empty Cart State */
        <div className="cart-page-empty" id="cart-page-empty-state">
          <div className="empty-cart-illustration">🛒</div>
          <h3 className="empty-cart-heading">Your cart is empty</h3>
          <p className="empty-cart-text">
            Looks like you haven't added anything to your tray yet. Explore our delicious cafeteria catalog and pick your favorites!
          </p>
          <button
            type="button"
            className="btn-browse-menu"
            onClick={onContinueShopping}
            id="browse-menu-empty-btn"
          >
            🍽️ Browse Menu
          </button>
        </div>
      ) : (
        /* Populated Cart Layout */
        <div className="cart-page-layout">
          {/* Main items list */}
          <div className="cart-page-items-section">
            <div className="cart-page-items-header">
              <span className="cart-items-header-title">Items in Your Tray</span>
              <button
                type="button"
                className="btn-clear-cart-modal"
                onClick={() => setShowClearConfirm(true)}
                id="cart-page-clear-btn"
              >
                🗑️ Clear All
              </button>
            </div>

            <div className="cart-page-items-list" id="cart-page-items-list">
              {items.map(({ foodItem, quantity }) => {
                const itemTotal = foodItem.price * quantity;
                const imageUrl = getFoodImageUrl(foodItem.name);

                return (
                  <div
                    key={foodItem.id}
                    className="cart-page-item-card"
                    id={`cart-page-item-${foodItem.id}`}
                  >
                    {/* Food Image */}
                    <div className="cart-item-image-wrapper">
                      <img
                        src={imageUrl}
                        alt={foodItem.name}
                        className="cart-item-thumbnail"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_FOOD_IMAGE;
                        }}
                      />
                    </div>

                    {/* Item Info */}
                    <div className="cart-item-details">
                      <div className="cart-item-category-tag">{foodItem.category}</div>
                      <h4 className="cart-item-card-name">{foodItem.name}</h4>
                      <div className="cart-item-card-price">₹{foodItem.price.toFixed(2)} each</div>
                    </div>

                    {/* Quantity controls */}
                    <div className="cart-item-qty-section">
                      <div className="cart-qty-pill">
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => onDecreaseQuantity(foodItem.id)}
                          aria-label={`Decrease quantity of ${foodItem.name}`}
                          id={`cart-decrease-${foodItem.id}`}
                        >
                          −
                        </button>
                        <span
                          className="cart-qty-number"
                          id={`cart-qty-val-${foodItem.id}`}
                        >
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => onIncreaseQuantity(foodItem.id)}
                          aria-label={`Increase quantity of ${foodItem.name}`}
                          id={`cart-increase-${foodItem.id}`}
                        >
                          ＋
                        </button>
                      </div>
                    </div>

                    {/* Line total & remove */}
                    <div className="cart-item-subtotal-section">
                      <span className="cart-item-line-total" id={`cart-line-total-${foodItem.id}`}>
                        ₹{itemTotal.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        className="cart-item-remove-btn"
                        onClick={() => onRemoveItem(foodItem.id)}
                        aria-label={`Remove ${foodItem.name} from cart`}
                        title="Remove item"
                        id={`cart-remove-item-${foodItem.id}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right sidebar: Order summary */}
          <aside className="cart-page-summary-section">
            <div className="cart-summary-card">
              <h3 className="summary-card-title">Order Summary</h3>

              <div className="summary-breakdown">
                <div className="summary-row">
                  <span className="summary-label">Items Count:</span>
                  <span className="summary-val">{totalItemCount} pcs ({items.length} unique)</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Cart Subtotal:</span>
                  <span className="summary-val font-bold" id="cart-page-subtotal">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="summary-row discount-info-row">
                  <span className="summary-label">Discounts:</span>
                  <span className="summary-val text-green">Available at checkout</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row total-row">
                  <span className="total-label">Estimated Total:</span>
                  <span className="total-val" id="cart-page-total">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="summary-note">
                ℹ️ Delivery options, special instructions, and discounts (10% student off or ₹50 coupon) are selected in the next step.
              </div>

              <div className="cart-page-cta-group">
                <button
                  type="button"
                  className="btn-proceed-checkout"
                  onClick={onProceedToCheckout}
                  id="cart-proceed-checkout-btn"
                >
                  Proceed to Checkout →
                </button>
                <button
                  type="button"
                  className="btn-continue-shopping-secondary"
                  onClick={onContinueShopping}
                  id="cart-continue-shopping-btn"
                >
                  ← Add More Items
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-cart-modal-title"
        >
          <div className="modal-panel clear-cart-panel">
            <div className="modal-icon-badge">⚠️</div>
            <h3 className="modal-title" id="clear-cart-modal-title">Clear Your Cart?</h3>
            <p className="modal-description">
              Are you sure you want to remove all {totalItemCount} items from your cafeteria cart? This action cannot be undone.
            </p>
            <div className="modal-actions-row">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setShowClearConfirm(false)}
                id="cancel-clear-cart-btn"
              >
                No, Keep Items
              </button>
              <button
                type="button"
                className="btn-modal-danger"
                onClick={handleConfirmClear}
                id="confirm-clear-cart-btn"
              >
                Yes, Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
