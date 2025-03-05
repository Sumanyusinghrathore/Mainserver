const { client } = require("../config/database");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

// Add a product to the wishlist
async function addToWishlist(req, res) {
  try {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const database = client.db("sample_mflix");
    const collection = database.collection("wishlist");

    const wishlistItem = {
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
      createdAt: new Date(),
    };

    await collection.insertOne(wishlistItem);
    res.status(201).json({ message: "Product added to wishlist", wishlistItem });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get user's wishlist
async function getWishlist(req, res) {
  try {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const database = client.db("sample_mflix");
    const collection = database.collection("wishlist");

    const wishlist = await collection.find({ userId: new ObjectId(userId) }).toArray();
    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Remove a product from the wishlist
async function removeFromWishlist(req, res) {
  try {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { productId } = req.params;
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid Product ID" });
    }

    const database = client.db("sample_mflix");
    const collection = database.collection("wishlist");

    const result = await collection.deleteOne({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found in wishlist" });
    }

    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
