import React, { useEffect, useState } from 'react';
import API from 'services/APIService';
import { Container, Table, Image, Row } from 'react-bootstrap';
import ProductCart from 'components/ProductCart';
import { useNavigate } from 'react-router-dom';
import { Button, Divider, Grid, Typography } from '@mui/material';

export type CartItem = {
  itemid: number;
  count: number;
  id: number;
  userid: number;
  productDetails: {
    ID: number;
    NAME: string;
    PRICE: string;
    Category_ID: number;
    User_ID: number;
    IsAdminApproved: number;
    Image: string;
    BookFile: string;
    Description: string;
  };
};

export default function UserCart() {
  const [cartItems, setCartItems] = useState([] as CartItem[]);
  const [refetchCount, refetch] = useState(0);
  const [fetched, setFetched] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    API.getInstance()
      .get("/cart")
      .then((response) => {
        setFetched(true)
        if (response.status === 200 && response.data) {
          setCartItems(response.data as CartItem[]);
        }
      })
      .catch(console.log);
  }, [refetchCount]);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cartItems.forEach((item) => {
      totalPrice += +item.productDetails.PRICE * item.count;
    });
    return totalPrice.toFixed(2);
  };

  const tax = () => {
    let totalPrice = calculateTotalPrice();
    cartItems.forEach((item) => {
      totalPrice += +item.productDetails.PRICE * item.count;
    });
    return ((+totalPrice * 13) / 100).toFixed(2);
  };

  const clearCart = async () => {
    API.getInstance()
      .delete("/cart")
      .then((response) => {
        if (response.data?.status) {
          setCartItems([]);
          alert("Cart Cleared Successfully")
          navigate("/")
        }
      })
      .catch(console.log);
  }

  if (cartItems?.length === 0 && fetched) {
    return <Grid container justifyContent='center' direction='column' spacing={4} alignItems={'center'}>
      <Grid item>
        <Typography variant='h3'>No Books in Cart</Typography>
      </Grid>
      <Grid item>
        <Button variant='contained' onClick={() => navigate("/products")}>Add Books</Button>
      </Grid>
    </Grid>
  }

  return (
    <>
      <Typography variant='h3' className='text-center'>Cart</Typography>
      <Grid container justifyContent='center'>
        <Grid item xs={12} md={10}>
          <Grid container direction='column' spacing={2}>
            {
              cartItems?.length > 0 &&   <Grid item display='flex' justifyContent='flex-end'>
              <Button variant='contained' color='error' onClick={clearCart}>Clear</Button>
           </Grid>
            }
            {
              cartItems?.map(item => {
                return <>
                  <Grid item container key={item.id} xs={12} alignItems='center'>
                    <Grid item>
                      <Image style={{
                        width: '10rem',
                        height: '10rem',
                        objectFit: 'contain'
                      }} src={process.env.REACT_APP_BASE_URL + "/uploads/" + item.productDetails.Image} fluid />
                    </Grid>
                    <Grid item display={'flex'} flexDirection='column' gap={2} justifyContent='center'>
                      <Typography variant='h6'>{item.productDetails.NAME}</Typography>
                      <Typography>Price: ${(+item.productDetails.PRICE * item.count).toFixed(2)}</Typography>
                      <ProductCart id={item.itemid} hideAddToCart successcallback={() => refetch((obj) => obj + 1)} />
                    </Grid>
                  </Grid><br />
                  <Divider style={{
                    color: 'black',
                    border: '1px solid black'
                  }}/>
                </>
              })
            }
          </Grid>
        </Grid>
        <Grid item xs={8} container justifyContent='flex-end'>
          <Grid item xs={12} display={'flex'} flexDirection={'column'} gap={2} alignItems='flex-end'>
          <br/>
            <Typography>Total Cart Price: ${calculateTotalPrice()}</Typography>
            <Typography>Tax: ${tax()}</Typography>
            <Typography>Total: ${(+tax() + (+calculateTotalPrice())).toFixed(2)}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} display='flex' justifyContent='center' gap={2}>
          <Button variant='contained' onClick={() => navigate("/products")}>Continue to shop</Button>
          <Button variant='contained' onClick={() => navigate("/checkout")}>Proceed</Button>
        </Grid>
      </Grid>
    </>
  );
}
