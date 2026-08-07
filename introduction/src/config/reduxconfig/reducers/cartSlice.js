import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Load cart from Firestore
    setCart: (state, action) => {
      return action.payload;
    },

    // Clear cart on logout
    clearCart: () => {
      return [];
    },

    addToCart: (state, action) => {
      const exist = state.find((item) => item.id === action.payload.id);

      if (exist) {
        exist.quantity += 1;
      } else {
        state.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    increaseQty: (state, action) => {
      const item = state.find((i) => i.id === action.payload);
      if (item) item.quantity++;
    },

    decreaseQty: (state, action) => {
      const item = state.find((i) => i.id === action.payload);

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity--;
      } else {
        return state.filter((i) => i.id !== action.payload);
      }
    },

    removeFromCart: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  setCart,
  clearCart,
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;