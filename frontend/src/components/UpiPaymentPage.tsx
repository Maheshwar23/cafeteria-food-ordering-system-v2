import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { PlaceOrderRequest, PlaceOrderResponse, CartItem } from '../types/food';
import { placeOrder } from '../services/api';

interface UpiPaymentPageProps {
  orderRequest: PlaceOrderRequest;
  cartItems: CartItem[];
  subtotal: number;
  customerEmail?: string | null;
  onPaymentSuccess: (response: PlaceOrderResponse) => void;
  onCancel: () => void;
}

function computeEstimatedDiscount(subtotal: number, strategy: string): number {
  if (strategy === 'PERCENTAGE:10') return subtotal * 0.10;
  if (strategy === 'FIXED:50') return Math.min(subtotal, 50);
  return 0;
}

function formatDiscountLabel(strategy: string): string {
  if (strategy === 'PERCENTAGE:10') return '10% Student Discount';
  if (strategy === 'FIXED:50') return '₹50 Off Coupon';
  return 'None';
}

function formatDeliveryLabel(option: string): string {
  if (option === 'DINE_IN') return 'Dine-In';
  if (option === 'TAKEAWAY') return 'Takeaway';
  if (option === 'DELIVERY') return 'Campus Delivery';
  return option;
}

export const UpiPaymentPage: React.FC<UpiPaymentPageProps> = ({
  orderRequest,
  cartItems,
  subtotal,
  customerEmail,
  onPaymentSuccess,
  onCancel,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [simulationError, setSimulationError] = useState<string | null>(null);
  const [simulationSuccess, setSimulationSuccess] = useState<string | null>(null);

  const discountAmount = computeEstimatedDiscount(subtotal, orderRequest.discountStrategy);
  const finalPayable = Math.max(0, subtotal - discountAmount);

  // Generate a non-financial, genuine scannable QR containing identifiable demo payload
  useEffect(() => {
    const demoPayload = JSON.stringify(
      {
        app: 'CAMPUS_CAFETERIA_V2',
        demoMarker: 'ACADEMIC_SIMULATION_ONLY',
        note: 'Demonstration artifact. Not a payable UPI QR. Do NOT send real funds.',
        payableAmount: `INR ${finalPayable.toFixed(2)}`,
        itemsCount: cartItems.reduce((sum, it) => sum + it.quantity, 0),
        deliveryOption: orderRequest.deliveryOption,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    );

    QRCode.toDataURL(demoPayload, {
      width: 256,
      margin: 2,
      color: {
        dark: '#1e293b',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));
  }, [finalPayable, cartItems, orderRequest.deliveryOption]);

  const handleSimulatePayment = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setSimulationError(null);
    setSimulationSuccess(null);
    setProcessingStatus('Connecting to simulated UPI switch (QuickPayAdapter)…');

    try {
      // Step 1: Simulated network handshake
      await new Promise((res) => setTimeout(res, 600));
      setProcessingStatus('Authorizing mock UPI payment with campus payment gateway…');
      await new Promise((res) => setTimeout(res, 500));

      // Step 2: Invoke authoritative backend order creation endpoint
      const response = await placeOrder(orderRequest);

      // Step 3: Success feedback
      setProcessingStatus('Payment authorized! Order registered successfully.');
      setSimulationSuccess(
        `✅ Demo UPI Payment Successful! Order #${response.orderId} placed (Auth Ref: ${response.transactionId || 'SIM-UPI-OK'}).`
      );

      // Transition to Confirmation after brief visible confirmation
      setTimeout(() => {
        onPaymentSuccess(response);
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Simulated payment transaction failed.';
      setSimulationError(msg);
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleSimulateFailure = () => {
    if (isProcessing) return;
    setSimulationSuccess(null);
    setSimulationError(
      'Demo Simulation: UPI transaction declined by user bank or timed out (Mock UPI Error). No order was created.'
    );
  };

  return (
    <div className="upi-page-container" id="upi-payment-page">
      <div className="upi-page-panel">
        {/* Header / Brand */}
        <div className="upi-header">
          <div className="upi-brand-row">
            <span className="upi-brand-icon">🍽️</span>
            <div>
              <h1 className="upi-brand-name">CAMPUS CAFETERIA</h1>
              <p className="upi-brand-sub">Express Food Court • UPI Checkout Simulation</p>
            </div>
          </div>

          <div className="upi-demo-badge" id="upi-demo-badge">
            <span className="demo-dot" />
            DEMO PAYMENT FLOW
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="upi-safety-banner" id="upi-safety-banner" role="alert">
          <div className="safety-icon">⚠️</div>
          <div className="safety-content">
            <strong>Demonstration Simulation Only:</strong> This is a college project showcase.
            No money will be deducted or transferred. Do NOT scan with a real banking app to send funds.
            Click the simulation button below to complete the test flow.
          </div>
        </div>

        {/* Main Content Grid: QR Card (Left) + Order Breakdown (Right) */}
        <div className="upi-content-grid">
          {/* QR Code Presentation Card */}
          <div className="upi-qr-card" id="upi-qr-card">
            <div className="qr-card-header">
              <span className="qr-upi-logo">📱 BHIM / UPI QR</span>
              <span className="qr-amount-pill" id="qr-display-amount">
                ₹{finalPayable.toFixed(2)}
              </span>
            </div>

            <div className="qr-canvas-box">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Simulated UPI Demo QR Code"
                  className="qr-image"
                  id="upi-qr-image"
                />
              ) : (
                <div className="qr-placeholder">
                  <div className="spinner-sm" />
                  <span>Generating Demo QR…</span>
                </div>
              )}
            </div>

            <div className="qr-card-footer">
              <div className="qr-payload-note">
                🔍 Scannable demo payload: Contains simulation metadata &amp; amount.
              </div>
              <div className="qr-supported-badges">
                <span>Google Pay</span> &bull; <span>PhonePe</span> &bull; <span>Paytm</span> &bull; <span>BHIM</span>
              </div>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="upi-order-details-card">
            <h3 className="upi-details-title">Order Breakdown</h3>

            <div className="upi-items-mini-list" id="upi-items-list">
              {cartItems.map((ci) => {
                const key = ci.cartItemId || ci.foodItem.id;
                const addonsTotal = (ci.selectedAddOns || []).reduce((acc, ao) => acc + ao.price, 0);
                const lineTotal = (ci.foodItem.price + addonsTotal) * ci.quantity;

                return (
                  <div key={key} className="upi-mini-item-row">
                    <div className="upi-mini-item-name-group">
                      <span className="upi-mini-item-name">
                        {ci.quantity} × {ci.foodItem.name}
                      </span>
                      {ci.selectedAddOns && ci.selectedAddOns.length > 0 && (
                        <span className="upi-item-addon-tag">
                          (+ {ci.selectedAddOns.map((ao) => ao.name).join(', ')})
                        </span>
                      )}
                    </div>
                    <span className="upi-mini-item-subtotal">
                      ₹{lineTotal.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="upi-pricing-summary">
              <div className="upi-price-row">
                <span>Items Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0.005 && (
                <div className="upi-price-row discount-row">
                  <span>Discount ({formatDiscountLabel(orderRequest.discountStrategy)}):</span>
                  <span className="discount-amount">−₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="upi-price-row upi-total-row">
                <span className="upi-total-label">Payable Amount:</span>
                <span className="upi-total-val" id="upi-payable-amount">
                  ₹{finalPayable.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Customer & Delivery Context */}
            <div className="upi-meta-box">
              <div className="upi-meta-line">
                <span className="meta-lbl">Account:</span>
                <span className="meta-val">{customerEmail || 'Guest Student'}</span>
              </div>
              <div className="upi-meta-line">
                <span className="meta-lbl">Delivery:</span>
                <span className="meta-val">{formatDeliveryLabel(orderRequest.deliveryOption)}</span>
              </div>
              {orderRequest.address && (
                <div className="upi-meta-line">
                  <span className="meta-lbl">Address:</span>
                  <span className="meta-val">{orderRequest.address}</span>
                </div>
              )}
            </div>

            {/* Processing and Feedback Alerts */}
            {isProcessing && (
              <div className="upi-processing-alert" id="upi-processing-alert">
                <div className="spinner-sm" />
                <span>{processingStatus}</span>
              </div>
            )}

            {simulationSuccess && (
              <div className="upi-success-alert" id="upi-success-alert" role="status">
                {simulationSuccess}
              </div>
            )}

            {simulationError && (
              <div className="upi-error-alert" id="upi-error-alert" role="alert">
                <span>❌ {simulationError}</span>
              </div>
            )}

            {/* Actions */}
            <div className="upi-actions-stack">
              <button
                type="button"
                className="btn-simulate-success"
                onClick={handleSimulatePayment}
                disabled={isProcessing || !!simulationSuccess}
                id="simulate-upi-success-btn"
              >
                {isProcessing
                  ? 'Processing Simulation…'
                  : '✅ Simulate Successful Payment'}
              </button>

              <button
                type="button"
                className="btn-simulate-failure"
                onClick={handleSimulateFailure}
                disabled={isProcessing || !!simulationSuccess}
                id="simulate-upi-fail-btn"
              >
                ⚠️ Simulate Payment Failure (Demo)
              </button>

              <button
                type="button"
                className="btn-cancel-payment"
                onClick={onCancel}
                disabled={isProcessing}
                id="cancel-payment-btn"
              >
                ← Cancel &amp; Return to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
