const express = require("express");
const { getAllUsers, addUser, deleteUser, updateUser, login, verify } = require("../controllers/userController");
const { getAllProducts, getSubCatogoryProducts,addProduct, updateProduct, deleteProduct  } = require("../controllers/productsController");
const router = express.Router();
// const passport = require("passport");

// Users section starts
router.post("/login", login);        // Login a users
router.delete("/delete/:id", deleteUser);   // Delete a user
router.post("/verify", verify);   // Verifiy a user
router.post("/createUser", addUser);   // Create a user
router.put("/update/:id", updateUser);      // Update an existing user
router.get("/", getAllUsers);        // Fetch all users

// Products section starts
router.get("/products", getAllProducts);        // Fetch all products
router.get("/subCatogery", getSubCatogoryProducts);     
router.post("/addProduct", addProduct);     // Add all products
router.put('/products/:id', updateProduct);
router.delete("/products/:id", deleteProduct);


module.exports = router;
