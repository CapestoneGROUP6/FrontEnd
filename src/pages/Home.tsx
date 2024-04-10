import React, { useEffect, useState } from 'react';
import banner from '../images/book.jpg';
import homeimage from '../images/book.jpg';
import book2 from '../images/book2.jpg';
import API from 'services/APIService';
import ProductsList from './BooksList';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from 'providers/GlobalProvider';

export default function Home() {
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate()
  const {user} = useGlobalContext()

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

  const changeCat = (id) => {
    setCategoryId(id)
  }

  return (
    <div style={{background: '#eaeaea'}}>
      <div className="container-fluid p-0">
        <img
          src={banner}
          className="img-fluid"
          alt="Banner Image"
          style={{ width: '100%', objectFit: "cover", maxHeight: '30rem' }}
        />
        <div className="banner-content">
          <h3 style={{ textAlign: "center", fontSize: '2rem', margin: "3rem" }}>{user? user.NAME + ", " : ''}Welcome to Book Bazaar</h3>
        </div>
      </div>

      <div className="container mt-4" style={{ background: '#d9e7d6', borderRadius: '10px', margin: "auto", width: "100%", padding: "25px", boxShadow: "15px 15px 10px lightgray" }}>
        <div className="row">
          <div className="col-md-6">
            <img
              src={book2}
              className="img-fluid"
              alt="Side Image"
              style={{ width: '80%', height: 'auto', borderRadius: "5%", objectFit: 'contain', margin: 'auto' }}
            />
          </div>
          <div className="col-md-6" style={{ padding: "0 0 10px 20px" }}>
            <h2>Our Speciality: Curated Book Selection</h2>
            <p style={{ lineHeight: "1.75" }}>
              At Book Bazaar, we take pride in curating a diverse and captivating selection of books. From timeless classics to the latest releases, our collection is thoughtfully chosen to cater to every reader's taste.
            </p>
            <p>
              Explore the rich world of literature with our carefully selected titles that span various genres and themes. Whether you're a fiction enthusiast, a history buff, or someone looking for self-improvement, we have something special just for you.
            </p>
            <Button variant='contained' onClick={() => navigate("/products")}>Browse Our Collection</Button>
          </div>
        </div>
      </div><br />
      <Grid container direction='column' spacing={2}>
        <Grid item>
          <h3 className='text-center'>Featured Products</h3>
        </Grid>
        <Grid item>
          <ProductsList categoryId={categoryId} showFilter={false} limit={'4'} featured/>
        </Grid>
      </Grid>
      <Grid container direction='column' spacing={2}>
        <Grid item>
          <h3 className='text-center'>Products</h3>
        </Grid>
        <Grid item container spacing={2} justifyContent='center' alignItems='center'>
          <Grid item xs={3} md={2}>
            <Paper className='d-flex justify-content-center' elevation={15} style={{ cursor: 'pointer', padding: '20', borderRadius: '10px', height: '3rem' }} onClick={() => changeCat('')}>
              <Grid container justifyContent='center' alignItems='center'>
                <Grid item>
                  ALL
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          {
            categories?.map(obj => {
              return <Grid item key={obj.ID} xs={3} md={2}>
                <Paper className='d-flex justify-content-center' elevation={15} style={{
                  cursor: 'pointer', padding: '20', borderRadius: '10px', backgroundColor: categoryId == obj.ID ? '#0d6efd' : 'white',
                  color: categoryId == obj.ID ? '#ffffff' : 'black', height: '3rem'
                }} onClick={() => changeCat(obj.ID)} >
                  <Grid container justifyContent='center' alignItems='center'>
                    <Grid item>
                      {obj.NAME}
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            })
          }
        </Grid>
        <Grid item xs={10} container justifyContent='center'>
          <Grid item xs={10}>
            <ProductsList categoryId={categoryId} showFilter={false} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
