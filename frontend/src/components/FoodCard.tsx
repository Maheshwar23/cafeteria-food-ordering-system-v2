import React from 'react';
import { FoodItem } from '../types/food';
import { getFoodImageUrl, DEFAULT_FOOD_IMAGE } from '../utils/imageMap';
import { isItemVegetarian, getFoodMetadata } from '../utils/foodMetadata';

interface FoodCardProps {
  item: FoodItem;
  cartQuantity: number;
  onAddToCart: (item: FoodItem) => void;
  onOpenDetails?: (item: FoodItem) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Burger: { bg: '#ffedd5', text: '#c2410c' },
  Pizza: { bg: '#fee2e2', text: '#b91c1c' },
  'Sandwiches & Wraps': { bg: '#fef3c7', text: '#b45309' },
  'Snacks & Sides': { bg: '#ffedd5', text: '#c2410c' },
  Pasta: { bg: '#e0f2fe', text: '#0284c7' },
  'Indian Meals': { bg: '#fef9c3', text: '#a16207' },
  Beverage: { bg: '#e0f2fe', text: '#0369a1' },
  Dessert: { bg: '#fce7f3', text: '#be185d' },
};

const CATEGORY_ICONS: Record<string, string> = {
  Burger: '🍔',
  Pizza: '🍕',
  'Sandwiches & Wraps': '🥪',
  'Snacks & Sides': '🍟',
  Pasta: '🍝',
  'Indian Meals': '🍛',
  Beverage: '🥤',
  Dessert: '🍰',
};

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  cartQuantity,
  onAddToCart,
  onOpenDetails,
}) => {
  const color = CATEGORY_COLORS[item.category] || { bg: '#f3f4f6', text: '#374151' };
  const icon = CATEGORY_ICONS[item.category] || '🍽️';
  const isVeg = item.vegetarian !== undefined ? item.vegetarian : isItemVegetarian(item.name);
  const metadata = getFoodMetadata(item.name, item.category);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.src !== window.location.origin + DEFAULT_FOOD_IMAGE) {
      target.src = DEFAULT_FOOD_IMAGE;
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only open details if user didn't click the "Add to Cart" button directly
    const target = e.target as HTMLElement;
    if (target.closest('.btn-add-cart')) {
      return;
    }
    if (onOpenDetails) {
      onOpenDetails(item);
    }
  };

  return (
    <article
      className={`food-card ${onOpenDetails ? 'clickable-card' : ''}`}
      id={`food-card-${item.id}`}
      onClick={handleCardClick}
      role={onOpenDetails ? 'button' : undefined}
      tabIndex={onOpenDetails ? 0 : undefined}
      onKeyDown={(e) => {
        if (onOpenDetails && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onOpenDetails(item);
        }
      }}
    >
      <div className="food-card-header">
        <span
          className="food-category-badge"
          style={{ backgroundColor: color.bg, color: color.text }}
        >
          {icon} {item.category}
        </span>

        {cartQuantity > 0 && (
          <span className="card-cart-qty" title={`${cartQuantity} in cart`}>
            {cartQuantity} in cart
          </span>
        )}

        <span
          className={`dietary-badge ${isVeg ? 'veg' : 'non-veg'}`}
          title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          id={`dietary-badge-${item.id}`}
        >
          <span className="dietary-dot-indicator">{isVeg ? '🟢' : '🔴'}</span>
          <span className="dietary-label">{isVeg ? 'Veg' : 'Non-Veg'}</span>
        </span>
      </div>

      <div className="food-card-image-wrap">
        <img
          src={getFoodImageUrl(item.name)}
          alt={item.name}
          className="food-card-image"
          loading="lazy"
          onError={handleImageError}
        />
        {metadata.allowedAddOns.length > 0 && (
          <span className="customizable-pill" title="Customizable with delicious add-ons">
            ⚙️ Customizable
          </span>
        )}
      </div>

      <div className="food-card-body">
        <h3 className="food-name">{item.name}</h3>
        <p className="food-desc">{metadata.description}</p>
      </div>

      <div className="food-card-footer">
        <div className="food-price-wrap">
          <span className="price-currency">₹</span>
          <span className="price-amount">{item.price.toFixed(2)}</span>
        </div>

        <button
          id={`add-to-cart-btn-${item.id}`}
          className="btn-add-cart"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(item);
          }}
          type="button"
          aria-label={`Add ${item.name} to cart`}
        >
          <span>Add</span>
          <span className="btn-icon">＋</span>
        </button>
      </div>
    </article>
  );
};
