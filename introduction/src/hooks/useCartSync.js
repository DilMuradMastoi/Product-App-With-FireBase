import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseconfig";
import { setCart, clearCart } from "../config/reduxconfig/reducers/cartSlice";

export function useCartSync() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const isInitialLoad = useRef(true);


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


  useEffect(() => {
    const user = auth.currentUser;

    if (isInitialLoad.current || !user) return;

    const saveCart = async () => {
      try {
        const docRef = doc(db, "carts", user.uid);

        await setDoc(docRef, { items: cart }, { merge: true });
      } catch (error) {
        console.error("Error saving user cart:", error);
      }
    };

    saveCart();
  }, [cart]);
}