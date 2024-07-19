import React, { useEffect, useState } from 'react';
import axios from 'axios';
import liff from '@line/liff';

const App = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    liff.init({ liffId: process.env.REACT_APP_LIFF_ID }).then(() => {
      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        liff.getProfile().then(profile => {
          console.log('Logged in as:', profile.userId);
        });
      }
    });

    axios.get('/api/orders')
      .then(response => setOrders(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleStatusChange = (id, status) => {
    axios.put(`/api/orders/${id}`, { status })
      .then(response => {
        setOrders(prevOrders => prevOrders.map(order =>
          order.id === id ? { ...order, status } : order
        ));
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Order Management</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Order Date</th>
            <th>Price</th>
            <th>Tracking Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer_name}</td>
              <td>{order.order_date}</td>
              <td>{order.price}</td>
              <td>{order.tracking_number}</td>
              <td>
                <select
                  value={order.status}
                  onChange={e => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
