import React from 'react';

interface HeaderProps {
  cartItemCount: number;
  onCartToggle?: () => void;
  isCartOpen?: boolean;
  /** Email of the currently signed-in user; omit when no session exists. */
  userEmail?: string;
  /** Called when the user clicks the Logout button. */
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  onCartToggle,
  isCartOpen = false,
  userEmail,
  onLogout,
}) => {
  return (
    <header className="site-header" id="site-header">
      <div className="header-container">
        <div className="brand-group">
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
            className="mobile-cart-toggle"
            onClick={onCartToggle}
            aria-label="Toggle cart"
            aria-expanded={isCartOpen}
            id="mobile-cart-toggle-btn"
          >
            🛒 Cart ({cartItemCount})
          </button>
        </div>
      </div>
    </header>
  );
};
