const express = require("express");
const mysql = require("mysql2/promise");
const axios = require("axios");

const router = express.Router();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "demo",
});

const sendLineMessage = async (userId, message) => {
  const lineAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  try {
    console.log("Sending message to userId:", userId);
    console.log("Message content:", JSON.stringify(message, null, 2));

    await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: userId,
        messages: [message],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lineAccessToken}`,
        },
      }
    );
  } catch (error) {
    console.error(
      "Error sending LINE message",
      error.response ? error.response.data : error.message
    );
  }
};

const createFlexMessage = (
  customer_name,
  order_id,
  status,
  date,
  shipping_brand,
  tracking_th
) => {
  const buttons = [
    {
      type: "button",
      style: "link",
      height: "sm",
      action: {
        type: "uri",
        label: "ดูออเดอร์",
        uri: "http://localhost:3001/",
      },
    },
  ];

  if (status === "สินค้าออกจากจีน" && !shipping_brand) {
    buttons.push({
      type: "button",
      style: "primary",
      height: "sm",
      action: {
        type: "postback",
        label: "เลือกขนส่ง",
        data: `select_${order_id}`,
      },
    });
  } else if (status === "สินค้าถึงไทย" && tracking_th) {
    buttons.push({
      type: "button",
      style: "primary",
      height: "sm",
      action: {
        type: "postback",
        label: "ยืนยันการจัดส่ง",
        data: `confirm_${order_id}`,
      },
    });
  }

  return {
    type: "flex",
    altText: "อัปเดตสถานะการสั่งซื้อ",
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "อัปเดตสถานะการสั่งซื้อ",
            weight: "bold",
            color: "#1DB446",
            size: "sm",
          },
        ],
      },
      hero: {
        type: "image",
        url: "https://www.mockupworld.co/wp-content/uploads/2023/12/wrapped-parcel-free-mockup.jpg",
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `เรียน คุณ${customer_name},`,
            weight: "bold",
            size: "md",
          },
          {
            type: "text",
            text: `ออเดอร์ของคุณ #${order_id} ได้ถูกอัปเดตสถานะเป็น ${status}.`,
            wrap: true,
            color: "#666666",
            size: "sm",
          },
          {
            type: "separator",
            margin: "xxl",
          },
          {
            type: "box",
            layout: "horizontal",
            margin: "md",
            contents: [
              {
                type: "text",
                text: "Order ID",
                size: "sm",
                color: "#aaaaaa",
                flex: 1,
              },
              {
                type: "text",
                text: `${order_id}`,
                size: "sm",
                color: "#666666",
                flex: 2,
              },
            ],
          },
          {
            type: "box",
            layout: "horizontal",
            margin: "md",
            contents: [
              {
                type: "text",
                text: "สถานะ",
                size: "sm",
                color: "#aaaaaa",
                flex: 1,
              },
              {
                type: "text",
                text: `${status}`,
                size: "sm",
                color: "#666666",
                flex: 2,
              },
            ],
          },
          {
            type: "box",
            layout: "horizontal",
            margin: "md",
            contents: [
              {
                type: "text",
                text: "วันที่สั่งซื้อ",
                size: "sm",
                color: "#aaaaaa",
                flex: 1,
              },
              {
                type: "text",
                text: `${formatDate(date)}`,
                size: "sm",
                color: "#666666",
                flex: 2,
              },
            ],
          },
          ...(shipping_brand
            ? [
                {
                  type: "box",
                  layout: "horizontal",
                  margin: "md",
                  contents: [
                    {
                      type: "text",
                      text: "ขนส่ง",
                      size: "sm",
                      color: "#aaaaaa",
                      flex: 1,
                    },
                    {
                      type: "text",
                      text: `${shipping_brand}`,
                      size: "sm",
                      color: "#666666",
                      flex: 2,
                    },
                  ],
                },
              ]
            : []),
          ...(tracking_th
            ? [
                {
                  type: "box",
                  layout: "horizontal",
                  margin: "md",
                  contents: [
                    {
                      type: "text",
                      text: "Tracking No.",
                      size: "sm",
                      color: "#aaaaaa",
                      flex: 1,
                    },
                    {
                      type: "text",
                      text: `${tracking_th}`,
                      size: "sm",
                      color: "#666666",
                      flex: 2,
                    },
                  ],
                },
              ]
            : []),
        ],
      },
      footer: {
        type: "box",
        layout: "horizontal",
        spacing: "sm",
        contents: buttons,
        flex: 0,
      },
    },
  };
};

const createReconfirmationMessage = (order_id) => {
  return {
    type: "flex",
    altText: "ยืนยันการจัดส่ง",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "คุณต้องการยืนยันการจัดส่งหรือไม่?",
            weight: "bold",
            size: "md",
          },
          {
            type: "box",
            layout: "horizontal",
            margin: "md",
            contents: [
              {
                type: "button",
                style: "primary",
                height: "sm",
                action: {
                  type: "postback",
                  label: "ฉันได้รับสินค้าแล้ว",
                  data: `reconfirm_${order_id}`,
                },
              },
              {
                type: "spacer",
                size: "sm",
              },
            ],
          },
        ],
      },
    },
  };
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM orders ORDER BY order_id ASC");
  res.json(rows);
  console.log("/: GET DATA");
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const [orderRows] = await pool.query(
    "SELECT * FROM orders WHERE order_id = ?",
    [id]
  );

  if (orderRows.length === 0) {
    return res.status(404).json({ error: "Order not found" });
  }

  const order = orderRows[0];
  const { name: customer_name, order_id, date, shipping_brand } = order;

  await pool.query("UPDATE orders SET status = ? WHERE order_id = ?", [
    status,
    id,
  ]);

  const userId = "Ubfbafc869cc749d3e1264d3b0f0f88ec";

  if (userId) {
    const message = createFlexMessage(
      customer_name,
      order_id,
      status,
      date,
      shipping_brand
    );
    await sendLineMessage(userId, message);
  }

  res.json({ message: "Order status updated" });
});

