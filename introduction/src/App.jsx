// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { auth } from './config/firebaseconfig';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { setCart, clearCart } from './config/reduxconfig/reducers/cartSlice';
// import { getUserCart, saveUserCart } from './config/cartService';


import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Import your Firebase Auth setup
import { auth } from './config/firebaseConfig';

// Import Redux Actions from your cartSlice
import { setCart, clearCart } from './config/reduxconfig/reducers/cartSlice';
import Navbar from './components/Navbar';


// Import Firestore Helper Functions
import { getUserCart, saveUserCart } from './config/cartService';

function App() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  
  // Prevents saving empty state to Firestore before initial fetch finishes
  const isInitialFetchDone = useRef(false);

  // 1. Listen for Auth changes (Login / Logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Load cart from Firestore into Redux on login
          const savedCart = await getUserCart(user.uid);
          dispatch(setCart(savedCart));
        } catch (error) {
          console.error("Failed to fetch cart on login:", error);
        } finally {
          isInitialFetchDone.current = true;
        }
      } else {
        // Clear Redux state on logout
        dispatch(clearCart());
        isInitialFetchDone.current = false;
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // 2. Automatically sync Redux cart changes to Firestore
  useEffect(() => {
    // Only save if initial fetch completed and user is logged in
    if (isInitialFetchDone.current && auth.currentUser) {
      saveUserCart(auth.currentUser.uid, cartItems);
    }
  }, [cartItems]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
   <>
   <Navbar />
    <div>
      {/* Example Header Bar */}
      <header style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
        {auth.currentUser ? (
          <div>
            <span>Logged in as: <strong>{auth.currentUser.email}</strong></span>
            <button 
              onClick={handleLogout} 
              style={{ marginLeft: '1rem', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <span>Please log in to access your cart.</span>
        )}
      </header>

      {/* Main Content Area */}
      <main style={{ padding: '1rem' }}>
        {/* Render your Product List, Cart component, or React Router Routes here */}
      </main>
    </div>
   </>
  );
}

export default App;