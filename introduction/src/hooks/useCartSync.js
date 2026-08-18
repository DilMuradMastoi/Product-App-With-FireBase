import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseconfig";
import { setCart, clearCart } from "../config/reduxconfig/reducers/cartSlice";

export function useCartSync() {
  const dispatch = useDispatch();
  // 1. Target the items array specifically
  const cartItems = useSelector((state) => state.cart.items);
  const isInitialLoad = useRef(true);

  // 2. Load Cart on Login / Clear on Logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "carts", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            dispatch(setCart(docSnap.data().items || []));
          } else {
            dispatch(setCart([]));
          }
        } catch (error) {
          console.error("Error fetching user cart:", error);
        }
      } else {
        dispatch(clearCart());
      }
      isInitialLoad.current = false;
    });

    return () => unsubscribe();
  }, [dispatch]);

  // 3. Save Cart to Firestore when cartItems update
  useEffect(() => {
    const user = auth.currentUser;

    // Do not overwrite Firestore before the initial fetch completes
    if (isInitialLoad.current || !user) return;

    const saveCart = async () => {
      try {
        const docRef = doc(db, "carts", user.uid);
        // Save cartItems array, not the whole state object
        await setDoc(docRef, { items: cartItems }, { merge: true });
      } catch (error) {
        console.error("Error saving user cart:", error);
      }
    };

    saveCart();
  }, [cartItems]);
}