router.post("/confirm-shipping", async (req, res) => {
  const { order_id } = req.body;
  const userId = "Ubfbafc869cc749d3e1264d3b0f0f88ec";
  console.log(
    "Confirm shipping request received for order:",
    order_id,
    "User:",
    userId
  );

  try {
    // Update order status to confirmed
    const [result] = await pool.query(
      "UPDATE orders SET status = 'จัดส่งสำเร็จ' WHERE order_id = ?",
      [order_id]
    );
    // console.log("Order update result:", result); // Add this line

    // Send confirmation message to the user
    const message = {
      type: "flex",
      altText: "ยืนยันการจัดส่ง",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "การจัดส่งได้รับการยืนยันแล้ว",
              weight: "bold",
              size: "md",
            },
            {
              type: "text",
              text: `ออเดอร์หมายเลข #${order_id} ได้รับการยืนยันว่าได้รับสินค้าเรียบร้อยแล้ว`,
              wrap: true,
              color: "#666666",
              size: "sm",
            },
          ],
        },
      },
    };

    await sendLineMessage(userId, message);
    console.log("Shipping confirmed and message sent");
    res.json({ message: "Shipping confirmed and message sent" });
  } catch (error) {
    console.error("Error confirming shipping:", error);
    res.status(500).json({ error: "Failed to confirm shipping" });
  }
});

router.post("/select-shipping-brand", async (req, res) => {
  const { order_id, shipping_brand } = req.body;
  const userId = "Ubfbafc869cc749d3e1264d3b0f0f88ec";

  console.log(
    "Shipping brand selection received for order:",
    order_id,
    "User:",
    userId,
    "Brand:",
    shipping_brand
  );

  try {
    const [result] = await pool.query(
      "UPDATE orders SET shipping_brand = ? WHERE order_id = ?",
      [shipping_brand, order_id]
    );
    console.log("Shipping brand update result:", result);

    // Fetch the updated order details
    const [orderRows] = await pool.query(
      "SELECT * FROM orders WHERE order_id = ?",
      [order_id]
    );
    const order = orderRows[0];
    const {
      name: customer_name,
      order_id: ord_id,
      status,
      date,
      tracking_th,
    } = order;

    // Send regular flex message to the user
    const message = createFlexMessage(
      customer_name,
      ord_id,
      status,
      date,
      shipping_brand,
      "รอสินค้าถึงไทย"
    );
    await sendLineMessage(userId, message);

    res.json({
      message: "Shipping brand selected and regular flex message sent",
    });
  } catch (error) {
    console.error("Error selecting shipping brand:", error);
    res.status(500).json({ error: "Failed to select shipping brand" });
  }
});

router.put("/update-tracking/:id", async (req, res) => {
  const { id } = req.params;
  const { tracking_th, status } = req.body;

  try {
    // Update order with the tracking number and status
    const [result] = await pool.query(
      "UPDATE orders SET tracking_th = ?, status = ? WHERE order_id = ?",
      [tracking_th, status, id]
    );
    console.log("Order update result:", result);

    // Fetch the updated order details
    const [orderRows] = await pool.query(
      "SELECT * FROM orders WHERE order_id = ?",
      [id]
    );
    const order = orderRows[0];
    const {
      name: customer_name,
      order_id,
      status: updatedStatus,
      date,
      shipping_brand,
    } = order;
    const userId = "Ubfbafc869cc749d3e1264d3b0f0f88ec";

    // Send updated flex message to the user
    const message = createFlexMessage(
      customer_name,
      order_id,
      updatedStatus,
      date,
      shipping_brand,
      tracking_th
    );
    await sendLineMessage(userId, message);

    res.json({
      message: "Tracking number and status updated, and flex message sent",
    });
  } catch (error) {
    console.error("Error updating tracking number and status:", error);
    res
      .status(500)
      .json({ error: "Failed to update tracking number and status" });
  }
});

// router.put("/update-tracking/:id", async (req, res) => {
//   const { id } = req.params;
//   const { tracking_th } = req.body;

//   try {
//     // Update order with the tracking number
//     const [result] = await pool.query(
//       "UPDATE orders SET tracking_th = ? WHERE order_id = ?",
//       [tracking_th, id]
//     );
//     console.log("Order update result:", result);

//     // Fetch the updated order details
//     const [orderRows] = await pool.query(
//       "SELECT * FROM orders WHERE order_id = ?",
//       [id]
//     );
//     const order = orderRows[0];
//     const {
//       name: customer_name,
//       order_id,
//       status,
//       date,
//       shipping_brand,
//     } = order;
//     const userId = "Ubfbafc869cc749d3e1264d3b0f0f88ec";

//     // Send updated flex message to the user
//     const message = createFlexMessage(
//       customer_name,
//       order_id,
//       status,
//       date,
//       shipping_brand,
//       tracking_th
//     );
//     await sendLineMessage(userId, message);

//     res.json({
//       message: "Tracking number updated and flex message sent",
//     });
//   } catch (error) {
//     console.error("Error updating tracking number:", error);
//     res.status(500).json({ error: "Failed to update tracking number" });
//   }
// });

module.exports = {
  router,
  sendLineMessage, // Export the sendLineMessage function
};
