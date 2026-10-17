import React, { useState, useEffect, useCallback } from 'react';
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
type AppView = 'menu' | 'cart' | 'checkout' | 'payment' | 'confirmation' | 'tracking';

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
    setAppView('menu');
  };

  // ── Menu / cart state ──────────────────────────────────────────────────────
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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

  // ── Cart operations ────────────────────────────────────────────────────────
  const handleAddToCart = (item: FoodItem) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.foodItem.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.foodItem.id === item.id
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      }
      return [...prev, { foodItem: item, quantity: 1 }];
    });
  };

  const handleIncreaseQuantity = (foodItemId: number) => {
    setCartItems((prev) =>
      prev.map((ci) =>
        ci.foodItem.id === foodItemId
          ? { ...ci, quantity: ci.quantity + 1 }
          : ci
      )
    );
  };

  const handleDecreaseQuantity = (foodItemId: number) => {
    setCartItems((prev) =>
      prev
        .map((ci) =>
          ci.foodItem.id === foodItemId
            ? { ...ci, quantity: ci.quantity - 1 }
            : ci
        )
        .filter((ci) => ci.quantity > 0)
    );
  };

  const handleRemoveItem = (foodItemId: number) => {
    setCartItems((prev) => prev.filter((ci) => ci.foodItem.id !== foodItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.foodItem.price * item.quantity,
    0
  );

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
        currentView={appView}
        userEmail={loggedInUser}
        onLogout={handleLogout}
      />

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
              {!loading && !error && foodItems.length === 0 && (
                <div className="empty-menu" id="empty-menu-state">
                  <span className="empty-menu-icon">🍽️</span>
                  <h3>No items found</h3>
                  <p>No food items currently available in category "{selectedCategory}".</p>
                </div>
              )}

              {/* Food Grid */}
              {!loading && !error && foodItems.length > 0 && (
                <div className="food-grid" id="food-items-grid">
                  {foodItems.map((item) => {
                    const inCart = cartItems.find((ci) => ci.foodItem.id === item.id);
                    return (
                      <FoodCard
                        key={item.id}
                        item={item}
                        cartQuantity={inCart ? inCart.quantity : 0}
                        onAddToCart={handleAddToCart}
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

      <footer className="site-footer">
        <p>Cafeteria Food Ordering System &bull; Design Patterns Demonstration</p>
      </footer>
    </div>
  );
};

export default App;
