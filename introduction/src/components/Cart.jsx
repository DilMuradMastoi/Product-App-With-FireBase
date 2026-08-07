import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart, // 1. Import clearCart action
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
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const grandTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // 2. Checkout Handler
  const handleCheckout = () => {
    // Show confirmation alert (optional)
    alert("Order placed successfully!");

    // Clears Redux store -> useCartSync automatically updates Firestore to empty items
    dispatch(clearCart());
  };

  // Empty Cart
  if (cart.length === 0) {
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

  return (
    <>
      <Navbar />

      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          p: 4,
        }}
      >
        <Typography
          variant="h3"
          textAlign="center"
          fontWeight="bold"
          mb={4}
        >
          Shopping Cart
        </Typography>

        {cart.map((item) => {
          const itemTotal = item.price * item.quantity;

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
    alignItems="center"
    justifyContent="space-between" // Distributes items evenly horizontally on wide screens
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
      alignItems="center"
      justifyContent="center"
      spacing={1}
    >
      <IconButton
        color="error"
        onClick={() => dispatch(decreaseQty(item.id))}
      >
        <RemoveIcon />
      </IconButton>

      <Typography variant="h6">{item.quantity}</Typography>

      <IconButton
        color="success"
        onClick={() => dispatch(increaseQty(item.id))}
      >
        <AddIcon />
      </IconButton>
    </Stack>

    {/* Remove Button */}
    <Button
      color="error"
      variant="contained"
      startIcon={<DeleteIcon />}
      onClick={() => dispatch(removeFromCart(item.id))}
      sx={{
        alignSelf: "center", // Keeps it centered inside the parent stack
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
            onClick={handleCheckout} // 3. Attached click handler here
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