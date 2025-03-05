const { client } = require("../config/database");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

// Fetch all users
// Fetch all users
async function getAllUsers(req, res) {
  try {
    const database = client.db("sample_mflix");
    const collection = database.collection("users");

    // Fetch all users from the collection
    const users = await collection.find({}).toArray();

    // Directly return the array of users
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function login(req, res) {
  const database = client.db("sample_mflix");
  const collection = database.collection("users");

  // Fetch all users from the collection
  const users = await collection.find({}).toArray();
  const { email, password } = req.body;
  
  const user = users.find((u) => {
    return u.email === email && u.password === password;
  });
  if (user) {
    // jwt genrate
    const accessToken = jwt.sign({ id: user._id, email: user.email }, "myAccessToken");
    res.json(accessToken);
  } else {
    res.status(400).json("not good")
  }
}

async function verify(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json("InActive2");
    }

    // Decode the token
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.id) {
      return res.status(400).json("InActive3");
    }

    const database = client.db("sample_mflix");
    const collection = database.collection("users");

    // Fetch user based on decoded ID
    const user = await collection.findOne({ _id: new ObjectId(decoded.id) });

    if (user) {
      res.json("Active");
    } else {
      res.json("InActive1");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json("InActive3");
  }
}

// Delete a user by ID
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const database = client.db("sample_mflix");
    const collection = database.collection("users");
    const decoded = jwt.decode(id);

    // Convert the string ID to an ObjectId
    const result = await collection.deleteOne({ _id: new ObjectId(decoded.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Add a new user
async function addUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const database = client.db("sample_mflix");
    const collection = database.collection("users");

    // Insert the new user into the database
    const result = await collection.insertOne({ name, email, password });

    // Respond with the inserted user
    res.status(201).json({
      message: "User added successfully",
      user: { _id: result.insertedId, name, email, password },
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}



async function updateUser(req, res) {
  try {
    const { id } = req.params; // Get user ID from the request parameters
    const { name, email, password, address, phone, profile_image } = req.body; // Get updated data from the request body
    const decoded = jwt.decode(id);
    // Validate input
    // if (!name || !email || !password || !address || !phone) {
    //   return res.status(400).json({ error: "All fields are required." });
    // }

    const database = client.db("sample_mflix");
    const collection = database.collection("users");

    // Update the user in the database
    const result = await collection.updateOne(
      { _id: new ObjectId(decoded.id) },
      { $set: { name, email, password, address, phone, profile_image } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


module.exports = { verify, login, getAllUsers, addUser, deleteUser, updateUser };
