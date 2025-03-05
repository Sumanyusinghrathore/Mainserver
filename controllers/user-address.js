const { client } = require("../config/database");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

// Add user address
async function addAddress(req, res) {
  try {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { type, street, city, state, zipCode, country } = req.body;

    if (!type || !street || !city || !state || !zipCode || !country) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const database = client.db("sample_mflix");
    const collection = database.collection("user_addresses");

    const address = {
      userId: new ObjectId(userId),
      type, // Home, Office, Other
      street,
      city,
      state,
      zipCode,
      country,
      createdAt: new Date(),
    };

    await collection.insertOne(address);
    res.status(201).json({ message: "Address added successfully", address });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get user addresses
async function getUserAddresses(req, res) {
  try {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const database = client.db("sample_mflix");
    const collection = database.collection("user_addresses");

    const addresses = await collection.find({ userId: new ObjectId(userId) }).toArray();
    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update user address
async function updateAddress(req, res) {
  try {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { addressId } = req.params;
    const { type, street, city, state, zipCode, country } = req.body;

    if (!ObjectId.isValid(addressId)) {
      return res.status(400).json({ error: "Invalid address ID" });
    }

    const database = client.db("sample_mflix");
    const collection = database.collection("user_addresses");

    const updatedAddress = {
      ...(type && { type }),
      ...(street && { street }),
      ...(city && { city }),
      ...(state && { state }),
      ...(zipCode && { zipCode }),
      ...(country && { country }),
      updatedAt: new Date(),
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(addressId), userId: new ObjectId(userId) },
      { $set: updatedAddress }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete user address
async function deleteAddress(req, res) {
  try {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { addressId } = req.params;

    if (!ObjectId.isValid(addressId)) {
      return res.status(400).json({ error: "Invalid address ID" });
    }

    const database = client.db("sample_mflix");
    const collection = database.collection("user_addresses");

    const result = await collection.deleteOne({ _id: new ObjectId(addressId), userId: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { addAddress, getUserAddresses, updateAddress, deleteAddress };
