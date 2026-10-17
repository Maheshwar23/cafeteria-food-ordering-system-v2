import { PlaceOrderResponse, OrderResponse, OrderItemResponse } from '../types/food';

/**
 * Normalized data structure for generating the cafeteria invoice.
 */
export interface NormalizedInvoiceData {
  orderId: number;
  finalPrice: number;
  status: string;
  transactionId?: string | null;
  address?: string | null;
  specialInstructions?: string | null;
  deliveryOption?: string | null;
  paymentOption?: string | null;
  items: OrderItemResponse[];
  createdAt?: string | null;
}

/**
 * Converts either PlaceOrderResponse or OrderResponse into NormalizedInvoiceData.
 */
export function normalizeInvoiceData(
  order: PlaceOrderResponse | OrderResponse
): NormalizedInvoiceData {
  if ('orderId' in order) {
    return {
      orderId: order.orderId,
      finalPrice: order.finalPrice,
      status: order.status,
      transactionId: order.transactionId,
      address: order.address,
      deliveryOption: order.deliveryOption,
      paymentOption: order.paymentOption,
      items: order.items ?? [],
    };
  }

  return {
    orderId: order.id,
    finalPrice: order.totalAmount,
    status: order.status,
    transactionId: null,
    address: order.address,
    specialInstructions: order.specialInstructions,
    deliveryOption: order.deliveryOption,
    paymentOption: order.paymentOption,
    items: order.items ?? [],
    createdAt: order.createdAt,
  };
}

/**
 * Format string labels cleanly (e.g. DINE_IN -> Dine-In).
 */
