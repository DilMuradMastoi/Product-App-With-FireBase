import {   Box,
  Typography,
  Container,
  Paper,
  Button,
  Chip,
  Rating, } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";


const ProductsDetails = () => {

  const { id } = useParams();

  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    axios(
      `https://dummyjson.com/products/${id}`
    )
      .then((res) => {

       

        setProducts(res.data);

      })
      .finally(() => {
        setLoading(false);
      });

  }, [id]);

  console.log(products);

  if (loading) {
    return <Box
          sx={{
            minHeight: "50vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress
            size={50}
            sx={{
              color: "#111827",
            }}
          />
    
          <Typography
            variant="h6"
            sx={{
              color: "#111827",
              fontWeight: 600,
            }}
          >
            Loading Product...
          </Typography>
        </Box>
  }

  if (!products) {
    return <h1>Product Not Found</h1>;
  }

 return (
  <Container maxWidth="lg" sx={{ py: 6 }}>

    <Paper
      elevation={10}
      sx={{
        p: 4,
        borderRadius: 5,
        display: "flex",
        gap: 6,
        alignItems: "center",
        flexWrap: "wrap",
        background: "#fff",
      }}
    >

      {/* Product Image */}
      <Box
        sx={{
          flex: 1,
          minWidth: 300,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src={products.thumbnail}
          alt={products.title}
          sx={{
            width: "100%",
            maxWidth: 450,
            borderRadius: 4,
            objectFit: "cover",
          }}
        />
      </Box>

      {/* Product Info */}
      <Box
        sx={{
          flex: 1,
          minWidth: 300,
        }}
      >
        <Chip
          label={products.category}
          color="primary"
          sx={{ mb: 2 }}
        />

        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
        >
          {products.title}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 3,
            lineHeight: 1.8,
          }}
        >
          {products.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Rating
            value={products.rating}
            precision={0.1}
            readOnly
          />

          <Typography>
            ({products.rating})
          </Typography>
        </Box>

        <Typography
          variant="h4"
          color="success.main"
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          ${products.price}
        </Typography>

        <Typography
          sx={{
            mb: 3,
            color:
              products.stock > 0
                ? "success.main"
                : "error.main",
          }}
        >
          {products.stock > 0
            ? `${products.stock} Items In Stock`
            : "Out Of Stock"}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            size="large"
            color="primary"
          >
            Add To Cart
          </Button>

          <Button
            variant="outlined"
            size="large"
          >
            Buy Now
          </Button>
        </Box>
      </Box>

    </Paper>

  </Container>
);
}
export default ProductsDetails;