// app.js
const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors"); // Thêm package CORS
const port = 8888;

// Middleware để phân tích các yêu cầu JSON
app.use(express.json());

// Sử dụng middleware CORS để mở tất cả CORS
app.use(cors()); // Điều này sẽ cho phép tất cả các origin truy cập vào API của bạn

// Định nghĩa một route đơn giản
app.get("/authenticate/facebook", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("Missing code parameter");
    }

    const apiUrl = "https://graph.facebook.com/v21.0/oauth/access_token";
    const params = {
      redirect_uri: "http://localhost:3000/authenticate/facebook",
      client_id: "2017311942117851",
      client_secret: "25307798ca3801cde0e58bf0eb4c1095",
      code: code,
    };

    const response = await axios.get(apiUrl, { params });

    const urlGetInfo = "https://graph.facebook.com/v21.0/me";
    const paramsGetInfo = {
      fields: "id,email",
      access_token: response.data.access_token,
    };

    const responseGetInfo = await axios.get(urlGetInfo, {
      params: paramsGetInfo,
    });

    const combinedData = {
      ...response.data,
      ...responseGetInfo.data,
    };

    res.json(combinedData);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Error occurred while fetching data");
  }
});

app.get("/", async (req, res) => {
  res.send("Welcome");
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
