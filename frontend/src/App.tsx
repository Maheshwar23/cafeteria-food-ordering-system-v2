import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FoodItem, CartItem, Category, PlaceOrderRequest, PlaceOrderResponse } from './types/food';
import { fetchFoodItems, placeOrder } from './services/api';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { CategoryFilter } from './components/CategoryFilter';
import { FoodCard } from './components/FoodCard';
import { CartPage } from './components/CartPage';
import { Checkout } from './components/Checkout';
import { UpiPaymentPage } from './components/UpiPaymentPage';
import { OrderConfirmation } from './components/OrderConfirmation';
import { OrderTracking } from './components/OrderTracking';
import { SearchFilterBar } from './components/SearchFilterBar';
import { FoodDetailModal } from './components/FoodDetailModal';
import { OrderHistoryPage } from './components/OrderHistoryPage';
import {
  DietaryType,
  SortOption,
  CustomizationOption,
  isItemVegetarian,
  getFoodMetadata,
} from './utils/foodMetadata';
import './index.css';

const CATEGORIES: Category[] = [
  'All',
  'Burger',
  'Pizza',
  'Sandwiches & Wraps',
  'Snacks & Sides',
  'Pasta',
  'Indian Meals',
  'Beverage',
  'Dessert',
];

/** Top-level view the app is currently showing */
type AppView = 'menu' | 'cart' | 'checkout' | 'payment' | 'confirmation' | 'tracking' | 'history';

