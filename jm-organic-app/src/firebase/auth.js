// firebase/auth.js
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithCredential
} from 'firebase/auth';
import { auth } from './firebase';

const googleProvider = new GoogleAuthProvider();

// Email/Password sign in
export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Email/Password sign in error:', error);
    throw error;
  }
};

// Email/Password sign up
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

// Send email verification
export const doSendEmailVerification = async (user) => {
  try {
    await sendEmailVerification(user);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Send email verification error:', error);
    throw error;
  }
};

// Google sign in with Firebase Auth popup
export const doSignInWithGoogle = async () => {
  try {
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

// Sign out
export const doSignOut = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};