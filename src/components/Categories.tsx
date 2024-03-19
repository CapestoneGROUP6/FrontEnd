import React, { useState, useEffect } from 'react';
import API from '../services/APIService';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';

export default function Categories({ onChange, showError }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.getInstance().get("/categories");
                const { data } = response;
                setCategories(data?.categories || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryChange = (selectedValue: any) => {
        setSelectedCategory(selectedValue.target.value);
        if (onChange) {
            onChange(selectedValue.target.value);
        }
    };

    return (
        <>
            <Form.Group as={Row} controlId="formName" className='mb-3'>
                <Form.Label column sm="2">
                    Select Category
                </Form.Label>
                <Col sm="10" className='d-flex flex-column align-items-start'>
                    <Form.Control
                        as="select"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="" disabled>Select category...</option>
                        {categories?.map((category) => (
                            <option key={category.ID} value={category.ID}>
                                {category.NAME}
                            </option>
                        ))}
                    </Form.Control>
                    {
                        showError && <Form.Text className="text-danger text-left">Categories is Required</Form.Text>
                    }

                </Col>
            </Form.Group>
        </>
    );
}
