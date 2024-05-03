const express = require("express");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
const { verifyToken } = require("./middlewares/auth.js");

const app = express();

app.use(express.json());

app.use(
    session({
        secret: "fingerprint_customer",
        resave: true,
        saveUninitialized: true,
    })
);

app.use("/customer/*", verifyToken);

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () =>
    console.log("Server is running on next URL: http://localhost:5000")
);
