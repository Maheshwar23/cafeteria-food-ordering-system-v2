import React, { useState } from 'react';
import { FoodItem } from '../types/food';
import { CustomizationOption, getFoodMetadata } from '../utils/foodMetadata';
import { getFoodImageUrl, DEFAULT_FOOD_IMAGE } from '../utils/imageMap';
import { isItemVegetarian } from '../utils/foodMetadata';

interface FoodDetailModalProps {
  item: FoodItem;
  currentCartQuantity: number;
  onClose: () => void;
  onAddToCart: (item: FoodItem, selectedAddOns: CustomizationOption[], quantity: number) => void;
}

const SPICE_ICONS: Record<string, string> = {
  None: '⬜',
  Mild: '🟡',
  Medium: '🟠',
  Hot: '🔴',
};

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  item,
  currentCartQuantity,
  onClose,
  onAddToCart,
}) => {
  const metadata = getFoodMetadata(item.name, item.category);
  const isVeg = item.vegetarian !== undefined ? item.vegetarian : isItemVegetarian(item.name);

  const [selectedAddOnIds, setSelectedAddOnIds] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState(1);

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOnIds((prev) => {
      const next = new Set(prev);
      if (next.has(addOnId)) {
        next.delete(addOnId);
      } else {
        next.add(addOnId);
      }
      return next;
    });
  };

  const selectedAddOns = metadata.allowedAddOns.filter((ao) =>
    selectedAddOnIds.has(ao.id)
  );
  const addOnTotal = selectedAddOns.reduce((s, ao) => s + ao.price, 0);
  const unitTotal = item.price + addOnTotal;
  const grandTotal = unitTotal * quantity;

  const handleAddToCart = () => {
    onAddToCart(item, selectedAddOns, quantity);
    onClose();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = DEFAULT_FOOD_IMAGE;
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="food-detail-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="food-detail-panel" id="food-detail-modal">
        {/* Close button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close food details"
          id="food-detail-close-btn"
        >
          ✕
        </button>

        {/* Hero image */}
        <div className="food-detail-image-wrap">
          <img
            src={getFoodImageUrl(item.name)}
            alt={item.name}
            className="food-detail-hero-image"
            onError={handleImageError}
          />
          <span
            className={`food-detail-diet-badge ${isVeg ? 'veg' : 'non-veg'}`}
            title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <span>{isVeg ? '🟢' : '🔴'}</span>
            <span>{isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
          </span>
        </div>

        {/* Scrollable body */}
        <div className="food-detail-body">
          {/* Title + category */}
          <div className="food-detail-title-row">
            <div>
              <h2 className="food-detail-name" id="food-detail-modal-title">
                {item.name}
              </h2>
              <span className="food-detail-category-tag">{item.category}</span>
            </div>
            <div className="food-detail-base-price">
              <span className="price-currency">₹</span>
              {item.price.toFixed(2)}
            </div>
          </div>

          {/* Description */}
          <p className="food-detail-description">{metadata.description}</p>

          {/* Spice level */}
          {metadata.spiceLevel && metadata.spiceLevel !== 'None' && (
            <div className="food-detail-spice-row">
              <span className="food-detail-spice-label">Spice Level:</span>
              <span className="food-detail-spice-value">
                {SPICE_ICONS[metadata.spiceLevel]} {metadata.spiceLevel}
              </span>
            </div>
          )}

          {/* Ingredients */}
          <div className="food-detail-ingredients">
            <h4 className="food-detail-section-title">🌿 Key Ingredients</h4>
            <div className="ingredients-chips">
              {metadata.ingredients.map((ing) => (
                <span key={ing} className="ingredient-chip">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          {metadata.allowedAddOns.length > 0 && (
            <div className="food-detail-addons">
              <h4 className="food-detail-section-title">⚙️ Customizations</h4>
              <p className="addons-note">Prices confirmed by our backend — no hidden charges.</p>
              <div className="addons-list">
                {metadata.allowedAddOns.map((addOn) => {
                  const isSelected = selectedAddOnIds.has(addOn.id);
                  return (
                    <label
                      key={addOn.id}
                      className={`addon-card ${isSelected ? 'addon-selected' : ''}`}
                      id={`addon-${addOn.id.toLowerCase()}`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isSelected}
                        onChange={() => toggleAddOn(addOn.id)}
                      />
                      <div className="addon-check-indicator">
                        {isSelected ? '✓' : '＋'}
                      </div>
                      <div className="addon-info">
                        <span className="addon-name">{addOn.name}</span>
                        {addOn.description && (
                          <span className="addon-desc">{addOn.description}</span>
                        )}
                      </div>
                      <span className="addon-price">+₹{addOn.price.toFixed(2)}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="food-detail-qty-section">
            <h4 className="food-detail-section-title">Quantity</h4>
            <div className="food-detail-qty-row">
              <div className="food-detail-qty-pill">
                <button
                  type="button"
                  className="food-detail-qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  id="food-detail-qty-decrease"
                >
                  −
                </button>
                <span className="food-detail-qty-value" id="food-detail-qty-value">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="food-detail-qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  id="food-detail-qty-increase"
                >
                  ＋
                </button>
              </div>

              {currentCartQuantity > 0 && (
                <span className="already-in-cart-note">
                  {currentCartQuantity} already in cart
                </span>
              )}
            </div>
          </div>

          {/* Price summary */}
          <div className="food-detail-price-summary">
            <div className="price-summary-row">
              <span>Base price</span>
              <span>₹{item.price.toFixed(2)}</span>
            </div>
            {selectedAddOns.length > 0 && (
              <div className="price-summary-row">
                <span>Add-ons ({selectedAddOns.length})</span>
                <span>+₹{addOnTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="price-summary-row">
              <span>Qty</span>
              <span>×{quantity}</span>
            </div>
            <div className="price-summary-divider" />
            <div className="price-summary-row price-summary-total">
              <span>Total</span>
              <span id="food-detail-grand-total">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="food-detail-cta">
            <button
              type="button"
              className="btn-add-to-cart-modal"
              onClick={handleAddToCart}
              id="food-detail-add-to-cart-btn"
            >
              🛒 Add to Cart — ₹{grandTotal.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
