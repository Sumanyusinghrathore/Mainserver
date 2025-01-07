const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());
// app.use(
//     session({
//       secret: "randomlyGeneratedSecureKey", // Replace with a secure secret key
//       resave: false,
//       saveUninitialized: false,
//     })
//   );

// // Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// Use routes without a base path
app.use("/", userRoutes);

module.exports = app;
