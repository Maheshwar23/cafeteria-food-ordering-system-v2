import React from 'react';

interface HeaderProps {
  cartItemCount: number;
  cartTotal?: number;
  onCartToggle?: () => void;
  isCartOpen?: boolean;
  onNavigateMenu?: () => void;
  currentView?: string;
  /** Email of the currently signed-in user; omit when no session exists. */
  userEmail?: string;
  /** Called when the user clicks the Logout button. */
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  cartTotal,
  onCartToggle,
  isCartOpen = false,
  onNavigateMenu,
  currentView,
  userEmail,
  onLogout,
}) => {
  const isCartActive = currentView === 'cart';

  return (
    <header className="site-header" id="site-header">
      <div className="header-container">
        <div
          className="brand-group clickable-brand"
          onClick={onNavigateMenu}
          role={onNavigateMenu ? 'button' : undefined}
          tabIndex={onNavigateMenu ? 0 : undefined}
          onKeyDown={(e) => {
            if (onNavigateMenu && (e.key === 'Enter' || e.key === ' ')) {
              onNavigateMenu();
            }
          }}
          title="Return to Menu Catalog"
        >
          <div className="brand-icon">🍽️</div>
          <div>
            <h1 className="brand-title">Cafeteria Express</h1>
            <p className="brand-subtitle">Fresh &amp; Delicious Campus Meals</p>
          </div>
        </div>

        <div className="header-actions">
          <span className="api-badge" title="Connected to Spring Boot backend">
            <span className="api-dot"></span>
            Backend API Active
          </span>

          {/* Show user greeting + logout when a session is active */}
          {userEmail && (
            <div className="header-user-group">
              <span className="header-user-greeting" id="header-user-greeting">
                👤 {userEmail}
              </span>
              <button
                className="header-logout-btn"
                onClick={onLogout}
                type="button"
                id="header-logout-btn"
                aria-label="Sign out"
              >
                Sign Out
              </button>
            </div>
          )}

          <button
            className={`mobile-cart-toggle header-cart-btn ${isCartActive ? 'active' : ''}`}
            onClick={onCartToggle}
            aria-label="View shopping cart"
            aria-expanded={isCartOpen || isCartActive}
            id="mobile-cart-toggle-btn"
          >
            🛒 Cart ({cartItemCount})
            {typeof cartTotal === 'number' && cartTotal > 0 ? ` • ₹${cartTotal.toFixed(2)}` : ''}
          </button>
        </div>
      </div>
    </header>
  );
};