export const App: React.FC = () => {
  // ── Auth state ─────────────────────────────────────────────────────────────
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  const handleLoginSuccess = (email: string) => {
    setLoggedInUser(email);
  };

  const handleLogout = () => {
    // Clear all session-specific state when the user signs out.
    setLoggedInUser(null);
    setCartItems([]);
    setPlacedOrder(null);
    setPendingUpiRequest(null);
    setSubmitError(null);
    setSelectedDetailItem(null);
    setSearchQuery('');
    setDietaryFilter('ALL');
    setSortOption('DEFAULT');
    setAppView('menu');
  };

  // ── Menu / cart state ──────────────────────────────────────────────────────
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ── Search & Filter State ──────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryType>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('DEFAULT');

  // ── Food Detail Modal State ────────────────────────────────────────────────
  const [selectedDetailItem, setSelectedDetailItem] = useState<FoodItem | null>(null);

  // ── View state ─────────────────────────────────────────────────────────────
  const [appView, setAppView] = useState<AppView>('menu');

  // ── Order submission state ─────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<PlaceOrderResponse | null>(null);
  const [pendingUpiRequest, setPendingUpiRequest] = useState<PlaceOrderRequest | null>(null);

  // ── Food items loading ─────────────────────────────────────────────────────
  const loadFoodItems = useCallback(async (category: Category) => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchFoodItems(category);
      setFoodItems(items);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to reach the cafeteria backend server.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFoodItems(selectedCategory);
  }, [selectedCategory, loadFoodItems]);

  // ── Client-Side Filter & Sort Processing ───────────────────────────────────
  const filteredAndSortedFoodItems = useMemo(() => {
    let items = [...foodItems];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter((item) => {
        const meta = getFoodMetadata(item.name, item.category);
        const matchName = item.name.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchDesc = meta.description.toLowerCase().includes(q);
        const matchIngr = meta.ingredients.some((ing) => ing.toLowerCase().includes(q));
        return matchName || matchCat || matchDesc || matchIngr;
      });
    }

    // Dietary filter
    if (dietaryFilter === 'VEG') {
      items = items.filter((item) => isItemVegetarian(item.name));
    } else if (dietaryFilter === 'NON_VEG') {
      items = items.filter((item) => !isItemVegetarian(item.name));
    }

    // Price sort
    if (sortOption === 'PRICE_LOW_HIGH') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'PRICE_HIGH_LOW') {
      items.sort((a, b) => b.price - a.price);
    }

    return items;
  }, [foodItems, searchQuery, dietaryFilter, sortOption]);

  // ── Cart operations ────────────────────────────────────────────────────────
  const getCustomCartItemId = (foodItem: FoodItem, addOns?: CustomizationOption[]): string => {
    if (!addOns || addOns.length === 0) {
      return `${foodItem.id}`;
    }
    const sortedAddOns = [...addOns].map((ao) => ao.id).sort().join('_');
    return `${foodItem.id}__${sortedAddOns}`;
  };

  const handleAddToCartWithCustomizations = (
    item: FoodItem,
    addOns: CustomizationOption[] = [],
    quantity: number = 1
  ) => {
    const cartItemId = getCustomCartItemId(item, addOns);
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => (ci.cartItemId || String(ci.foodItem.id)) === cartItemId
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          foodItem: item,
          quantity,
          selectedAddOns: addOns.length > 0 ? addOns : undefined,
          cartItemId,
        },
      ];
    });
  };

  const handleAddToCart = (item: FoodItem) => {
    handleAddToCartWithCustomizations(item, [], 1);
  };

  const handleIncreaseQuantity = (identifier: string | number) => {
    const idStr = String(identifier);
    setCartItems((prev) =>
      prev.map((ci) =>
        (ci.cartItemId || String(ci.foodItem.id)) === idStr
          ? { ...ci, quantity: ci.quantity + 1 }
          : ci
      )
    );
  };

  const handleDecreaseQuantity = (identifier: string | number) => {
    const idStr = String(identifier);
    setCartItems((prev) =>
      prev
        .map((ci) =>
          (ci.cartItemId || String(ci.foodItem.id)) === idStr
            ? { ...ci, quantity: ci.quantity - 1 }
            : ci
        )
        .filter((ci) => ci.quantity > 0)
    );
  };

  const handleRemoveItem = (identifier: string | number) => {
    const idStr = String(identifier);
    setCartItems((prev) =>
      prev.filter((ci) => (ci.cartItemId || String(ci.foodItem.id)) !== idStr)
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderAgain = (reorderedItems: CartItem[]) => {
    for (const item of reorderedItems) {
      handleAddToCartWithCustomizations(
        item.foodItem,
        item.selectedAddOns || [],
        item.quantity
      );
    }
    setAppView('cart');
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => {
    const addonsTotal = (item.selectedAddOns || []).reduce((acc, ao) => acc + ao.price, 0);
    return sum + (item.foodItem.price + addonsTotal) * item.quantity;
  }, 0);

  // ── Checkout / order submission ────────────────────────────────────────────
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    setSubmitError(null);
    setAppView('checkout');
  };

  const handleCancelCheckout = () => {
    setSubmitError(null);
    setAppView('cart');
  };

  const handlePlaceOrder = async (request: PlaceOrderRequest) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await placeOrder(request);
      setPlacedOrder(response);
      setCartItems([]); // clear cart on success
      setPendingUpiRequest(null);
      setAppView('confirmation');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Order submission failed.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackOrder = () => {
    setAppView('tracking');
  };

  const handleBackToMenu = () => {
    setPlacedOrder(null);
    setPendingUpiRequest(null);
    setSubmitError(null);
    setAppView('menu');
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  // Show login page when not authenticated
  if (!loggedInUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-shell">
      <Header
        cartItemCount={totalCartCount}
        cartTotal={cartSubtotal}
        onCartToggle={() => setAppView('cart')}
        onNavigateMenu={() => setAppView('menu')}
        onNavigateHistory={() => setAppView('history')}
        currentView={appView}
        userEmail={loggedInUser}
        onLogout={handleLogout}
      />

      {/* ── Order History Page ──────────────────────────────── */}
      {appView === 'history' && (
        <main className="main-content">
          <OrderHistoryPage
            customerEmail={loggedInUser}
            currentFoodItems={foodItems}
            onBackToMenu={() => setAppView('menu')}
            onOrderAgain={handleOrderAgain}
          />
        </main>
      )}

      {/* ── Dedicated Cart Page ──────────────────────────────── */}
      {appView === 'cart' && (
        <main className="main-content">
          <CartPage
            items={cartItems}
            onIncreaseQuantity={handleIncreaseQuantity}
            onDecreaseQuantity={handleDecreaseQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onProceedToCheckout={handleProceedToCheckout}
            onContinueShopping={() => setAppView('menu')}
          />
        </main>
      )}

      {/* ── Checkout overlay ─────────────────────────────────── */}
      {appView === 'checkout' && (
        <Checkout
          cartItems={cartItems}
          customerEmail={loggedInUser}
          onSubmit={handlePlaceOrder}
          onProceedToUpi={(req) => {
            setPendingUpiRequest(req);
            setAppView('payment');
          }}
          onCancel={handleCancelCheckout}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}

      {/* ── UPI Demo Payment Screen ──────────────────────────── */}
      {appView === 'payment' && pendingUpiRequest && (
        <main className="main-content">
          <UpiPaymentPage
            orderRequest={pendingUpiRequest}
            cartItems={cartItems}
            subtotal={cartSubtotal}
            customerEmail={loggedInUser}
            onPaymentSuccess={(response) => {
              setPlacedOrder(response);
              setCartItems([]);
              setPendingUpiRequest(null);
              setAppView('confirmation');
            }}
            onCancel={() => {
              setAppView('checkout');
            }}
          />
        </main>
      )}

      {/* ── Order Confirmation overlay ───────────────────────── */}
      {appView === 'confirmation' && placedOrder && (
        <OrderConfirmation
          order={placedOrder}
          onTrackOrder={handleTrackOrder}
          onBackToMenu={handleBackToMenu}
          customerEmail={loggedInUser}
        />
      )}

      {/* ── Order Tracking page ──────────────────────────────── */}
      {appView === 'tracking' && placedOrder && (
        <main className="main-content">
          <OrderTracking
            orderId={placedOrder.orderId}
            onBackToMenu={handleBackToMenu}
            customerEmail={loggedInUser}
          />
        </main>
      )}

      {/* ── Main menu catalog ────────────────────────────────── */}
      {appView === 'menu' && (
        <main className="main-content">
          <div className="menu-page-container">
            {/* Menu Browsing Section */}
            <section className="menu-section" aria-label="Cafeteria Menu">
              <div className="menu-header">
                <div className="menu-title-group">
                  <h2 className="menu-heading">Menu Catalog</h2>
                  <p className="menu-subheading">
                    {selectedCategory === 'All'
                      ? 'Showing all items across categories'
                      : `Filtered by ${selectedCategory}`}
                  </p>
                </div>

                <CategoryFilter
                  categories={CATEGORIES}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => setSelectedCategory(cat)}
                  disabled={loading}
                />
              </div>

              {/* Search, Dietary, and Price Sort Control Bar */}
              <SearchFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                dietaryFilter={dietaryFilter}
                onDietaryChange={setDietaryFilter}
                sortOption={sortOption}
                onSortChange={setSortOption}
                onResetFilters={() => {
                  setSearchQuery('');
                  setDietaryFilter('ALL');
                  setSortOption('DEFAULT');
                }}
                totalFilteredCount={filteredAndSortedFoodItems.length}
                totalAvailableCount={foodItems.length}
                isFiltered={
                  searchQuery.trim().length > 0 ||
                  dietaryFilter !== 'ALL' ||
                  sortOption !== 'DEFAULT'
                }
              />

              {/* Loading State */}
              {loading && (
                <div className="loading-state" id="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading fresh food items from backend...</p>
                </div>
              )}

              {/* Error State */}
              {!loading && error && (
                <div className="error-card" id="error-message">
                  <div className="error-icon">⚠️</div>
                  <div className="error-body">
                    <h3 className="error-title">Backend Connection Issue</h3>
                    <p className="error-text">{error}</p>
                    <button
                      className="btn-retry"
                      onClick={() => loadFoodItems(selectedCategory)}
                      type="button"
                      id="retry-btn"
                    >
                      🔄 Retry Loading
                    </button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredAndSortedFoodItems.length === 0 && (
                <div className="empty-menu" id="empty-menu-state">
                  <span className="empty-menu-icon">🍽️</span>
                  <h3>No items match your filters</h3>
                  <p>
                    No food items found matching "{searchQuery}"
                    {dietaryFilter !== 'ALL' ? ` (${dietaryFilter === 'VEG' ? 'Vegetarian' : 'Non-Vegetarian'})` : ''}.
                    Try adjusting your search keywords or resetting filters.
                  </p>
                  <button
                    type="button"
                    className="btn-browse-menu"
                    onClick={() => {
                      setSearchQuery('');
                      setDietaryFilter('ALL');
                      setSortOption('DEFAULT');
                      setSelectedCategory('All');
                    }}
                    id="reset-all-filters-btn"
                  >
                    🔄 Clear All Filters
                  </button>
                </div>
              )}

              {/* Food Grid */}
              {!loading && !error && filteredAndSortedFoodItems.length > 0 && (
                <div className="food-grid" id="food-items-grid">
                  {filteredAndSortedFoodItems.map((item) => {
                    const inCartCount = cartItems
                      .filter((ci) => ci.foodItem.id === item.id)
                      .reduce((sum, ci) => sum + ci.quantity, 0);

                    return (
                      <FoodCard
                        key={item.id}
                        item={item}
                        cartQuantity={inCartCount}
                        onAddToCart={handleAddToCart}
                        onOpenDetails={(foodItem) => setSelectedDetailItem(foodItem)}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Floating Cart Indicator on Menu when items present */}
          {cartItems.length > 0 && (
            <div className="floating-cart-pill" id="floating-cart-bar">
              <div className="floating-cart-text">
                <span className="floating-cart-count">🛒 {totalCartCount} items</span>
                <span className="floating-cart-subtotal">₹{cartSubtotal.toFixed(2)}</span>
              </div>
              <button
                type="button"
                className="btn-floating-cart-action"
                onClick={() => setAppView('cart')}
                id="floating-view-cart-btn"
              >
                View Cart →
              </button>
            </div>
          )}
        </main>
      )}

      {/* ── Food Customization & Detail Modal ─────────────────── */}
      {selectedDetailItem && (
        <FoodDetailModal
          item={selectedDetailItem}
          currentCartQuantity={cartItems
            .filter((ci) => ci.foodItem.id === selectedDetailItem.id)
            .reduce((sum, ci) => sum + ci.quantity, 0)}
          onClose={() => setSelectedDetailItem(null)}
          onAddToCart={(item, addOns, qty) => {
            handleAddToCartWithCustomizations(item, addOns, qty);
            setSelectedDetailItem(null);
          }}
        />
      )}

      <footer className="site-footer">
        <p>Cafeteria Food Ordering System &bull; Design Patterns Demonstration</p>
      </footer>
    </div>
  );
};

export default App;
