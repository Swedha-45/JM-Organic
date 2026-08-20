// utils/loadRazorpay.js
// Loads Razorpay's checkout.js on demand instead of requiring a
// <script> tag in index.html — one less file to edit, and it only
// loads for people actually reaching checkout.
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};