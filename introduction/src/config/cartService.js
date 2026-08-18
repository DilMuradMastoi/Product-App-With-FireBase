import { db } from "./firebaseconfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Save user's cart to Firestore
export const saveUserCart = async (userId, cartItems) => {
  if (!userId) return;
  try {
    const cartRef = doc(db, "carts", userId);
    await setDoc(cartRef, { items: cartItems }, { merge: true });
  } catch (error) {
    console.error("Error saving cart to Firestore:", error);
  }
};

// Fetch user's cart from Firestore
export const getUserCart = async (userId) => {
  if (!userId) return [];
  try {
    const cartRef = doc(db, "carts", userId);
    const docSnap = await getDoc(cartRef);
    if (docSnap.exists()) {
      return docSnap.data().items || [];
    }
  } catch (error) {
    console.error("Error loading cart from Firestore:", error);
  }
  return [];
};