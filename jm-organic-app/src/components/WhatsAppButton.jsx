
import React from 'react';
 
// TODO: replace with the real business WhatsApp number, country code
// first, digits only — no +, no spaces, no dashes.
// India example: 91 followed by the 10-digit number, e.g. '919876543210'
// Best practice: pull from an env var so it's not hardcoded in source —
// add REACT_APP_WHATSAPP_NUMBER to your frontend .env file.
const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER; // default to a placeholder number if not set
 
const DEFAULT_MESSAGE =
  "Hi! I'm interested in JM Organic products. Can you help me?";
 
const WhatsAppButton = () => {
  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    DEFAULT_MESSAGE
  )}`;
 
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:scale-105 active:scale-95 transition-transform"
    >
      {/* Inline WhatsApp glyph — no icon library ships an authentic one */}
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="white">
        <path d="M16.001 3C9.373 3 4 8.373 4 15.001c0 2.386.669 4.61 1.828 6.507L4 29l7.671-1.79A11.94 11.94 0 0 0 16 27c6.628 0 12-5.373 12-11.999C28 8.373 22.628 3 16.001 3zm0 21.818c-1.964 0-3.79-.55-5.35-1.502l-.384-.228-4.55 1.062 1.09-4.435-.25-.396A9.77 9.77 0 0 1 5.182 15c0-5.965 4.854-10.818 10.819-10.818S26.818 9.036 26.818 15 21.965 24.818 16.001 24.818zm5.68-8.155c-.31-.156-1.833-.905-2.117-1.008-.284-.104-.49-.156-.697.155-.207.312-.799 1.008-.98 1.216-.18.208-.362.234-.671.078-.31-.156-1.309-.483-2.494-1.54-.922-.822-1.545-1.837-1.727-2.148-.181-.312-.02-.48.136-.635.14-.14.31-.363.465-.545.155-.182.207-.312.31-.52.104-.208.052-.39-.026-.546-.078-.156-.697-1.68-.955-2.301-.252-.606-.508-.524-.697-.534-.181-.008-.388-.01-.595-.01-.207 0-.543.078-.828.39-.284.312-1.086 1.062-1.086 2.59s1.112 3.005 1.267 3.213c.155.208 2.19 3.345 5.307 4.69.742.32 1.32.512 1.772.655.744.237 1.42.203 1.955.123.596-.089 1.833-.75 2.093-1.474.259-.723.259-1.343.181-1.474-.077-.13-.284-.208-.594-.364z" />
      </svg>
    </a>
  );
};
 
export default WhatsAppButton;