function formatLabel(raw: string | null | undefined): string {
  if (!raw) return '—';
  if (raw.toLowerCase().includes('cash')) return 'Cash (MockPay)';
  return raw
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Formats genuine payment method details without inventing fake status.
 */
function getPaymentInfo(data: NormalizedInvoiceData): { method: string; status: string } {
  let method = 'Not Specified';
  const rawMethod = data.paymentOption;

  if (rawMethod) {
    if (rawMethod.toLowerCase().includes('cash')) {
      method = 'Cash Payment';
    } else if (rawMethod.toUpperCase() === 'CARD') {
      method = 'Credit / Debit Card';
    } else if (rawMethod.toUpperCase() === 'UPI') {
      method = 'UPI (Simulated Demo Payment)';
    } else {
      method = formatLabel(rawMethod);
    }
  }

  // Determine genuine status
  let status = 'Not Verified';
  if (data.transactionId) {
    if (rawMethod && rawMethod.toUpperCase() === 'UPI') {
      status = `Simulated Payment Approved (Demo Ref: ${data.transactionId})`;
    } else {
      status = `Processed & Approved (Txn ID: ${data.transactionId})`;
    }
  } else if (rawMethod && rawMethod.toLowerCase().includes('cash')) {
    status = 'Pay at Counter / Upon Delivery';
  } else if (rawMethod) {
    status = `Recorded (${method})`;
  }

  return { method, status };
}

/**
 * Generates a complete, self-contained HTML document for the invoice/receipt.
 */
export function generateInvoiceHtml(
  rawOrder: PlaceOrderResponse | OrderResponse,
  customerEmail?: string | null
): string {
  const data = normalizeInvoiceData(rawOrder);
  const itemsSubtotal = (data.items ?? []).reduce(
    (sum, item) => sum + (item.subtotal || item.unitPrice * item.quantity),
    0
  );
  const discount = itemsSubtotal - data.finalPrice;
  const paymentInfo = getPaymentInfo(data);

  const orderDate = data.createdAt ? new Date(data.createdAt) : new Date();
  const formattedDate = orderDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const invoiceNumber = `INV-${String(data.orderId).padStart(5, '0')}`;
  const pdfTitle = `cafeteria-invoice-${data.orderId}.pdf`;

  const itemRowsHtml = (data.items ?? [])
    .map((item, idx) => {
      const lineTotal = item.subtotal || item.unitPrice * item.quantity;
      return `
        <tr>
          <td class="col-num">${idx + 1}</td>
          <td class="col-desc">
            <div class="item-name">${item.foodName}</div>
            <div class="item-cat">${formatLabel(item.foodCategory)}</div>
          </td>
          <td class="col-qty">× ${item.quantity}</td>
          <td class="col-price">₹${item.unitPrice.toFixed(2)}</td>
          <td class="col-total">₹${lineTotal.toFixed(2)}</td>
        </tr>
      `;
    })
    .join('');

  const discountRowHtml =
    discount > 0.005
      ? `
        <tr class="summary-row discount-row">
          <td colspan="4" class="text-right">Discount Applied:</td>
          <td class="col-total discount-val">−₹${discount.toFixed(2)}</td>
        </tr>
      `
      : '';

  const customerDisplay = customerEmail && customerEmail.trim()
    ? customerEmail.trim()
    : 'Campus Student / Guest';

  const addressRowHtml = data.address
    ? `
      <div class="meta-item">
        <span class="meta-label">Delivery Address:</span>
        <span class="meta-value">${data.address}</span>
      </div>
    `
    : '';

  const instructionsRowHtml = data.specialInstructions
    ? `
      <div class="meta-item">
        <span class="meta-label">Special Instructions:</span>
        <span class="meta-value">${data.specialInstructions}</span>
      </div>
    `
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pdfTitle}</title>
  <style>
    /* CSS Reset & Base */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      background: #f8fafc;
      padding: 2rem 1rem;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    /* Action bar at the top (hidden during printing) */
    .action-bar {
      max-width: 780px;
      margin: 0 auto 1.5rem auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
      padding: 0.875rem 1.25rem;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .action-bar-title {
      font-weight: 700;
      font-size: 0.9375rem;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .action-btn-group {
      display: flex;
      gap: 0.75rem;
    }

    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
      border: none;
    }

    .btn-action-primary {
      background: #ea580c;
      color: #ffffff;
    }

    .btn-action-primary:hover {
      background: #c2410c;
    }

    .btn-action-secondary {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
    }

    .btn-action-secondary:hover {
      background: #e2e8f0;
    }

    /* Invoice container */
    .invoice-wrapper {
      max-width: 780px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }

    /* Top Accent Stripe */
    .top-accent-stripe {
      height: 6px;
      background: linear-gradient(90deg, #ea580c 0%, #f97316 50%, #fb923c 100%);
    }

    .invoice-content {
      padding: 2.5rem;
    }

    /* Header */
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #f1f5f9;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .brand-logo-icon {
      font-size: 2.25rem;
      width: 58px;
      height: 58px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff7ed;
      border: 1.5px solid #fed7aa;
      border-radius: 14px;
    }

    .brand-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }

    .brand-subtitle {
      font-size: 0.8125rem;
      color: #64748b;
      margin-top: 0.25rem;
    }

    .invoice-badge-block {
      text-align: right;
    }

    .doc-type-badge {
      display: inline-block;
      background: #fff7ed;
      color: #c2410c;
      border: 1px solid #fdba74;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .doc-id-number {
      font-size: 1.25rem;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0.375rem;
    }

    .doc-date-text {
      font-size: 0.8125rem;
      color: #64748b;
      margin-top: 0.2rem;
    }

    /* Metadata Grid */
    .meta-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 2rem;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }

    .meta-column {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      font-size: 0.875rem;
    }

    .meta-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .meta-value {
      font-weight: 600;
      color: #0f172a;
      margin-top: 0.125rem;
    }

    .meta-badge {
      display: inline-block;
      align-self: flex-start;
      padding: 0.15rem 0.6rem;
      background: #e0f2fe;
      color: #0369a1;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 700;
      margin-top: 0.2rem;
    }

    .meta-badge-status {
      background: #dcfce7;
      color: #15803d;
    }

    /* Items Table */
    .items-section-title {
      font-size: 0.9375rem;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      margin-bottom: 0.75rem;
    }

    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.75rem;
    }

    .invoice-table th {
      background: #f1f5f9;
      color: #475569;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 0.75rem 1rem;
      text-align: left;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #cbd5e1;
    }

    .invoice-table td {
      padding: 0.875rem 1rem;
      border-bottom: 1px solid #f1f5f9;
      font-size: 0.875rem;
      vertical-align: middle;
    }

    .invoice-table tbody tr:nth-child(even) {
      background: #fafafa;
    }

    .col-num {
      width: 5%;
      color: #94a3b8;
      font-weight: 600;
    }

    .col-desc {
      width: 45%;
    }

    .item-name {
      font-weight: 700;
      color: #0f172a;
    }

    .item-cat {
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 0.125rem;
    }

    .col-qty {
      width: 12%;
      font-weight: 600;
      color: #334155;
      text-align: center;
    }

    .col-price {
      width: 18%;
      text-align: right;
      color: #475569;
    }

    .col-total {
      width: 20%;
      text-align: right;
      font-weight: 700;
      color: #0f172a;
    }

    .text-right {
      text-align: right;
      font-weight: 600;
      color: #475569;
    }

    /* Summary Totals */
    .summary-row td {
      padding: 0.75rem 1rem;
      border-bottom: none;
    }

    .subtotal-row td {
      border-top: 2px solid #e2e8f0;
    }

    .discount-row {
      color: #16a34a;
    }

    .discount-row td {
      color: #16a34a;
      font-weight: 600;
    }

    .discount-val {
      color: #16a34a !important;
      font-weight: 700;
    }

    .grand-total-row {
      background: #fff7ed !important;
      border-top: 2px solid #fdba74;
      border-bottom: 2px solid #fdba74 !important;
    }

    .grand-total-label {
      text-align: right;
      font-size: 1.0625rem;
      font-weight: 800;
      color: #9a3412;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .grand-total-val {
      text-align: right;
      font-size: 1.25rem;
      font-weight: 900;
      color: #c2410c;
    }

    /* Footer */
    .invoice-footer {
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px dashed #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      color: #64748b;
    }

    .footer-note {
      line-height: 1.6;
    }

    .footer-tag {
      font-weight: 700;
      color: #ea580c;
    }

    /* Print Stylesheet */
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
        color: #0f172a !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .action-bar {
        display: none !important;
      }

      .invoice-wrapper {
        box-shadow: none !important;
        border: none !important;
        max-width: 100% !important;
        border-radius: 0 !important;
      }

      .invoice-content {
        padding: 1.5rem 1rem !important;
      }

      .invoice-table tr {
        page-break-inside: avoid !important;
      }

      @page {
        size: auto;
        margin: 12mm 15mm 15mm 15mm;
      }
    }
  </style>
