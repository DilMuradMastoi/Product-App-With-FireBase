import { useState, useEffect } from "react";
import axios from "axios";

import { useDispatch } from "react-redux";
import { addToCart } from "../config/reduxconfig/reducers/cartSlice";
import ProductCard from "./components/ProductsCard";
import Navbar from "./Navbar";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";


export default function Products() {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    setError(null);

    axios("https://dummyjson.com/products?limit=1000")
    
    
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  

  const renderContent = () => {
    if (error) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={fetchProducts}
              >
                Retry
              </Button>
            }
          >
            {error.message}
          </Alert>
        </Box>
      );
    }

    if (loading) {
      return (
        <Box
          sx={{
            minHeight: "50vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress />

          <Typography variant="h6">
            Loading Products...
          </Typography>
        </Box>
      );
    }

    if (products.length === 0) {
      return (
        <Typography
          align="center"
          variant="h6"
        >
          No Products Found
        </Typography>
      );
    }

    return (
      <Grid container spacing={3} justifyContent="center">
        {products.map((product) => (
          <Grid item key={product.id}>
            <ProductCard
              product={product}
            onAddToCart={(p) => {
  console.log("Adding:", p);
  dispatch(addToCart(p));
}}
              onToggleWishlist={(product, active) =>
                console.log(
                  active
                    ? "Wishlisted"
                    : "Removed from Wishlist",
                  product.title
                )
              }
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#eef2ff,#fdf2f8,#f8fafc)",
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            mb={1}
          >
            Featured Products
          </Typography>

          <Typography
            align="center"
            color="text.secondary"
            mb={5}
          >
            Handpicked favorites from our latest collection.
          </Typography>

          {renderContent()}
        </Container>
      </Box>
    </>
  );
};
