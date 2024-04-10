import React, { useEffect, useState } from 'react'
import API from 'services/APIService';
import { Plus, Dash, Trash, Cart } from 'react-bootstrap-icons'
import { useGlobalContext } from 'providers/GlobalProvider';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, IconButton, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function ProductCart(props: { id: number, hideAddToCart?: boolean, successcallback?: () => void }) {
    const [count, setCount] = useState(0);
    const { user } = useGlobalContext()
    const navigate = useNavigate();

    useEffect(() => {
        API.getInstance().get("/cart/product/" + props.id).then((response) => {
            if (response.status === 200 && response?.data) {
                setCount(response.data.count || 0)
            }
        }).catch(console.log)
    }, [props.id])

    const updateCount = async (newCount: number) => {
        if (!user.ID) {
            window.location.href = "/login"
            return
        }

        try {
            setCount(newCount)
            await API.getInstance().put("/cart", {
                "itemid": props.id,
                "count": newCount
            })
            props.successcallback && props.successcallback()
        } catch (error) {
            console.log(error);
        }
    }

    const incrementCount = () => {
        updateCount(count + 1);
    };

    const decrementCount = () => {
        updateCount(count - 1);
    };

    const deleteItem = () => {
        updateCount(0);
    };

    const addToCart = () => {
        updateCount(1);
    };

    if (count === 0) {
        return <div>
            {
                !props.hideAddToCart && <Button variant='contained' color='primary' onClick={addToCart}>Add to Cart</Button>
            }

        </div>
    }

    return (
        <>
            <Grid container spacing={1} alignItems={'center'}>
                <Grid item><IconButton><RemoveCircleIcon fontSize='medium' color='error' onClick={decrementCount} /></IconButton></Grid>
                <Grid item>
                    <Typography variant='body2'>{count}</Typography>
                </Grid>
                <Grid item><IconButton><AddCircleIcon color='primary' onClick={incrementCount} /></IconButton></Grid>
                <Grid item><IconButton><DeleteIcon onClick={deleteItem} /></IconButton></Grid>
                {
                    !props.hideAddToCart && <Grid item><IconButton><ShoppingCartIcon color='inherit' onClick={() => navigate("/cart")} /></IconButton></Grid>
                }
            </Grid>
        </>
    )
}
