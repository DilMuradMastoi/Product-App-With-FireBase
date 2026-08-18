import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} from "../config/reduxconfig/reducers/cartSlice";

import Navbar from "./Navbar";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Cart = () => {
  const dispatch = useDispatch();

  // 1. Get cart items array safely from Redux
  const cartItems = useSelector((state) => state.cart?.items) || [];

  // 2. Calculate grandTotal using cartItems
  const grandTotal = cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  // 3. Checkout Handler
  const handleCheckout = () => {
    alert("Order placed successfully!");
    // Clears Redux store -> Sync automatically updates Firestore to empty items
    dispatch(clearCart());
  };

  // 4. Empty Cart Screen
  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />

        <Box
          sx={{
            minHeight: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 5,
              boxShadow: 8,
            }}
          >
            <ShoppingCartIcon
              sx={{
                fontSize: 80,
                color: "primary.main",
              }}
            />

            <Typography variant="h4" mt={2}>
              Your Cart is Empty
            </Typography>

            <Typography color="text.secondary">
              Add some products to start shopping.
            </Typography>
          </Card>
        </Box>
      </>
    );
  }

  // 5. Cart with Items Screen
  return (
    <>
      <Navbar/>
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          p: 4,
        }}
      >
        <Typography
         variant="h3"
  sx={{
    textAlign: 'center',
    fontWeight: 'bold',
    mb: 4,
  }}
        >
          Shopping Cart
        </Typography>

        {cartItems.map((item) => {
          const itemTotal = (item.price || 0) * (item.quantity || 1);

          return (
            <Card
              key={item.id}  
              sx={{
                mb: 3,
                borderRadius: 5,
                boxShadow: 5,
                transition: ".3s",

                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <CardContent>
                <Stack
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                  spacing={3}
                 sx={{
                   alignItems:"center",
                  justifyContent:"space-between"
                 }}
                >
                  <Avatar
                    src={item.thumbnail || item.image}
                    alt={item.title}
                    variant="rounded"
                    sx={{
                      width: 120,
                      height: 120,
                    }}
                  />

                  <Box flex={1} sx={{ textAlign: { xs: "center", md: "left" } }}>
                    <Typography variant="h5" fontWeight="bold">
                      {item.title}
                    </Typography>

                    <Typography mt={1}>
                      Price: <b>${item.price}</b>
                    </Typography>

                    <Typography mt={1}>
                      Quantity: <b>{item.quantity}</b>
                    </Typography>

                    <Typography
                      mt={1}
                      color="primary"
                      fontWeight="bold"
                    >
                      Total: ${itemTotal.toFixed(2)}
                    </Typography>
                  </Box>

                  {/* Quantity Controls */}
                  <Stack
                   direction="row"
  spacing={1}
  sx={{ alignItems: 'center', justifyContent: 'center' }}
                  >
                    <IconButton
                      color="error"
                      onClick={() => dispatch(decreaseQty(item))}
                    >
                      <RemoveIcon />
                    </IconButton>

                    <Typography variant="h6">{item.quantity}</Typography>

                    <IconButton
                      color="success"
                      onClick={() => dispatch(increaseQty(item))}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>

                  {/* Remove Button */}
                  <Button
                    color="error"
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    onClick={() => dispatch(removeFromCart(item))}
                    sx={{
                      alignSelf: "center",
                      px: 3,
                      py: 1,
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          );
        })}

        <Divider sx={{ my: 1 }} />

        <Card
          sx={{
            p: 4,
            borderRadius: 5,
            background:
              "linear-gradient(135deg,#2563eb,#7c3aed,#ec4899)",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <Typography variant="h4">
            Grand Total
          </Typography>

          <Typography
            variant="h2"
            fontWeight="bold"
            mt={2}
          >
            ${grandTotal.toFixed(2)}
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleCheckout}
            sx={{
              mt: 3,
              bgcolor: "#fff",
              color: "#000",

              "&:hover": {
                bgcolor: "#f5f5f5",
              },
            }}
          >
            Proceed to Checkout
          </Button>
        </Card>
      </Box>
    </>
  );
};

export default Cart;