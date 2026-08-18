import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
    },
    decreaseQty: (state, action) => {
  // Support both object payload ({ id: 1 }) and string/number ID payload (1)
  const id = action.payload?.id ?? action.payload;
  const item = state.items.find((i) => i.id === id);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      state.items = state.items.filter((i) => i.id !== id);
    }
  }
},
increaseQty: (state, action) => {
  const id = action.payload?.id ?? action.payload;
  const item = state.items.find((i) => i.id === id);
  if (item) {
    item.quantity += 1;
  }
},
removeFromCart: (state, action) => {
  const id = action.payload?.id ?? action.payload;
  state.items = state.items.filter((i) => i.id !== id);
},
    clearCart: (state) => {
      state.items = [];
    },
    setCart: (state, action) => {
      state.items = action.payload;
    },
  },
});

// 2. Exported here
export const { 
  addToCart, 
  increaseQty, 
  decreaseQty, 
  removeFromCart, 
  clearCart, 
  setCart 
} = cartSlice.actions;

export default cartSlice.reducer;