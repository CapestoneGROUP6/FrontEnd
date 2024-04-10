import Categories from 'components/Categories';
import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import API from 'services/APIService';
import { Cart } from 'react-bootstrap-icons'
import ProductCart from 'components/ProductCart';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Paper, Typography } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export default function ProductsList({ categoryId = '', showFilter = true, limit = '', featured = false }) {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = "/products"
                if (categoryId) {
                    url += "?categoryId=" + categoryId
                }
                const response = await API.getInstance().get(url);
                const { data } = response;
                if (limit) {
                    setProducts(data?.splice(0, +limit) || []);
                } else {
                    setProducts(data || []);
                }
            } catch (error) {
                console.error('Error fetching Products:', error);
            }
        };

        fetchProducts();
    }, [categoryId]);

    const onCHangeCategories = async (id: number) => {
        try {
            const response = await API.getInstance().get("/products/category/" + id);
            const { data } = response;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching Products:', error);
        }
    }


    return (
        <>
            <Grid container direction='column' spacing={2} justifyContent='center'>
                {
                    showFilter && <Grid item xs={2}>
                        <Categories onChange={onCHangeCategories} showError={false} />
                    </Grid>
                }

                <Grid item container spacing={2} xs={12} justifyContent='center'>
                    {
                        products?.map(product => {
                            return <Grid item xs={6} md={3} key={product.ID}>
                                <Paper elevation={10} style={{ padding: 10, borderRadius: 10 }}>
                                    <Grid container direction='column' spacing={2}>
                                        <Grid item display={'flex'} justifyContent='center'>
                                            <img style={{
                                                width: '10rem',
                                                height: '10rem',
                                                objectFit: 'contain',
                                                cursor: 'pointer'
                                            }} onClick={() => navigate("/productdetails/" + product.ID)} alt={product.NAME} src={process.env.REACT_APP_BASE_URL + "/uploads/" + product.Image} />
                                        </Grid><br />
                                        <Grid item display='flex' flexDirection='column' gap={2}>
                                            <Typography variant='h5'>{product.NAME}</Typography>
                                            {/* <Typography>{product.Description}</Typography> */}
                                            <Typography>Price: ${product.PRICE}</Typography>
                                        </Grid>
                                        {
                                            featured && <Grid item>
                                                <Button variant='contained' color='warning'><RemoveRedEyeIcon/>&nbsp;Featured Book</Button>
                                            </Grid>
                                        }
                                        <Grid item>
                                            <ProductCart id={product.ID} />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Grid>
        </>
    );
}
