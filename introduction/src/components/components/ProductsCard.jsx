import { useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Rating from '@mui/material/Rating'
import { Link } from 'react-router'


function HeartIcon({ filled }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}


function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}


export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
}) {

  const [wishlisted, setWishlisted] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [elevation, setElevation] = useState(1)


  const hasSale =
    product.salePrice != null && product.salePrice < product.price


  const discountPercent = hasSale
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0


  function handleAddToCart() {

    setAddingToCart(true)

    setTimeout(() => {
      setAddingToCart(false)
      onAddToCart?.(product)
    }, 600)

  }


  function handleToggleWishlist(e) {

    e.stopPropagation()

    const next = !wishlisted

    setWishlisted(next)

    onToggleWishlist?.(product, next)

  }


  return (

    <Card
      sx={{
        width: '100%',
        maxWidth: 320,
        position: 'relative',

        transition: 'box-shadow 0.25s, transform 0.25s',

        '&:hover': {
          transform: 'translateY(-4px)',
        },

        '&:hover .product-image': {
          transform: 'scale(1.06)',
        },
      }}

      elevation={elevation}

      onMouseEnter={() => setElevation(8)}

      onMouseLeave={() => setElevation(1)}

    >


      {/* IMAGE */}

      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: '75%',
        }}
      >


        <CardMedia
          className="product-image"
          component="img"

          image={product.thumbnail}

          alt={product.title}

          sx={{
            position: 'absolute',
            inset: 0,
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}

        />


        <Chip
          label={product.category}

          size="small"

          sx={{
            position: 'absolute',
            top: 12,
            left: 12,

            bgcolor: 'rgba(255,255,255,0.9)',
            fontWeight: 600,
          }}

        />



        <IconButton

          onClick={handleToggleWishlist}

          size="small"

          sx={{

            position: 'absolute',

            top: 8,

            right: 8,

            bgcolor:'rgba(255,255,255,0.85)',

            color: wishlisted ? '#ef4444' : 'gray',

          }}

        >

          <HeartIcon filled={wishlisted}/>

        </IconButton>




        {hasSale && (

          <Chip

            label={`-${discountPercent}%`}

            size="small"

            sx={{

              position:'absolute',

              top:12,

              right:52,

              bgcolor:'#ef4444',

              color:'#fff',

            }}

          />

        )}



      </Box>



      {/* CONTENT */}


      <CardContent>


        <Typography

          variant="subtitle1"

          fontWeight={600}

        >

          {product.name || product.title}

        </Typography>



        <Typography

          variant="body2"

          color="text.secondary"

        >

          {product.description}

        </Typography>



        <Box

          sx={{

            display:'flex',

            alignItems:'center',

            mt:1

          }}

        >


          <Rating

            value={product.rating || 0}

            precision={0.5}

            readOnly

            size="small"

          />


        </Box>




        <Typography

          variant="h6"

          fontWeight={700}

          sx={{mt:1}}

        >

          {formatPrice(
            hasSale 
            ? product.price
            : product.price
          )}

        </Typography>



      </CardContent>




      {/* BUTTON */}


      <CardActions>


        <Button

          variant="contained"

          fullWidth

          disabled={addingToCart}

          onClick={handleAddToCart}

        >

          {addingToCart ? "Adding..." : "Add to cart"}

        </Button>

        <Link to={`/products/${product.id}`}>
        <Button>
          View Details
        </Button>
        </Link>


      </CardActions>



    </Card>

  )

};