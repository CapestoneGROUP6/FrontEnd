import React, { useState, useEffect } from 'react';
import API from '../services/APIService';
import { Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

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
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel id="category-label">Select Category</InputLabel>
                        <Select
                            labelId="category-label"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            error={showError}
                        >
                            <MenuItem value="">All Categories</MenuItem>
                            {categories?.map((category) => (
                                <MenuItem key={category.ID} value={category.ID}>
                                    {category.NAME}
                                </MenuItem>
                            ))}
                        </Select>
                        {showError && <FormHelperText error>Category is Required</FormHelperText>}
                    </FormControl>
                </Grid>
            </Grid>
        </>
    );
}
