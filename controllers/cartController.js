const { client } = require("../config/database");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

// Add product to cart
async function addToCart(req, res) {
  try {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { productId, name, size, color, image, quantity } = req.body;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const database = client.db("sample_mflix");
    const collection = database.collection("cart");

    const cartItem = {
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
      name,
      size,
      color,
      image,
      quantity: parseInt(quantity, 10) || 1,
      createdAt: new Date(),
    };

    await collection.insertOne(cartItem);
    res.status(201).json({ message: "Product added to cart", cartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get user cart
async function getUserCart(req, res) {
  try {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const database = client.db("sample_mflix");
    const collection = database.collection("cart");

    const cartItems = await collection.find({ userId: new ObjectId(userId) }).toArray();
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update cart item quantity
async function updateCartItem(req, res) {
  try {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { cartItemId, quantity } = req.body;

    if (!ObjectId.isValid(cartItemId)) {
      return res.status(400).json({ error: "Invalid cart item ID" });
    }

    const database = client.db("sample_mflix");
    const collection = database.collection("cart");

    const result = await collection.updateOne(
      { _id: new ObjectId(cartItemId), userId: new ObjectId(userId) },
      { $set: { quantity: parseInt(quantity, 10), updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete cart item
async function deleteCartItem(req, res) {
  try {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { cartItemId } = req.params;

    if (!ObjectId.isValid(cartItemId)) {
      return res.status(400).json({ error: "Invalid cart item ID" });
    }

    const database = client.db("sample_mflix");
    const collection = database.collection("cart");

    const result = await collection.deleteOne({ _id: new ObjectId(cartItemId), userId: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { addToCart, getUserCart, updateCartItem, deleteCartItem };
