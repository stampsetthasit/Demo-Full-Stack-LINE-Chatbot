import React, { useEffect, useState } from "react";
import axios from "axios";
import liff from "@line/liff";
import "./App.css";

const App = () => {
  const [orders, setOrders] = useState([]);
  const [userProfile, setUserProfile] = useState({
    userId: "",
    displayName: "",
  });
  const [showTrackingPopup, setShowTrackingPopup] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [trackingId, setTrackingId] = useState("");

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: "2005885129-bqkBBx3E" });
        if (!liff.isLoggedIn()) {
          // liff.login();
          setUserProfile({
            userId: "Ubfbafc869cc749d3e1264d3b0f0f88ec",
            displayName: "Stamp Test",
          });
        } else {
          const profile = await liff.getProfile();
          setUserProfile({
            userId: profile.userId,
            displayName: profile.displayName,
          });
          console.log("Profile:", profile);
        }
      } catch (error) {
        console.error("LIFF Initialization failed", error.message);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/orders`);
        setOrders(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    initLiff();
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    if (status === "สินค้าถึงไทย") {
      setCurrentOrderId(id);
      setShowTrackingPopup(true);
    } else {
      try {
        await axios.put(`http://localhost:3000/api/orders/${id}`, { status });
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === id ? { ...order, status } : order
          )
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleTrackingSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/orders/update-tracking/${currentOrderId}`,
        { tracking_th: trackingId, status: "สินค้าถึงไทย" } // Include status update here
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === currentOrderId
            ? { ...order, tracking_th: trackingId, status: "สินค้าถึงไทย" }
            : order
        )
      );
      setShowTrackingPopup(false);
      setTrackingId("");
      setCurrentOrderId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="container">
      <h1>จัดการ Order | ยินดีต้อนรับ คุณ{userProfile.displayName}</h1>
      <div className="table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>ชื่อ-สกุล/บริษัท</th>
              <th>วันที่สั่งซื้อ</th>
              <th>Total(THB)</th>
              <th>Tracking จีน</th>
              <th>Tracking ไทย</th>
              <th>บริษัทขนส่ง ไทย</th>
              <th>สถานะ</th>
              <th>คำสั่ง</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.name}</td>
                  <td>{formatDate(order.date)}</td>
                  <td>{order.price}</td>
                  <td>{order.tracking_cn}</td>
                  <td>
                    <a
                      href={`https://flashexpress.com/fle/tracking?se=${order.tracking_th}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {order.tracking_th}
                    </a>
                  </td>
                  <td>{order.shipping_brand}</td>
                  <td>{order.status}</td>
                  <td>
                    <select
                      value={order.status}
                      data-status={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.order_id, e.target.value)
                      }
                    >
                      <option value="สั่งซื้อสำเร็จ">สั่งซื้อสำเร็จ</option>
                      <option value="ร้านส่งสินค้า">ร้านส่งสินค้า</option>
                      <option value="สินค้าออกจากจีน">สินค้าออกจากจีน</option>
                      <option value="สินค้าถึงไทย">สินค้าถึงไทย</option>
                      <option value="ชำระค่าขนส่งแล้ว">ชำระค่าขนส่งแล้ว</option>
                      <option value="จัดส่งแล้ว">จัดส่งแล้ว</option>
                      <option value="ยกเลิกคำสั่งซื้อ">ยกเลิกคำสั่งซื้อ</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  None
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showTrackingPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>กรุณาใส่หมายเลขติดตามสินค้า</h2>
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Tracking ID"
            />
            <button onClick={handleTrackingSubmit}>อัปเดต</button>
            <button onClick={() => setShowTrackingPopup(false)}>ยกเลิก</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
