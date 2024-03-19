import React, { useEffect, useState } from 'react';
import banner from '../images/book.jpg';
import homeimage from '../images/book.jpg';
import book2 from '../images/book2.jpg';
import API from 'services/APIService';
import ProductsList from './BooksList';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';


export default function Home() {
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([]);

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
    <div>
      <div className="container-fluid p-0">
        <img
          src={banner}
          className="img-fluid"
          alt="Banner Image"
          style={{ width: '100%', objectFit: "cover", maxHeight: '30rem' }}
        />
        <div className="banner-content">
          <h1 style={{ textAlign: "center", margin: "3rem" }}>Welcome to Book Bazaar</h1>
        </div>
      </div>

      <div className="container mt-4 text-center" style={{ margin: "auto", width: "60%", }}>
        <blockquote >
          <p>
            "Books open minds, hearts, and worlds. Explore the magic within pages, where every word is a doorway to endless possibilities."
          </p>
        </blockquote>
        <button className="btn btn-primary">Explore Books Here</button>
      </div>

      <div className="container mt-4" style={{ margin: "auto", width: "100%", padding: "15px", boxShadow: "5px 5px 10px lightgray" }}>
        <div className="row">
          <div className="col-md-6">
            <img
              src={book2}
              className="img-fluid"
              alt="Side Image"
              style={{ width: '100%', height: 'auto', borderRadius: "5%" }}
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
            <button className="btn btn-primary">Browse Our Collection</button>
          </div>
        </div>
      </div><br />
      <Container>
        <div>
          <h3>Products</h3>
          <hr></hr>
        </div>
        <Row>
          <Col md={12}>
            <Row>
              <Col
                xs={1}
                onClick={() => changeCat('')}
                className='homeCategoryDiv'
                style={{
                  cursor: 'pointer',
                  borderRadius: '5px 5px',
                  border: '1px solid #c4c4c4',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '8px',
                }}
              >
                ALL
              </Col>
              {categories?.map(obj => (
                <Col
                  xs={1}
                  key={obj.ID}
                  onClick={() => changeCat(obj.ID)}
                  className='homeCategoryDiv'
                  style={{
                    cursor: 'pointer',
                    borderRadius: '5px 5px',
                    border: '1px solid #c4c4c4',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '8px',
                    backgroundColor: categoryId == obj.ID ? '#0d6efd': 'white',
                    color: categoryId == obj.ID ? '#ffffff': 'black'
                  }}
                >
                  {obj.NAME}
                </Col>
              ))}
            </Row>
          </Col>
          <Col md={12}>
            <ProductsList categoryId={categoryId} showFilter={false} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