</head>
<body>
  <!-- Floating Action Bar for direct browser view -->
  <div class="action-bar no-print">
    <div class="action-bar-title">
      <span>📄</span>
      <span>Receipt Preview: ${invoiceNumber}</span>
    </div>
    <div class="action-btn-group">
      <button type="button" class="btn-action btn-action-primary" onclick="window.print()">
        🖨️ Print / Save as PDF
      </button>
      <button type="button" class="btn-action btn-action-secondary" onclick="window.close()">
        ✕ Close
      </button>
    </div>
  </div>

  <div class="invoice-wrapper">
    <div class="top-accent-stripe"></div>
    <div class="invoice-content">
      <!-- Header -->
      <header class="invoice-header">
        <div class="brand-group">
          <div class="brand-logo-icon">🍔</div>
          <div>
            <h1 class="brand-title">CAMPUS CAFETERIA</h1>
            <p class="brand-subtitle">Student Center • University Food Services</p>
          </div>
        </div>
        <div class="invoice-badge-block">
          <span class="doc-type-badge">Official Order Receipt</span>
          <div class="doc-id-number">#${data.orderId}</div>
          <div class="doc-date-text">${formattedDate}</div>
        </div>
      </header>

      <!-- Meta Grid -->
      <section class="meta-card">
        <div class="meta-column">
          <div class="meta-item">
            <span class="meta-label">Customer Account</span>
            <span class="meta-value">${customerDisplay}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Order Type</span>
            <span class="meta-badge">${formatLabel(data.deliveryOption)}</span>
          </div>
          ${addressRowHtml}
          ${instructionsRowHtml}
        </div>

        <div class="meta-column">
          <div class="meta-item">
            <span class="meta-label">Order Status</span>
            <span class="meta-badge meta-badge-status">${formatLabel(data.status)}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Payment Method</span>
            <span class="meta-value">${paymentInfo.method}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Payment Status</span>
            <span class="meta-value">${paymentInfo.status}</span>
          </div>
        </div>
      </section>

      <!-- Items Section -->
      <div class="items-section-title">Order Items & Breakdown</div>
      <table class="invoice-table">
        <thead>
          <tr>
            <th class="col-num">#</th>
            <th class="col-desc">Item Description</th>
            <th class="col-qty">Quantity</th>
            <th class="col-price">Unit Price</th>
            <th class="col-total">Line Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRowsHtml}
        </tbody>
        <tfoot>
          <tr class="summary-row subtotal-row">
            <td colspan="4" class="text-right">Items Subtotal:</td>
            <td class="col-total">₹${itemsSubtotal.toFixed(2)}</td>
          </tr>
          ${discountRowHtml}
          <tr class="summary-row grand-total-row">
            <td colspan="4" class="grand-total-label">Final Total Due:</td>
            <td class="grand-total-val">₹${data.finalPrice.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <!-- Footer -->
      <footer class="invoice-footer">
        <div class="footer-note">
          <div><strong class="footer-tag">Thank you for dining with us!</strong> Please retain this receipt.</div>
          <div>Present Order <strong>#${data.orderId}</strong> at the pickup counter for quick collection.</div>
        </div>
        <div style="text-align: right; font-size: 0.6875rem; color: #94a3b8;">
          <div>Electronically Generated Tax Receipt</div>
          <div>Campus Cafeteria v2.0</div>
        </div>
      </footer>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Triggers the browser print dialog using an isolated iframe so the user
 * can save the invoice as a PDF with the filename `cafeteria-invoice-${orderId}.pdf`.
 */
export function printInvoice(
  rawOrder: PlaceOrderResponse | OrderResponse,
  customerEmail?: string | null
): void {
  const data = normalizeInvoiceData(rawOrder);
  const html = generateInvoiceHtml(rawOrder, customerEmail);
  const fileName = `cafeteria-invoice-${data.orderId}.pdf`;

  // Remove any previously injected print iframe
  const existingFrame = document.getElementById('print-invoice-frame');
  if (existingFrame) {
    existingFrame.remove();
  }

  // Create isolated invisible iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'print-invoice-frame';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    // Fallback: window.open popup
    fallbackPrintWindow(html, fileName);
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  const originalDocTitle = document.title;

  setTimeout(() => {
    try {
      document.title = fileName;
      if (iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } else {
        fallbackPrintWindow(html, fileName);
      }
    } catch (err) {
      console.warn('Iframe print failed, falling back to window.open:', err);
      fallbackPrintWindow(html, fileName);
    } finally {
      setTimeout(() => {
        document.title = originalDocTitle;
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 3000);
    }
  }, 300);
}

/**
 * Fallback to open a clean printable window if iframe print is blocked by browser restrictions.
 */
function fallbackPrintWindow(html: string, fileName: string): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.document.title = fileName;
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);
  }
}

/**
 * Utility to directly download the HTML receipt as a file (backup / offline viewer).
 */
export function downloadInvoiceHtmlFile(
  rawOrder: PlaceOrderResponse | OrderResponse,
  customerEmail?: string | null
): void {
  const data = normalizeInvoiceData(rawOrder);
  const html = generateInvoiceHtml(rawOrder, customerEmail);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cafeteria-invoice-${data.orderId}.html`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    if (document.body.contains(a)) {
      document.body.removeChild(a);
    }
    URL.revokeObjectURL(url);
  }, 200);
}
