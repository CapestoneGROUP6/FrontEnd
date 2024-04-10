import { useUserOrder } from 'hooks/useALlOrders'
import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import API from 'services/APIService'
import { OrderInformation } from 'types'
import Accordion from 'react-bootstrap/Accordion';
import { useNavigate } from 'react-router-dom'
import { Button, Grid } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download';

export default function UserOrders() {
  const { loading, orders, refetch: fetchOrders } = useUserOrder()
  const navigate = useNavigate();

  const downloadInvoice = async (orderId: number) => {
    try {
      const response = await API.getInstance().get(`/user/invoice/${orderId}`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      // Open the PDF in a new tab
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  if (loading) {
    return <Spinner animation="border" variant="primary" />
  }
  return (
    <>
      <h1 className='text-center'>My Orders</h1>
      <Grid container justifyContent='center'>
        <Grid item xs={11} md={8}>
          <Accordion>
            {
              orders?.filter(obj => obj.orderItems?.length > 0)?.map(order => {
                return <>
                  <Accordion.Item eventKey={order.orderid + ""} key={order.orderid}>
                    <Accordion.Header>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div>Total Items: {order.orderItems?.length}, Price: {order.total}</div>
                        <Button  variant="text" color='success' onClick={(e) => {
                          e.stopPropagation()
                          downloadInvoice(order.orderid)
                        }
                        }><DownloadIcon/>&nbsp;Download Invoice</Button>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <table className='table table-bordered'>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            order.orderItems?.map(item => {
                              return <tr key={item.itemDetails.ID}>
                                <td>{item.itemDetails.NAME}</td>
                                <td><img onClick={() => navigate("/productdetails/" + item.itemDetails.ID)} style={{ width: '5rem', height: '5rem', objectFit: 'contain' }} src={process.env.REACT_APP_BASE_URL + "/uploads/" + item.itemDetails.Image} className="img-fluid rounded-start" alt={item.itemDetails.NAME} />
                                </td>
                                <td>{item.quantity}</td>
                                <td>${item.itemDetails.PRICE}</td>
                                <td>${+item.itemDetails.PRICE * item.quantity}</td>
                              </tr>
                            })
                          }
                        </tbody>
                      </table>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        Total OrderPrice: ${order.total} (Including all taxes)
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                </>
              })
            }
          </Accordion>
        </Grid>
      </Grid>

    </>
  )
}
