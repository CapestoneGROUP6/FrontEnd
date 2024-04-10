import ProductCart from 'components/ProductCart';
import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Trash, Pencil } from 'react-bootstrap-icons';
import { useNavigate, useParams } from 'react-router-dom';
import API from 'services/APIService';
import { Book } from 'types';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        file: null,
        category_id: '',
        id: -1,
        existingImage: '',
        IsAdminApproved: 0,
        User_ID: -1,
    });

    const getPRoductDEtails = async () => {
        try {
            const response = await API.getInstance().get<Book>("/products/" + id);
            const { data } = response;
            if (data) {
                const { Category_ID, Description, ID, Image, IsAdminApproved, NAME, PRICE, User_ID } = data;
                setFormData({
                    name: NAME || '',
                    price: PRICE || '',
                    description: Description || '',
                    file: Image,
                    category_id: Category_ID + '',
                    id: ID,
                    existingImage: Image,
                    IsAdminApproved,
                    User_ID,
                });
            }
        } catch (error) {
            console.error('Error fetching Products:', error);
        }
    };

    const handleDelete = async (productId: number) => {
        console.log(`Delete product with ID: ${productId}`);
        try {
            const response = await API.getInstance().delete("/products/" + productId);
            const { data } = response;
            if (data.status) {
                navigate("/adminproducts");
            }
        } catch (error) {
            console.error('Error fetching Products:', error);
        }
    };

    useEffect(() => {
        if (id) {
            getPRoductDEtails();
        }
    }, [id]);

    const { category_id, id: productid, description, IsAdminApproved, name, price, User_ID, file } = formData || {};

    return (
        <div className="container mt-4">
            <Card className="w-xxl-90 w-xl-90 w-lg-70 w-md-90 mx-auto">
                <Card.Body>
                    <div className="row">
                        <div className="col-md-4">
                            <img src={process.env.REACT_APP_BASE_URL + "/uploads/" + file} className="img-fluid rounded-start" alt={name} />
                        </div>
                        <div className="col-md-8 d-flex flex-column align-items-start px-5">
                            <h3 className="card-title">{name}</h3><br/>
                            <p className="card-text">
                                <strong>Description:</strong> {description}
                            </p>
                            <p className="card-text"><br/>
                                <strong>Price:</strong> {price}
                            </p><br/>
                            <div>
                                <ProductCart id={productid} />
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}
