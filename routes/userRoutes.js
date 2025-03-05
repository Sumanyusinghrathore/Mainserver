const express = require("express");
const {
  getAllUsers,
  addUser,
  deleteUser,
  updateUser,
  login,
  verify,
} = require("../controllers/userController");
const {
  getAllProducts,
  getSubCatogoryProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");
const {
  addToCart,
  getUserCart,
  updateCartItem,
  deleteCartItem,
} = require("../controllers/cartController");
const {
  addToWishlist,
  getUserWishlist,
  removeWishlistItem,
} = require("../controllers/wishlistController");
const {
  requestReturn,
  getReturnRequests,
  completeReturn,
} = require("../controllers/returnController");
const {
  addUserAddress,
  getUserAddresses,
  deleteUserAddress,
} = require("../controllers/userAddressController");

const router = express.Router();

// User routes
router.post("/login", login); // User login
router.post("/verify", verify); // Verify a user
router.post("/createUser", addUser); // Create a new user
router.get("/emails", getAllUsers); // Fetch all users
router.put("/update/:id", updateUser); // Update user
router.delete("/delete/:id", deleteUser); // Delete user

// Product routes
router.get("/products", getAllProducts); // Fetch all products
router.get("/subCategory", getSubCatogoryProducts); // Fetch products by sub-category
router.post("/addProduct", addProduct); // Add a product
router.put("/products/:id", updateProduct); // Update a product
router.delete("/products/:id", deleteProduct); // Delete a product

// Cart routes
router.post("/cart/add", addToCart); // Add product to cart
router.get("/cart", getUserCart); // Get user cart
router.put("/cart/update", updateCartItem); // Update cart item
router.delete("/cart/delete/:cartItemId", deleteCartItem); // Delete cart item

// Wishlist routes
router.post("/wishlist/add", addToWishlist); // Add product to wishlist
router.get("/wishlist", getUserWishlist); // Get user wishlist
router.delete("/wishlist/delete/:wishlistItemId", removeWishlistItem); // Remove wishlist item

// Return & Complete Product Routes
router.post("/return/request", requestReturn); // Request product return
router.get("/return", getReturnRequests); // Get return requests (pending/completed)
router.put("/return/complete/:returnId", completeReturn); // Mark return as completed

// User Address Routes
router.post("/address/add", addUserAddress); // Add user address
router.get("/address", getUserAddresses); // Get user addresses
router.delete("/address/delete/:addressId", deleteUserAddress); // Delete user address

module.exports = router;
