const { client } = require("../config/database");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

// Add a return request
async function requestReturn(req, res) {
  try {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    const { orderId, reason } = req.body;
    if (!orderId || !reason) {
      return res.status(400).json({ error: "Order ID and reason are required" });
    }

    const database = client.db("sample_mflix");
    const collection = database.collection("return_complete_product");
    
    const returnRequest = {
      userId: new ObjectId(userId),
      orderId: new ObjectId(orderId),
      reason,
      status: "Pending",
      createdAt: new Date(),
    };
    
    await collection.insertOne(returnRequest);
    res.status(201).json({ message: "Return request submitted successfully", returnRequest });
  } catch (error) {
    console.error("Error submitting return request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get return requests (pending, completed, running, dispatched)
async function getReturnRequests(req, res) {
  try {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    const { status } = req.query; // Pending, Completed, Running, Dispatched
    const query = { userId: new ObjectId(userId) };
    if (status) query.status = status;
    
    const database = client.db("sample_mflix");
    const collection = database.collection("return_complete_product");
    
    const returnRequests = await collection.find(query).toArray();
    res.status(200).json(returnRequests);
  } catch (error) {
    console.error("Error fetching return requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update product status (Pending, Running, Dispatched, Completed)
async function updateProductStatus(req, res) {
  try {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    const { returnId } = req.params;
    const { status } = req.body;
    if (!ObjectId.isValid(returnId)) {
      return res.status(400).json({ error: "Invalid return ID" });
    }
    if (!status || !["Pending", "Running", "Dispatched", "Completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    
    const database = client.db("sample_mflix");
    const collection = database.collection("return_complete_product");
    
    const result = await collection.updateOne(
      { _id: new ObjectId(returnId), userId: new ObjectId(userId) },
      { $set: { status, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Return request not found" });
    }
    
    res.status(200).json({ message: `Product status updated to ${status}` });
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { requestReturn, getReturnRequests, updateProductStatus };