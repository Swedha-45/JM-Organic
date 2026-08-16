import React, { useEffect, useRef } from 'react';
import { googleClientId, auth } from '../firebase/firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

const GoogleSignIn = ({ onSuccess, onError, text = "signin_with", disabled = false }) => {
  const buttonRef = useRef(null);

  // Store callbacks in refs to avoid useEffect dependency churn
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    let isMounted = true;

    const handleCredentialResponse = async (response) => {
      if (response.credential) {
        try {
          const credential = GoogleAuthProvider.credential(response.credential);
          const userCredential = await signInWithCredential(auth, credential);
          const firebaseIdToken = await userCredential.user.getIdToken();

          if (onSuccessRef.current) {
            onSuccessRef.current({
              token: firebaseIdToken,
              user: userCredential.user,
            });
          }
        } catch (error) {
          console.error('Firebase Auth exchange error:', error);
          if (onErrorRef.current) onErrorRef.current(error);
        }
      } else {
        if (onErrorRef.current) onErrorRef.current(new Error('No credential received'));
      }
    };

    const initAndRender = () => {
      if (!window.google?.accounts?.id || !isMounted) return;

      if (!window._gsiInitialized) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        window._gsiInitialized = true;
      }

      // Render button
      if (buttonRef.current && !disabled) {
        buttonRef.current.innerHTML = ''; // Clear previous button elements
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: text,
          shape: 'circle',
          width: 250,
          logo_alignment: 'left',
        });
      }
    };

    // Load GSI script if not present
    if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initAndRender;
      script.onerror = (err) => onErrorRef.current?.(err);
      document.body.appendChild(script);
    } else if (window.google?.accounts?.id) {
      initAndRender();
    } else {
      const checkGoogleInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkGoogleInterval);
          initAndRender();
        }
      }, 100);
      return () => clearInterval(checkGoogleInterval);
    }

    return () => {
      isMounted = false;
    };
  }, [disabled, text]); // Clean dependencies

  return (
    <div 
      ref={buttonRef} 
      style={{ 
        display: 'flex', 
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        minHeight: '40px'
      }}
    />
  );
};

export default GoogleSignIn;