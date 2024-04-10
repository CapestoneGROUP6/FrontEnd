import { useGlobalContext } from 'providers/GlobalProvider'
import React, { useEffect, useState } from 'react'
import { Container, Form, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import API from 'services/APIService';
import { CartItem } from './UserCart';
import { formToJSON } from 'axios';
import { loadStripe } from "@stripe/stripe-js";
import { Button, Grid, Paper } from '@mui/material';

export default function CheckoutPage() {
    const obj = new URLSearchParams(window.location.search);
    const { user } = useGlobalContext();
    const [showModal, setShowModal] = useState(false);
    const [confirmation, setCOnfirmation] = useState('');
    const navigate = useNavigate()
    const [cartItems, setCartItems] = useState([] as CartItem[]);

    useEffect(() => {
        API.getInstance()
            .get("/cart")
            .then((response) => {
                if (response.status === 200 && response.data && response.data?.length > 0) {
                    setCartItems(response.data as CartItem[]);
                } else {
                    navigate("/cart")
                }
            })
            .catch(() => {
                navigate("/cart")
            });
    }, []);

    const [formData, setFormData] = useState({
        address: user?.ADDRESS || '',
        mobile: user?.MOBILE || '',
        zipcode: user?.ZIPCODE || ''
    });
    const [ccData, setCcData] = useState({
        ccNumber: '',
        ccExpiry: '',
        cvv: ''
    });

    useEffect(() => {
        if (obj.get("payment") === "success") {
            API.getInstance().post("/user/placeorder", {
                address: user?.ADDRESS || '',
                mobile: user?.MOBILE || '',
                zipcode: user?.ZIPCODE || ''
            }).then(response => {
                if (response?.data?.status && response?.data?.orderDtails) {
                    setCOnfirmation(response.data.orderDtails.orderid)
                }
            })
        }
    }, [])

    const handleCheckout = async (e) => {
        e.preventDefault();
        const stripePromise = loadStripe('pk_test_51P0dXeK6WzhOXkMtZY0WC9JVsHiqKs99zKVPmBNVsNBJOHkE4Q1M6Tx0DBQJYE6V1D9HQmLYH2LOVEZEdvUrF3yQ00MnHA7ild');
        const stripe = await stripePromise;
        try {
            const response = await API.getInstance().post("/stripe/checkoutsession")
            if (response?.data?.id) {
                const sessionId = response?.data?.id
                const result = await stripe.redirectToCheckout({
                    sessionId,
                });
                console.log("ddasdasdasdasdasdasd")
                console.log(result);
                if (result.error) {
                    // using `result.error.message`.
                    console.log(result.error);
                } else {
                    await placeORder();
                }
            }
        } catch (error) {
            console.log(error)
        }
    }


    const placeORder = async () => {
        try {
            const response = await API.getInstance().post("/user/placeorder", {
                address: formData.address,
                zipcode: formData.zipcode,
                mobile: formData.mobile,
            })
            if (response?.data?.status && response?.data?.orderDtails) {
                setCOnfirmation(response.data.orderDtails.orderid)
            }
        } catch (error) {

        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateCHeckoutForm = () => {
        return formData.address.trim() !== '' && formData.mobile.trim() !== '' && formData.zipcode.trim() !== '';
    };

    const validateCCFORM = () => {
        return (
            ccData.ccNumber.trim() !== '' &&
            ccData.ccExpiry.trim() !== '' &&
            ccData.cvv.trim() !== ''
        );
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateCHeckoutForm()) {
            setShowModal(true)
        } else {
            alert('Please fill out all fields.');
        }
    };

    const placeOrder = async () => {
        if (validateCCFORM()) {
            console.log('Form submitted:', formData);
            console.log('Form submitted:', formData);
            await placeORder()
            setShowModal(false)
        } else {
            alert('Please fill out all fields.');
        }
    }

    const viewOrderDetails = () => {
        navigate("/orderDetails/" + confirmation)
    }

    const handleCcChange = (e) => {
        const { name, value } = e.target;
        setCcData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <Grid container justifyContent='center'>
            <Grid item xs={11} md={6}>
            <Container>
            <Paper elevation={10} style={{ padding: 20 }}>
                <h1 className="text-center mb-4">Checkout</h1>
                <Form onSubmit={handleCheckout}>
                    <Form.Group controlId="formAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            style={{ height: '3rem' }}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formMobile">
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your mobile number"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            style={{ height: '3rem' }}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formZipcode">
                        <Form.Label>Zipcode</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your zipcode"
                            name="zipcode"
                            value={formData.zipcode}
                            onChange={handleChange}
                            style={{ height: '3rem' }}
                            required
                        />
                    </Form.Group>
                    <br />
                    <Button variant="contained" type="submit">
                        Submit
                    </Button>&nbsp;
                    <Button variant="contained" type="submit" onClick={() => navigate("/cart")}>
                        Go to Cart
                    </Button>
                </Form>
                <Modal show={showModal} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Enter Your Credit Card Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formCcNumber">
                            <Form.Label>Credit Card Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter credit card number"
                                name="ccNumber"
                                value={ccData.ccNumber}
                                onChange={handleCcChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formCcExpiry">
                            <Form.Label>Credit Card Expiry</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter expiry date"
                                name="ccExpiry"
                                value={ccData.ccExpiry}
                                onChange={handleCcChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formCvv">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter CVV"
                                name="cvv"
                                value={ccData.cvv}
                                onChange={handleCcChange}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="contained" onClick={handleCheckout}>
                            Place order
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={!!confirmation} onHide={() => {
                    navigate("/orders")
                }}>
                    <Modal.Header closeButton>
                        <Modal.Title>OrderSuccess</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Order Has been placed successfully
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="contained" onClick={() => {
                            navigate("/orders")
                        }}>
                            View Orders
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Paper>

        </Container>
            </Grid>
        </Grid>
        
    );
}
