import React, { useState } from 'react';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
}

/** Very basic email-format check – intentionally lenient for a demo. */
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    // Simulate an async "sign-in" for the college demo.
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email.trim());
    }, 800);
  };

  return (
    <div className="login-page" id="login-page">
      {/* Decorative background blobs */}
      <div className="login-bg-blob login-bg-blob--1" aria-hidden="true" />
      <div className="login-bg-blob login-bg-blob--2" aria-hidden="true" />

      <div className="login-card" role="main">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand-icon" aria-hidden="true">🍽️</div>
          <h1 className="login-brand-name">Cafeteria Express</h1>
          <p className="login-brand-tagline">Fresh &amp; Delicious Campus Meals</p>
        </div>

        {/* Heading */}
        <div className="login-heading-group">
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Sign in to start ordering your favourite campus meals.</p>
        </div>

        {/* Form */}
        <form
          id="login-form"
          className="login-form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Sign-in form"
        >
          {/* Email */}
          <div className={`login-field${errors.email ? ' login-field--error' : ''}`}>
            <label className="login-label" htmlFor="login-email">
              Email address
            </label>
            <div className="login-input-wrapper">
              <span className="login-input-icon" aria-hidden="true">✉️</span>
              <input
                id="login-email"
                type="email"
                className="login-input"
                placeholder="you@college.edu"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <span id="login-email-error" className="login-field-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className={`login-field${errors.password ? ' login-field--error' : ''}`}>
            <label className="login-label" htmlFor="login-password">
              Password
            </label>
            <div className="login-input-wrapper">
              <span className="login-input-icon" aria-hidden="true">🔒</span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="login-input login-input--with-toggle"
                placeholder="Min. 6 characters"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
                disabled={isLoading}
              />
              <button
                type="button"
                id="toggle-password-visibility"
                className="login-pw-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={0}
                disabled={isLoading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <span id="login-password-error" className="login-field-error" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          {/* General error */}
          {errors.general && (
            <div id="login-general-error" className="login-general-error" role="alert">
              ⚠️ {errors.general}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            id="login-submit-btn"
            className={`login-submit-btn${isLoading ? ' login-submit-btn--loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="login-spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo hint */}
        <p className="login-demo-hint">
          🎓 <strong>Demo mode:</strong> Enter any valid email &amp; password (6+ chars) to sign in.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
