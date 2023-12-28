const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const secretKey = "secretKey";

app.get("/", (req, resp) => {
  resp.json({
    message: "a sample api",
  });
});

app.post("/login", (req, resp) => {
  const user = {
    id: 1,
    username: "vishal",
    email: "abc@test.com",
  };

  jwt.sign({ user }, secretKey, { expiresIn: "300s" }, (err, token) => {
    resp.json({
      token,
    });
  });
});

app.post("/profile", verifyToken, (req, resp) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      resp.send({
        result: "Invalid token",
      });
    } else {
      resp.json({
        message: "profile accessed",
        authData,
      });
    }
  });
});

function verifyToken(req, resp, next) {
  const bearerHeader = req.headers["authorization"];
  console.log("bearerHeader", bearerHeader);
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    resp.send({
      result: "Token is not valid",
    });
  }
}

app.listen(5060, () => {
  console.log("app is running on 5060 port");
});
