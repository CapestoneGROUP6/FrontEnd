import Categories from 'components/Categories';
import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import API from 'services/APIService';
import { Cart } from 'react-bootstrap-icons'

export default function ProductsList({ categoryId = '' , showFilter = true}) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = "/products"
                if (categoryId) {
                    url += "?categoryId=" + categoryId
                }
                const response = await API.getInstance().get(url);
                const { data } = response;
                setProducts(data || []);
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
        <Container className="mt-4">
            {
                showFilter && <Row>
                <Col lg={8}>
                    <Categories onChange={onCHangeCategories} showError={false} />
                </Col>
            </Row>
            }
            
            <Row>
                {products?.map((product) => (
                    <Col key={product.ID} md={4} lg={3}>
                        <Card style={{ height: '100%', width: '20rem' }}>
                            <Card.Img
                                variant="top"
                                src={process.env.REACT_APP_BASE_URL + "/uploads/" + product.Image}
                                alt={product.NAME}
                                style={{ minHeight: '15rem', maxHeight: '20rem', objectFit: 'contain' }}
                            />
                            <Card.Body>
                                <div style={{ minHeight: '6rem', maxHeight: '6rem' }}>
                                    <Card.Title>{product.NAME}</Card.Title>
                                    <Card.Text >{product.Description}</Card.Text>
                                    <Card.Text >{product.PRICE}</Card.Text>
                                </div><br />
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button variant="primary" onClick={() => { }} style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Cart size={20} />&nbsp;ADD TO CART
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
