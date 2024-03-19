import Categories from 'components/Categories';
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import API from '../services/APIService';

export default function AddProduct() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        file: null,
        category_id: '',
        bookFile: null
    });

    const [errors, setErrors] = useState({
        name: '',
        price: '',
        description: '',
        file: '',
        category_id: '',
        bookFile: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            [e.target.name]: file,
        });
        setErrors({
            ...errors,
            [e.target.name]: file ? '' : 'File is required',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate non-empty fields
        const newErrors = {} as any;
        Object.keys(formData).forEach((key) => {
            if (formData[key] === '') {
                newErrors[key] = `${key} is required`;
            }
        });

        if (!formData.file) {
            newErrors.file = 'File is required';
        }
        if (!formData.bookFile) {
            newErrors.bookFile = 'File is required';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const form = new FormData();
            form.append("name", formData.name)
            form.append("description", formData.description)
            form.append("price", formData.price)
            form.append("file", formData.file)
            form.append("category_id", formData.category_id)
            form.append("bookFile", formData.bookFile)

            try {
                const response = await API.getInstance().post("/products", form);
                const { status } = response.data
                if (status) {
                    alert("Product Added Successfully!!!")
                    setFormData({
                        name: '',
                        price: '',
                        description: '',
                        file: null,
                        category_id: '',
                        bookFile: null
                    })
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
    };


    return (
        <Container className="mt-4">
            <Card>
                <Card.Header>
                    <Card.Title>Add Product</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group as={Row} controlId="formName" className='mb-3'>
                            <Form.Label column sm="2">
                                Name
                            </Form.Label>
                            <Col sm="10" className='d-flex flex-column align-items-start'>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter product name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                <Form.Text className="text-danger">{errors.name}</Form.Text>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPrice" className='mb-3'>
                            <Form.Label column sm="2">
                                Price
                            </Form.Label>
                            <Col sm="10" className='d-flex flex-column align-items-start'>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter product price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                />
                                <Form.Text className="text-danger text-left">{errors.price}</Form.Text>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formDescription" className='mb-3'>
                            <Form.Label column sm="2">
                                Description
                            </Form.Label>
                            <Col sm="10" className='d-flex flex-column align-items-start'>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter product description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                                <Form.Text className="text-danger text-left">{errors.description}</Form.Text>
                            </Col>
                        </Form.Group>

                        <Categories
                            onChange={(value) => handleInputChange({
                                target: {
                                    name: 'category_id',
                                    value
                                }
                            })}
                            showError={!!errors.category_id} />

                        <Form.Group as={Row} controlId="formFile" className='mb-3'>
                            <Form.Label column sm="2">
                                Book Thumbnail
                            </Form.Label>
                            <Col sm="10" className='d-flex flex-column align-items-start'>
                                <Form.Control
                                    type="file"
                                    name="file"
                                    onChange={handleFileChange}
                                />
                                <Form.Text className="text-danger text-left">{errors.file}</Form.Text>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formFile" className='mb-3'>
                            <Form.Label column sm="2">
                                Book
                            </Form.Label>
                            <Col sm="10" className='d-flex flex-column align-items-start'>
                                <Form.Control
                                    type="file"
                                    name="bookFile"
                                    onChange={handleFileChange}
                                />
                                <Form.Text className="text-danger text-left">{errors.bookFile}</Form.Text>
                            </Col>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
