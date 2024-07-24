require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const axios = require("axios");
const cors = require("cors");
const { router: ordersRouter, sendLineMessage } = require("./routes/order");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  session({
    secret: "d3m0-ch@tb0t",
    resave: false,
    saveUninitialized: true,
  })
);

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use("/api/orders", ordersRouter);

app.post("/webhook", async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === "postback" && event.postback.data) {
      const data = event.postback.data;
      const parts = data.split("_");

      if (parts.length === 3) {
        const action = parts[0];
        const order_id = parts[1];
        const brand = parts[2];

        if (action === "shippingbrand") {
          const userId = "Ubfbafc869cc749d3e1264d3b0f0f88ec";

          try {
            const response = await axios.post(
              "http://localhost:3000/api/orders/select-shipping-brand",
              {
                userId,
                order_id,
                shipping_brand: brand,
              }
            );
            console.log("Shipping brand selection response:", response.data);
          } catch (error) {
            console.error(
              "Error calling shipping brand selection endpoint:",
              error.response ? error.response.data : error.message
            );
          }
        }
      } else if (parts.length === 2) {
        const action = parts[0];
        const order_id = parts[1];

        if (action === "confirm") {
          const userId = "Ubfbafc869cc749d3e1264d3b0f0f88ec";

          await sendReconfirmationMessage(userId, order_id);
        } else if (action === "select") {
          const userId = "Ubfbafc869cc749d3e1264d3b0f0f88ec";

          await sendShippingBrandSelectionQuickReply(userId, order_id);
        } else if (action === "reconfirm") {
          try {
            const response = await axios.post(
              "http://localhost:3000/api/orders/confirm-shipping",
              {
                order_id,
              }
            );
            console.log("Confirmation endpoint response:", response.data);
          } catch (error) {
            console.error(
              "Error calling confirmation endpoint:",
              error.response ? error.response.data : error.message
            );
          }
        }
      } else {
        console.error("Invalid postback data format:", data);
      }
    }
  }

  res.sendStatus(200);
});

const sendReconfirmationMessage = async (userId, order_id) => {
  const message = {
    type: "text",
    text: "คุณต้องการยืนยันการจัดส่งหรือไม่?",
    quickReply: {
      items: [
        {
          type: "action",
          action: {
            type: "postback",
            label: "ฉันได้รับสินค้าแล้ว",
            data: `reconfirm_${order_id}`,
            displayText: "ฉันได้รับสินค้าแล้ว",
          },
        },
        {
          type: "action",
          action: {
            type: "message",
            label: "ยังไม่ได้รับสินค้า",
            text: "ยังไม่ได้รับสินค้า",
          },
        },
      ],
    },
  };

  await sendLineMessage(userId, message);
};

const sendShippingBrandSelectionQuickReply = async (userId, order_id) => {
  const message = {
    type: "text",
    text: "กรุณาเลือกแบรนด์ขนส่ง",
    quickReply: {
      items: [
        {
          type: "action",
          action: {
            type: "postback",
            label: "J&T",
            data: `shippingbrand_${order_id}_J&T`,
            displayText: "J&T",
          },
        },
        {
          type: "action",
          action: {
            type: "postback",
            label: "Flash",
            data: `shippingbrand_${order_id}_Flash`,
            displayText: "Flash",
          },
        },
        {
          type: "action",
          action: {
            type: "postback",
            label: "Lalamove",
            data: `shippingbrand_${order_id}_Lalamove`,
            displayText: "Lalamove",
          },
        },
      ],
    },
  };

  await sendLineMessage(userId, message);
};

app.post("/test-message", async (req, res) => {
  const { userId } = req.body;
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
            text: "ทดสอบการส่งข้อความ",
            wrap: true,
            color: "#666666",
            size: "sm",
          },
        ],
      },
    },
  };

  try {
    await sendLineMessage(userId, message);
    res.json({ message: "Test message sent" });
  } catch (error) {
    console.error("Error sending test message:", error);
    res.status(500).json({ error: "Failed to send test message" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
